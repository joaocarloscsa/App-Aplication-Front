```markdown
document:
  name: 01_READ_FIRST.md
  path: frontend/docs-book/
  format: markdown
  status: canônico
  created_at: 2026-02-04
  updated_at: 2026-02-04
  effective_from: 2026-02-04
  scope: alinhamento conceitual frontend, modelo mental do projeto e princípios fundamentais

---

# LEIA ANTES DE QUALQUER COISA  
## Documentação Oficial do Frontend — Plataforma GSA ANIMAL

**Status:** Canônico  
**Leitura:** Obrigatória  
**Escopo:** Modelo mental, responsabilidades do frontend e limites de atuação  
**Não substitui:** o protocolo operacional (`00_PROTOCOL.md`)

---

## 1. Finalidade deste documento

Este documento existe para alinhar **como o frontend deve ser pensado**, não apenas como deve ser codado.

Ele é obrigatório para qualquer pessoa que vá:

- iniciar o projeto frontend;
- evoluir telas ou fluxos;
- integrar com o backend;
- mexer em autenticação;
- tomar decisões técnicas ou arquiteturais.

Ignorar este documento gera **erros previsíveis**, principalmente em autenticação, bootstrap e consistência de estado.

---

## 2. O papel do frontend neste sistema

O frontend **não é dono do domínio**.

O frontend:

- consome contratos definidos pelo backend;
- reage ao estado entregue pela API;
- nunca infere regras de negócio;
- nunca valida autorização por conta própria;
- nunca cria “atalhos” para acelerar fluxos.

O backend é a autoridade final.

---

## 3. Princípio central (não negociável)

> **Frontend não decide quem está autenticado.**  
> **Frontend apenas pergunta.**

No GSA ANIMAL:

- Login **não** confirma autenticação
- OAuth **não** confirma autenticação
- Redirect **não** confirma autenticação
- Cookie **não** confirma autenticação

A **única fonte de verdade** é o endpoint:

    /api/v1/me

Se `/api/v1/me` falhar, o usuário **não está logado**.

---

## 4. Modelo mental correto

```

Usuário → Login / OAuth
↓
Access Token recebido
↓
Chamada /api/v1/me
↓
200 → usuário autenticado
Erro → usuário NÃO autenticado

```

Qualquer fluxo que pule essa sequência está errado.

---

## 5. Responsabilidades do frontend

O frontend é responsável por:

- iniciar fluxos de login e OAuth;
- armazenar **temporariamente** o access token em memória;
- anexar o token corretamente em chamadas protegidas;
- executar refresh silencioso quando necessário;
- bloquear renderização de rotas protegidas até confirmação do `/me`;
- limpar completamente o estado no logout.

O frontend **não é responsável** por:

- validar permissões;
- interpretar papéis;
- inferir acesso;
- persistir sessão local;
- decidir segurança.

---

## 6. Escopo técnico fechado

Este frontend é construído com:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- fetch nativo
- React Context para autenticação
- JWT (access + refresh)

Qualquer desvio exige **revisão documental explícita**.

---

## 7. Como este projeto deve evoluir

A ordem correta de evolução é sempre:

1. contrato e documentação
2. core (auth, http, bootstrap)
3. guards e estado global
4. UI mínima
5. UI evolutiva

Começar por telas antes do core é erro grave.

---

## 8. Erros clássicos que este documento existe para evitar

- considerar login como autenticação
- guardar JWT em cookie ou storage
- confiar em redirect OAuth
- proteger páginas individualmente
- duplicar estado de usuário
- fazer fetch fora da camada de services

Esses erros **não são hipotéticos**.  
Eles já quebraram sistemas reais.

---

## 9. Regra final

> Se o frontend precisa “deduzir” algo, o contrato está errado.

Nesse caso:

- pare;
- documente;
- alinhe com o backend;
- só depois escreva código.

---

## Próximo passo obrigatório

Antes de qualquer código:

Criar a base conceitual do frontend.

Arquivo esperado:

    frontend/docs-book/01_base/BASE-CONCEITUAL-INICIAL.md

---

Fim do documento
```
