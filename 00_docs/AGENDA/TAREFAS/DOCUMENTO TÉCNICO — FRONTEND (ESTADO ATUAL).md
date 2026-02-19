Perfeito. Abaixo está o **DOCUMENTO TÉCNICO (estado atual)** do **frontend**, descrevendo **exatamente o que já foi implementado**, **o que está mockado**, **o que está conectado**, **o que ainda NÃO está conectado**, e **onde estão os pontos de transição para backend**, sem vender nada como “pronto”.

Este documento é **descritivo**, não opinativo.

---

# 📗 DOCUMENTO TÉCNICO — FRONTEND (ESTADO ATUAL)

## Escopo do documento

Este documento descreve **o que existe hoje no frontend** relacionado a:

* Agenda
* Tarefas
* Navegação
* Estados locais
* Mock vs Backend

Ele **não descreve intenção futura**, apenas **realidade implementada**.

---

## 1. Estrutura de rotas implementada

### Rotas de alto nível

```text
/dashboard
/dashboard/agenda
/dashboard/animals/[animalId]
```

### Rotas específicas do animal

```text
/dashboard/animals/[animalId]/agenda
/dashboard/animals/[animalId]/agenda/tasks
```

Essas rotas **existem fisicamente** no projeto e são acessíveis.

---

## 2. Página: Agenda do Animal (Visão geral)

**Arquivo**

```
src/app/(protected)/dashboard/animals/[animalId]/agenda/page.tsx
```

### Estado atual

* Página renderiza:

  * Título: “Agenda do animal”
  * Descrição textual
  * Menu superior do animal (AnimalSectionMenu)

### O que NÃO faz

* Não carrega dados
* Não exibe tarefas
* Não exibe eventos
* Não faz fetch
* Não controla estado

Essa página hoje é **estrutural / container**, não funcional.

---

## 3. Sub-rotas da Agenda

Estrutura existente:

```text
agenda/
 ├─ layout.tsx
 ├─ page.tsx        (visão geral)
 └─ tasks/
    └─ page.tsx     (tarefas)
```

### layout.tsx da Agenda

* Existe
* Responsável por renderizar:

  * Tabs internas:

    * Visão geral
    * Tarefas
    * Eventos (desativado)
    * Agendamentos (desativado)

⚠️ **Observação**
Atualmente há **duplicação visual de menus**:

* Menu do animal
* Menu interno da agenda

Isso é estrutural, não de dados.

---

## 4. Página: Tarefas do Animal (Agenda → Tarefas)

**Arquivo**

```
src/app/(protected)/dashboard/animals/[animalId]/agenda/tasks/page.tsx
```

### Estado atual da página

* Renderiza:

  * Título “Tarefas”
  * Texto explicativo
  * Campo de input “Nova tarefa”
  * Botão “Criar”
  * Lista de tarefas

### Fonte dos dados

❌ **NÃO vem do backend**
❌ **NÃO usa services/animalTasks**

✅ Usa **estado local**

```ts
useState<Task[]>([])
```

Inicialmente:

* Lista vazia
* Mensagem: “Nenhuma tarefa cadastrada.”

---

## 5. Componente TaskCard

**Arquivo**

```
src/components/agenda/TaskCard.tsx
```

### Papel

Renderizar **uma tarefa individual**, incluindo:

* Título
* Status (badge)
* Data/hora
* Alertas (ex: “≤ 12h”)
* Botões de ação
* Histórico (actions)

### Dependências

Importa **exclusivamente tipos e funções do mock**:

```ts
import type { Task } from "@/mock/tasks";
import {
  markDone,
  reopen,
  cancel,
  isDueSoon
} from "@/utils/task-actions";
```

### Importante

* **Todas as ações são locais**
* Nenhuma chamada HTTP
* Nenhuma integração com backend
* Histórico (`actions`) é simulado em memória

---

## 6. Modelo de dados usado no frontend (mock)

**Arquivo**

```
src/mock/tasks.ts
```

Define:

```ts
type Task = {
  id: number
  title: string
  scheduled_at: string
  status: "PLANNED" | "done" | "canceled"
  actions: TaskActionLog[]
}
```

Esse modelo:

* ❌ Não é o modelo do backend
* ❌ Não inclui `created_by`, `created_at`
* ❌ Não reflete API real
* ✅ Serve apenas para prototipação visual e interação

---

## 7. Lógica de ações de tarefa (mock)

**Arquivo**

```
src/utils/task-actions.ts
```

### O que faz

Funções puramente locais que:

* Alteram status
* Anexam ações no histórico
* Não validam permissões
* Não fazem persistência

Exemplo:

```ts
markDone(task) → retorna novo objeto Task
```

Essas funções **simulam comportamento**, não refletem regras reais do domínio.

---

## 8. Filtro temporal (Agenda)

**Arquivo**

```
src/utils/tasks-time-filter.ts
```

### O que existe

* Filtro por:

  * Dia
  * Semana
  * Mês
* Baseado em `scheduled_at`

### Onde é usado

* Página `/dashboard/agenda` (global, fora do animal)
* Ainda usando `mockTasks`

---

## 9. Alertas de tarefas (Dashboard)

**Arquivo**

```
src/components/tasks/TasksAlertSummary.tsx
```

### Estado atual

* Recebe tarefas por props
* Calcula alertas:

  * Atrasadas
  * Hoje
  * Amanhã

### Origem dos dados

❌ Mock local no Dashboard:

```ts
const mockTasks = [...]
```

Nenhuma integração real.

---

## 10. Services de backend (existem, mas NÃO usados)

**Arquivo**

```
src/services/animalTasks.ts
```

### O que está implementado

* `getAnimalTasks`
* `createAnimalTask`
* `markTaskDone`
* `reopenTask`
* `cancelTask`

Esses métodos:

* Usam `apiFetch`
* Apontam corretamente para `/api/v1/animals/...`
* Estão tecnicamente corretos

### Estado atual

❌ **Nenhuma página da Agenda usa esses services**
❌ **Nenhum componente chama backend**
❌ **Nenhum dado real entra na UI**

Eles estão **isolados e não conectados**.

---

## 11. Estado atual resumido (verdade nua)

### O que funciona

* Navegação
* Layout
* Interações visuais
* Estados locais
* Fluxo de ações simuladas
* Filtro por tempo (mock)

### O que NÃO funciona (por design atual)

* Persistência
* Backend
* Permissões reais
* Histórico real
* Consistência entre páginas
* Sincronização Agenda ↔ Tarefas

---

## 12. Conclusão técnica

O frontend hoje está em **fase de prototipação funcional**, com:

* Estrutura correta
* Separação clara de responsabilidades
* Mock explícito (não escondido)
* Backend preparado, mas não conectado

Nenhuma decisão errada foi tomada **até aqui**, mas **nenhuma integração real foi feita ainda**.

---

## Próximo passo lógico (não executado)

Antes de ligar backend:

1. Fechar layout final da Agenda
2. Definir hierarquia visual definitiva:

   * Agenda → Visão geral / Tarefas / Eventos
3. Unificar modelo visual (remover mock duplicado)
4. Só então substituir fonte de dados

