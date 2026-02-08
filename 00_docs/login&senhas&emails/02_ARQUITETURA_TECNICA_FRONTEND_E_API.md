**Documento:**
Arquitetura Técnica do Frontend — Autenticação, APIs e Riscos

**Data:**
2026-02-08

---

## 1. Finalidade deste documento

Este documento é **exclusivamente técnico**.

Ele existe para:

* desenvolvedores frontend
* desenvolvedores backend
* manutenção futura
* handoff de projeto
* evitar regressões críticas

Ele documenta:

* estrutura do frontend
* contratos de API
* regras que **não podem ser quebradas**
* pontos sensíveis do sistema

Este documento deve ser lido **antes de qualquer alteração** no código.

---

## 2. Stack oficial (fonte da verdade)

Confirmado via `package.json`:

* Next.js **16.1.6**
* React **19.2.3**
* App Router (`src/app`)
* TypeScript
* Tailwind CSS
* Context API (sem Redux / Zustand)

---

## 3. Estrutura de diretórios crítica

```
src/
 ├─ app/
 │   ├─ login/
 │   ├─ register/
 │   ├─ forgot-password/
 │   ├─ reset-password/
 │   ├─ email-not-verified/
 │   ├─ check-your-email/
 │   └─ dashboard/
 │
 ├─ components/
 │   └─ MeContext.tsx
 │
 ├─ services/
 │   ├─ http.ts
 │   ├─ auth.ts
 │   ├─ me.ts
 │   └─ signup.ts
 │
 ├─ stores/
 │   └─ auth.ts
```

---

## 4. `services/http.ts` — componente mais crítico

Responsabilidades:

* adiciona `Authorization: Bearer`
* gerencia refresh token via cookie
* reexecuta requests automaticamente
* lança `HttpError` com:

  * `status`
  * `body`

### ⚠️ RISCO

Qualquer alteração aqui pode quebrar:

* login
* refresh
* `/api/v1/me`
* OAuth Google
* redirecionamentos automáticos

---

## 5. `MeContext.tsx` — controle de sessão

Responsável por:

* carregar `/api/v1/me`
* definir:

  * `me`
  * `loading`

### Regra de ouro

* Login **NUNCA redireciona diretamente**
* Redirecionamento só acontece quando:

  ```ts
  loading === false && me !== null
  ```

---

## 6. Endpoint `/api/v1/me` (contrato obrigatório)

```http
GET /api/v1/me
Authorization: Bearer <token>
Cookie: refresh_token
```

Se este endpoint falhar:

* o usuário **não entra**
* tokens são limpos
* estado volta para “deslogado”

---

## 7. Fluxo técnico de login

1. `POST /api/login`
2. Backend seta cookies (refresh)
3. Frontend chama `/api/v1/me`
4. Se sucesso:

   * `me` preenchido
   * Dashboard liberado
5. Se falha:

   * sessão é descartada

Nunca mudar essa ordem.

---

## 8. Contrato de redefinição de senha (resumo)

### Solicitar token

```
POST /api/public/password/reset/request
```

Resposta sempre neutra.

### Confirmar nova senha

```
POST /api/public/password/reset/confirm
```

Body:

```json
{
  "token": "string",
  "new_password": "string"
}
```

---

## 9. Regra oficial de senha (frontend)

Regex:

```ts
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,12}$/
```

Mensagem oficial (não alterar texto):

> A senha deve ter entre 5 e 12 caracteres e conter letras maiúsculas, letras minúsculas e números. Caracteres especiais são opcionais.

Usar em:

* cadastro
* redefinição de senha
* reforço visual no login

---

## 10. Regras que **NÃO PODEM** ser violadas

* ❌ Nunca assumir login sem `/me`
* ❌ Nunca usar `/api/me`
* ❌ Nunca expor se e-mail existe
* ❌ Nunca tratar erro por texto solto
* ❌ Nunca alterar regex sem alinhar backend
* ❌ Nunca remover mensagens neutras

---

## 11. Conclusão técnica

Este frontend:

* já resolve autenticação complexa
* está seguro contra enumeração
* depende de contratos rígidos

Qualquer alteração sem entender este documento **pode quebrar produção**.
