**Documento:**
Arquitetura Técnica do Dashboard — Sessão, Dados e Segurança

**Data:**
2026-02-08

---

## 1. Finalidade deste documento

Este documento é **estritamente técnico**.

Ele existe para:

* desenvolvedores frontend
* desenvolvedores backend
* manutenção futura
* evitar regressões críticas no Dashboard

Qualquer alteração no Dashboard **deve ser revisada com base neste documento**.

---

## 2. Pré-requisito absoluto para o Dashboard

O Dashboard **DEPENDE EXCLUSIVAMENTE** de:

```
GET /api/v1/me
```

Sem sucesso nesse endpoint:

* o Dashboard NÃO renderiza
* o usuário NÃO é considerado logado

---

## 3. `/api/v1/me` — contrato técnico

Resposta esperada (estrutura conceitual):

```ts
{
  user: {...},
  person: {...},
  storage: {...},
  alerts: {
    pending: [...]
  }
}
```

Este endpoint:

* valida o access token
* usa refresh token se necessário
* define o estado da sessão

---

## 4. `MeContext.tsx` como fonte da verdade

O Dashboard **NÃO controla autenticação sozinho**.

Ele depende de:

```ts
const { me, loading } = useMe();
```

Regras:

* `loading === true` → aguardar
* `me === null` → redirecionar para `/login`
* `me !== null` → liberar Dashboard

---

## 5. Controle de acesso (regra imutável)

Nunca permitir:

```ts
renderizar Dashboard sem me !== null
```

Nunca usar:

* flags locais
* variáveis temporárias
* suposições baseadas em login anterior

A **única verdade** é o `/me`.

---

## 6. Alertas no Dashboard

Alertas vêm de:

```
alerts.pending
```

Ações relacionadas:

* acknowledge
* accept
* reject

Endpoints típicos:

```
POST /api/v1/me/alerts/{id}/acknowledge
```

Após ação:

* é obrigatório recarregar `/me`
* nunca mutar estado manualmente

---

## 7. Risco crítico: estado inconsistente

Erros comuns que **NÃO DEVEM ACONTECER**:

* assumir sucesso de ação sem refetch
* esconder alertas sem confirmação do backend
* manter dados antigos em cache

Sempre:

```
ação → backend → reloadMe()
```

---

## 8. Logout e expiração de sessão

Quando o backend retorna:

* `401`
* `403`

O frontend deve:

* limpar access token
* limpar estado `me`
* redirecionar para `/login`

Isso já está centralizado em:

```
services/http.ts
```

---

## 9. Dependência do Dashboard com outros módulos

O Dashboard depende de:

* autenticação
* sessão válida
* contratos de API estáveis

Qualquer quebra em:

* `/api/v1/me`
* refresh token
* headers de autorização

→ **Dashboard para de funcionar**

---

## 10. Regra de ouro para manutenção

Antes de mexer no Dashboard, pergunte:

1. Isso altera `/api/v1/me`?
2. Isso altera `MeContext`?
3. Isso altera `http.ts`?
4. Isso muda fluxo de sessão?

Se a resposta for **sim** para qualquer um:
→ revisar todo o fluxo de login + dashboard.

---

## 11. Conclusão técnica

O Dashboard é:

* uma consequência da autenticação correta
* um reflexo direto do estado do backend
* um consumidor rigoroso de contratos

Ele **não deve inventar estado**, **não deve assumir sucesso**, **não deve improvisar dados**.