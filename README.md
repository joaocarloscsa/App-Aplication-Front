Perfeito. **Checkpoint criado. Você está seguro agora.**
Esse commit é a **âncora** que impede regressão psicológica e técnica.

Agora vamos seguir **com cabeça fria**.

---

## PRÓXIMO PASSO SEGURO (SEM TOCAR EM AUTH)

### Objetivo

Preparar o projeto para:

* versionamento público (GitHub)
* onboarding de outra pessoa
* retomada futura sem medo

Nada funcional muda. **Zero risco.**

---

## ETAPA 1 — README TÉCNICO MÍNIMO (OBRIGATÓRIO)

Vamos criar um README que deixe **claríssimo**:

* como rodar
* como NÃO quebrar auth
* qual é o ponto de entrada conceitual

### Arquivo a criar

```
/var/www/GSA/animal/frontend/README.md
```

### Conteúdo (copiar exatamente)

````markdown
# GSA Animal — Frontend

Frontend oficial da plataforma **GSA Animal**, construído com **Next.js (App Router)**.

Este projeto utiliza **JWT com refresh token em cookie HttpOnly** e governa autenticação **exclusivamente** via `/api/v1/me`.

⚠️ **Não trate este frontend como um projeto Next genérico.**
Existem regras conceituais que, se violadas, quebram autenticação.

---

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fetch nativo
- JWT (Access em memória + Refresh em cookie)
- React Context (estado global de auth)

---

## Rodar localmente

### Requisitos
- Node.js ≥ 20
- Backend GSA Animal rodando em HTTPS

### Variáveis de ambiente

Crie `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://gsa-animal.local
NEXT_PUBLIC_OAUTH_DEV_BASE_URL=https://gsa-animal.local
````

### Rodar

```bash
npm install
npm run dev
```

Acesse:

```
https://gsa-animal.local/login
```

---

## Autenticação (LEIA ANTES DE MEXER)

* `POST /api/login` **não confirma login**
* Autenticação confirmada **SOMENTE** via `GET /api/v1/me`
* O estado global é governado por `MeContext`
* Rotas protegidas usam `AuthGuard`
* Access token:

  * fica em memória
  * vai no header `Authorization`
* Refresh token:

  * fica em cookie HttpOnly
  * nunca é lido no JS
  * só é usado via `/api/token/refresh`

📌 **Leia antes de alterar qualquer coisa:**

```
frontend/00_docs/FRONTEND_AUTH_POST_MORTEM.md
```

---

## Estrutura relevante

```
src/
├── app/
│   ├── login/
│   ├── auth/callback/
│   └── (protected)/
├── components/
├── services/
├── stores/
└── lib/
```

---

## Regra final

> Se `/api/v1/me` não confirmou, o usuário NÃO está logado.

Essa regra evita 90% dos bugs.

````

---

## ETAPA 2 — COMMIT DO README

Depois de salvar o arquivo:

```bash
git add README.md
git commit -m "docs: add canonical frontend README with auth rules"
````

---

## ETAPA 3 — PARAR

Depois disso: **pare**.
Não mexa em auth, não mexa em HTTP, não mexa em env.

Esse é o momento correto de **descansar**.

