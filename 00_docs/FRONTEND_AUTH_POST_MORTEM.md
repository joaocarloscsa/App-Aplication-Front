document:
  name: FRONTEND_AUTH_POST_MORTEM.md
  path: frontend/00_docs/
  format: markdown
  status: histórico / post-mortem
  created_at: 2026-02-04
  updated_at: 2026-02-04
  effective_from: 2026-02-04
  scope: autenticação frontend, integração com backend, prevenção de regressões críticas, regras imutáveis de login

---

# FRONTEND AUTH — PÓS-MORTE TÉCNICO  
## Plataforma GSA Animal

Este documento registra **o que realmente aconteceu** durante a implementação do login frontend, **por que um fluxo aparentemente simples se tornou instável**, e **quais regras NÃO podem ser violadas** para que o sistema continue funcionando.

Ele existe para evitar que este problema **se repita**.

Este documento **não é opinativo**.  
Ele descreve **fatos técnicos observados** e **regras derivadas desses fatos**.

---

## 1. Sintoma observado

O sistema apresentava comportamentos intermitentes e contraditórios:

- login às vezes funcionava e depois parava;
- frontend recebia `200 OK`, mas voltava para `/login`;
- nenhuma requisição aparecia no backend;
- alterações aparentemente inocentes quebravam tudo;
- debug era feito em múltiplas camadas ao mesmo tempo (frontend, backend, Apache, CORS).

O resultado prático foi **perda total de previsibilidade**.

---

## 2. Fato central (causa raiz)

O problema **NÃO era o login em si**.

O problema foi a **combinação simultânea de erros conceituais**, que juntos criaram um sistema impossível de raciocinar:

- mistura de modelos de autenticação;
- quebra do contrato frontend ↔ backend;
- leitura incorreta de variáveis de ambiente no App Router;
- múltiplas fontes de verdade sobre “estar logado”.

Nenhum desses erros isoladamente é fatal.  
**Todos juntos são.**

---

## 3. Erro conceitual nº 1 — Confundir login com autenticação confirmada

Durante grande parte do processo, o frontend tratava:

- `POST /api/login 200`  
como se fosse  
- “usuário autenticado”.

Isso é **conceitualmente falso**.

### Regra canônica

Autenticação confirmada = **GET `/api/v1/me` retornando 200**

Nada mais.

Se `/me` falhar:
- o usuário **não está logado**
- o frontend **deve se comportar como não autenticado**

Essa regra governa **100% do fluxo**.

---

## 4. Erro conceitual nº 2 — Estado duplicado de autenticação

Havia tentativas implícitas (ou tentação) de:

- inferir login por redirect;
- inferir login por token existente;
- inferir login por cookie;
- inferir login por sucesso anterior.

Isso cria **estado paralelo**.

### Regra canônica

Existe **apenas um estado de autenticação**:

- `MeContext.me`

Se `me === null` → não autenticado  
Se `me !== null` → autenticado

Nenhuma outra lógica é permitida.

---

## 5. Erro conceitual nº 3 — Uso incorreto de variáveis de ambiente no App Router

Foi tentado:

- ler `process.env` dinamicamente;
- usar funções (`getEnv()`) em código client-side;
- validar env em runtime no bundle.

No App Router com Turbopack, isso **quebra o build** ou gera comportamento não determinístico.

### Regra canônica

Variáveis de ambiente no frontend:

- devem ser lidas **uma única vez**
- devem ser exportadas como **objeto estático**
- não podem depender de função em runtime

O objeto `ENV` é **imutável**.

Qualquer tentativa de mudar isso **quebra o login**.

---

## 6. Erro conceitual nº 4 — Confusão entre access token e refresh token

Houve dúvida sobre:

- “token grande”
- “token correto”
- “token que deveria ir para o frontend”

### Fato técnico definitivo

- **Access Token**
  - vai no body do `/api/login`
  - fica **somente em memória JS**
  - vai no header `Authorization`
- **Refresh Token**
  - **NUNCA aparece no frontend**
  - **NUNCA vem no body**
  - vive **somente em cookie HttpOnly**
  - só é usado pelo endpoint `/api/token/refresh`

Não ver refresh token no frontend **é o comportamento correto**.

---

## 7. Erro conceitual nº 5 — Misturar responsabilidades no HTTP client

O `http.ts` chegou a conter:

- leitura dinâmica de env;
- lógica de refresh incorreta;
- credentials inconsistentes;
- múltiplas fontes de URL base.

Isso tornava impossível prever:

- quando uma request iria falhar;
- quando o refresh iria ocorrer;
- quando o usuário seria deslogado.

### Regra canônica do HTTP client

O client HTTP deve:

- montar URL a partir de `ENV.API_BASE_URL`
- anexar access token se existir
- detectar `401`
- tentar refresh **uma única vez**
- repetir a request original
- falhar de forma explícita se não conseguir

Qualquer lógica além disso **é bug**.

---

## 8. Por que parecia que “o login funcionava e depois parava”

Porque:

- o login realmente funcionava;
- o access token era válido;
- mas o estado global não estava sendo governado exclusivamente pelo `/me`;
- pequenas alterações quebravam a cadeia de confirmação.

Ou seja:

> o sistema funcionava **por coincidência**, não por contrato.

Sistemas que funcionam por coincidência **sempre quebram**.

---

## 9. Estado final validado (base segura)

O sistema só se tornou estável quando:

- `/api/login` passou a ser tratado apenas como emissão de token;
- `/api/v1/me` passou a governar o estado global;
- `MeContext` virou a única fonte da verdade;
- `AuthGuard` passou a depender apenas de `me`;
- env virou estático;
- refresh ficou transparente.

A partir daí:
- login é previsível;
- logout é previsível;
- refresh é silencioso;
- não há regressão aleatória.

---

## 10. O QUE NÃO PODE SER ALTERADO (SEM ADR)

Qualquer pessoa que mexer neste frontend **NÃO PODE**:

- inferir login sem `/me`;
- guardar JWT em cookie ou localStorage;
- ler refresh token no JS;
- criar outro estado global de auth;
- mover lógica de auth para componentes;
- alterar `http.ts` sem entender refresh;
- alterar `ENV` para leitura dinâmica;
- proteger páginas individualmente fora do `AuthGuard`.

Fazer qualquer uma dessas coisas **quebra o sistema**.

---

## 11. Regra final

> Se o login parecer “simples demais” para exigir essas regras,  
> isso significa que a pessoa **não entendeu o problema**.

Este documento existe porque **48 horas provaram que o problema é real**.

---

Fim do documento
