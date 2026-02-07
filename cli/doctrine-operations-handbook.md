Perfeito — segue a **versão expandida do guia operacional**, incluindo fluxos seguros, procedimentos recomendados, diretrizes de versionamento e operações de recuperação.
Salve como:

**docs/dev/cli-doctrine-operations-handbook.md**


CREATE EXTENSION IF NOT EXISTS pgcrypto;
---

## **Guia Operacional — Banco de Dados, Doctrine e Ambiente da Plataforma**

### **Objetivo**

Este documento padroniza o uso de comandos de infraestrutura do backend, reduz riscos operacionais e garante consistência entre ambientes.

### lista de diretórios:

 tree -L 4 backend/src

 find backend/src -maxdepth 4 -type d

 
find . \
  -not -path "./var/*" \
  -not -path "./vendor/*" 
  -not -path "./var/cache/*" \
  -not -path "./migrations/*" \
  -not -path "./bin/tests/*" \
  -not -path "./docs*/*" \
  -ls


  find -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*"

### cd docs-book && find . -type f -print | sort


### TESTES
### LIMPAR BANCO
export APP_ENV=test
php bin/console doctrine:database:drop --force --if-exists
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:fixtures:load --no-interaction

Rodar os testes
php bin/phpunit


Ou apenas os de segurança:

php bin/phpunit tests/Integration/Security


---
### vendor/bin/phpunit tests/Domain/AccessControl
### psql -h 127.0.0.1 -U app_user -d app_db -c "\d permission_catalog"

### pg_dump  -h 127.0.0.1 -U app_user -d app_db --schema-only --no-owner --no-privileges --format=p > schema.sql


APP_ENV=test php bin/console doctrine:query:sql \
"SELECT id, email, roles, created_at FROM user_account ORDER BY id"


APP_ENV=test php bin/console app:user:create-admin




## **1) Fluxos Operacionais Padrão**

### **1.1 — Ciclo seguro após alteração de entidades**

```
php bin/console doctrine:mapping:info
php bin/console doctrine:schema:validate
php bin/console make:migration
php bin/console doctrine:migrations:migrate



php bin/console cache:clear --no-warmup
php bin/console cache:warmup
./bin/reset-test-db.sh
php bin/phpunit

php bin/console cache:clear
php bin/console cache:clear -e test
php -d opcache.enable_cli=0 bin/phpunit




rm -rf var/cache/*
rm -rf var/log/*
php bin/console cache:clear

2️⃣ Limpar cache de metadata do Doctrine explicitamente

php bin/console doctrine:cache:clear-metadata
php bin/console doctrine:cache:clear-query
php bin/console doctrine:cache:clear-result
```

**Regras**

* nunca editar tabelas manualmente enquanto houver migrations
* commits devem incluir entidades + migrations
* migrations não devem ser reescritas após push

---

### **1.2 — Reset completo do ambiente (DEV)**

```
APP_ENV=dev php bin/console doctrine:schema:drop --full-database --force
APP_ENV=dev php bin/console doctrine:schema:create
APP_ENV=dev php bin/console doctrine:migrations:migrate
APP_ENV=dev php bin/console doctrine:fixtures:load
APP_ENV=test php bin/console app:user:create-admin
```

**Usar somente em ambiente de desenvolvimento.**

---

### **1.3 — Reset preservando dados (quando possível)**

```
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load --append
```

**Quando usar**

* reprocessar fixtures incrementais
* adicionar permissões base
* sem destruir dados já existentes

---

### **1.4 — Bootstrap de nova instância da plataforma**

```
composer install
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load --append
php bin/console app:user:create-admin
```

---

## **2) Dados iniciais obrigatórios**

Os seguintes registros devem existir após bootstrap:

* catálogo de permissões
* roles base de organização
* ACL defaults (allow/deny)
* estados de conta
* usuário administrador inicial

Se fixtures falharem, revisar:

```
php bin/console doctrine:schema:validate
```

---

## **3) Operações de Segurança & Autenticação**

Ver rotas de login:

```
php bin/console debug:router | grep login
```

Testar providers e autenticação:

```
php bin/console security:check
```

Regerar usuário admin:

```
php bin/console app:user:create-admin
```

---

## **4) Versionamento de Migrations**

