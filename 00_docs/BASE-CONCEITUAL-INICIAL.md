```markdown
document:
  name: BASE-CONCEITUAL-INICIAL.md
  path: frontend/docs-book/01_base/
  format: markdown
  status: canônico
  created_at: 2026-02-04
  updated_at: 2026-02-04
  effective_from: 2026-02-04
  scope: base conceitual frontend, limites de responsabilidade, arquitetura mental e invariantes do sistema

---

# BASE CONCEITUAL INICIAL — FRONTEND
## Plataforma GSA ANIMAL

Este documento define o **estado do mundo do frontend** a partir do qual **todo o código deve ser escrito**.

Ele não descreve desejos, boas práticas genéricas ou sugestões.  
Ele descreve **invariantes conceituais**.

Qualquer código que viole este documento está **conceitualmente errado**, mesmo que “funcione”.

---

## 1. O frontend não é uma aplicação isolada

O frontend **não existe por si só**.

Ele é:

- um consumidor de contratos HTTP;
- um reator de estado remoto;
- um orquestrador de fluxo de navegação;
- um executor de decisões já tomadas pelo backend.

O frontend **não modela o domínio**.  
O frontend **não interpreta regras de negócio**.

---

## 2. Autoridade e verdade

No sistema GSA ANIMAL:

- o backend é a autoridade de dados;
- o backend é a autoridade de autenticação;
- o backend é a autoridade de autorização;
- o frontend **nunca decide**.

O frontend apenas pergunta:

- “posso chamar este endpoint?”
- “quem é este usuário segundo o backend?”
- “qual é o estado atual do sistema?”

---

## 3. Autenticação: definição formal

Autenticação, neste projeto, significa **confirmação ativa de identidade via API**.

Ela **não** acontece em:

- login bem-sucedido;
- redirect OAuth;
- presença de token;
- existência de cookie;
- estado local do frontend.

Ela acontece **exclusivamente** quando:

    GET /api/v1/me → 200

Essa chamada:

- confirma identidade;
- entrega estado inicial;
- governa a renderização do app;
- define o “estar logado”.

Sem `/me`, não existe autenticação.

---

## 4. Tokens: papel e limites

### Access Token (JWT)

- representa autorização temporária;
- vive apenas em memória JS;
- é descartável;
- pode expirar a qualquer momento;
- não representa sessão.

### Refresh Token

- representa continuidade controlada;
- vive apenas em cookie HttpOnly;
- nunca é lido pelo frontend;
- só pode ser usado indiretamente via endpoint de refresh.

Tokens **não são identidade**.  
Tokens **não são estado do usuário**.

---

## 5. Estado global do frontend

O frontend possui **apenas um estado global relevante**:

> O resultado atual de `/api/v1/me`.

Esse estado:

- pode ser `null` (não autenticado);
- pode estar em `loading`;
- pode conter dados completos do usuário.

Não existe:

- estado parcial de usuário;
- “meio logado”;
- fallback local.

Tudo deriva de `/me`.

---

## 6. Separação de responsabilidades internas

O frontend é dividido conceitualmente em:

### Core

- comunicação HTTP;
- autenticação;
- refresh;
- bootstrap;
- guards.

### UI

- componentes visuais;
- layouts;
- páginas;
- interação do usuário.

A UI **não conhece**:

- tokens;
- refresh;
- headers;
- endpoints específicos.

A UI **reage** ao estado exposto pelo Core.

---

## 7. Fetch e comunicação

Toda comunicação HTTP:

- passa por uma camada única (`services/`);
- usa `fetch` nativo;
- respeita regras explícitas de `credentials`;
- anexa tokens automaticamente quando necessário;
- trata erros de forma centralizada.

Chamadas HTTP fora dessa camada são erro conceitual.

---

## 8. Navegação e proteção

Rotas protegidas:

- não renderizam sem confirmação de `/me`;
- não “piscam” conteúdo;
- não tentam decidir acesso localmente.

Proteção acontece em **layout**, não em páginas individuais.

---

## 9. Evolução do sistema

Qualquer evolução deve preservar:

- `/me` como fonte de verdade;
- estado único do usuário;
- centralização de auth;
- previsibilidade de fluxo.

Atalhos introduzem dívida conceitual.

---

## 10. Regra final (fundacional)

> **Se o frontend precisar “ser esperto”, o sistema está errado.**

Frontend correto é previsível, limitado e obediente ao contrato.

Este documento define o ponto zero do frontend.

---

Fim do documento
```