### **Boas práticas**

* 1 migration por alteração de modelo
* nunca editar migrations antigas já aplicadas
* rollback somente em DEV
* migrations fazem parte do versionamento do domínio

### **Erros comuns a evitar**

* fixtures criando tabelas (não pode)
* migrations alteradas após push
* executar SQL manual e esquecer migration correspondente

---

## **5) Logs, Debug e Diagnóstico**

Logs da aplicação:

```
tail -f var/log/dev.log
```

Logs do servidor:

```
symfony server:log
```

Inspecionar container DI:

```
php bin/console debug:container
```

Rebuild de cache:

```

bin/phpunit tests





---

## **6) Acesso ao Banco via CLI**

### PostgreSQL

```
psql -U app_user -d app_db
\dt
\q
```

### MySQL/MariaDB

```
mysql -u app_user -p app_db
show tables;
exit;
```

---

## **7) Procedimentos de Recuperação**

### **7.1 — Migration falhou no meio**

```
php bin/console doctrine:migrations:status
php bin/console doctrine:migrations:migrate
```

Se tabela parcialmente criada → corrigir schema e rodar novamente.

---

### **7.2 — Inconsistência entre banco e entidades**

```
php bin/console doctrine:schema:validate
```

Se houver divergência → gerar migration correta, nunca editar DB manualmente.

---

### **7.3 — Login não funciona após reset**

Verificar:

```
select * from user_account;
```

Campos obrigatórios:

* is_active = true
* is_verified = true
* senha com hash válido

Recriar admin:

```
php bin/console app:user:create-admin
```

---

## **8) Convenções do Projeto**

* Pessoa é sempre pessoa
* Organização é sempre organização
* Papéis são atribuídos via relacionamentos
* ACL é aplicada por role + membership
* histórico clínico é imutável (somente append)

---


Boa pergunta — ainda não estava explícito no documento. Vou acrescentar aqui a seção específica sobre **como subir o servidor local e acessar a aplicação**.

Inclua este trecho no mesmo handbook.

---

## **9) Subindo o servidor local (Symfony CLI / PHP built-in server)**

### **9.1 — Iniciar o servidor de desenvolvimento (recomendado)**

```
symfony server:start -d
```

* `-d` executa em background
* A aplicação ficará disponível em algo como:

```
https://127.0.0.1:8000
```

Verifique o status:

```
symfony server:status
```

Parar o servidor:

```
symfony server:stop
```

---

### **9.2 — Iniciar sem background (modo foreground)**

```
symfony serve
```

Pressione `Ctrl + C` para encerrar.

---

### **9.3 — Usando servidor PHP embutido (alternativa sem Symfony CLI)**

```
php -S 127.0.0.1:8000 -t public
```

---

### **9.4 — Acessar a página de login**

Abra no navegador:

```
http://127.0.0.1:8000/login
```

Ou liste rotas para confirmar:

```
php bin/console debug:router | grep login
```

---

### **9.5 — Se a página não abrir**

Checklist rápido:

```
composer install
php bin/console cache:clear
php bin/console doctrine:migrations:migrate
symfony server:stop
symfony server:start -d
```

---

Se quiser, eu também posso gerar um **Guia de Operação Frontend + Backend juntos**, incluindo proxy, CORS e ambientes integrados.




## **Sugestão de estrutura de documentos**

```
docs/
 ├─ dev/
 │   ├─ cli-doctrine-cheatsheet.md
 │   ├─ cli-doctrine-operations-handbook.md   ← (este arquivo)
 │   ├─ data-bootstrap-rules.md
 │   └─ security-auth-flow.md
```

dig gsapetcare.com +short
dig gsapetcare.com A



curl -I https://gsa-animal.local/api/login \
  -H "Origin: http://localhost:3001"


curl -i -X OPTIONS https://gsa-animal.local/api/login \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST"



curl -i -X POST https://gsa-animal.local/api/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{
    "email": "joao@gmail.com",
    "password": "12345"
  }'



  curl -i -X POST https://gsa-animal.local/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@gmail.com","password":"12345"}'

  curl -i -X POST https://gsa-animal.local/api/tokencurl -i -X POST https://gsa-animal.local/api/token/refresh   --cookie "refresh_token= ..."
