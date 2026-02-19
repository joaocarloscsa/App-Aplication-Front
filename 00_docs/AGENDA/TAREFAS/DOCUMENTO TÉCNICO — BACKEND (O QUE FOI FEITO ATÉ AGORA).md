# 📘 DOCUMENTO TÉCNICO — BACKEND (O QUE FOI FEITO ATÉ AGORA)

## 0) Escopo e objetivo do que foi implementado

Foi criado (e/ou alterado) um conjunto de artefatos no backend para suportar **Tarefas do Animal** como um tipo de item de agenda, com:

* **CRUD parcial de tarefas** (criar + ações de status)
* **Auditoria via Action Log** (histórico de ações)
* **Leitura via endpoint GET** com montagem de read model
* **Regras de acesso (nível “tutor ativo”)** no endpoint
* **Regras de domínio para deletar tarefa** (somente criador + sem interações)

⚠️ Estado atual: **não está estável/compilando 100%**, porque há incompatibilidades entre o controller de leitura e a entidade `AnimalAgendaItemActionLog` (métodos inexistentes), e há um problema de migração/schema envolvendo constraint inexistente.

---

## 1) Arquivos criados (novos) no backend

Segundo seu `git status`, foram criados novos:

### 1.1 Services (Application Layer)

Diretório novo:

* `src/Application/Animal/Task/`

Arquivos citados no `rg Task` e no status:

* `src/Application/Animal/Task/CreateAnimalTaskService.php`
* `src/Application/Animal/Task/MarkAnimalTaskDoneService.php`
* `src/Application/Animal/Task/ReopenAnimalTaskService.php`
* `src/Application/Animal/Task/CancelAnimalTaskService.php`
* `src/Application/Animal/Task/DeleteAnimalTaskService.php`

> Observação: também apareceu `src/Application/Animal/Task/CompleteAnimalTaskService.php` no `rg`, mas o trecho que você colou mostra `MarkAnimalTaskDoneService`. Se `CompleteAnimalTaskService` existe de fato, ele é redundante/duplicado conceitualmente.

### 1.2 Controllers (API Layer)

Foram criados:

* `src/Controller/Api/V1/AnimalTaskApiController.php`
* `src/Controller/Api/V1/AnimalTaskReadApiController.php`

---

## 2) Arquivos alterados (modificados) no backend

Pelo `git status`, foram modificados:

* `src/Entity/AnimalAgendaItem.php`
* `src/Entity/AnimalAgendaItemActionLog.php`
* `src/Repository/AnimalAgendaItemActionLogRepository.php`
* `src/Repository/AnimalAgendaItemRepository.php`

Além disso, você mostrou também parte de `src/Repository/AnimalAgendaRepository.php`, mas ele não apareceu no `git status` como modificado nesse snapshot (pode ter sido modificado antes e já commitado).

---

## 3) Modelo de dados: Entidades envolvidas

### 3.1 `AnimalAgenda` (já existia)

Arquivo:

* `src/Entity/AnimalAgenda.php`

O que ela representa:

* Uma agenda “container” 1:1 com Animal
* `AnimalAgenda` tem:

  * `animal` (OneToOne)
  * `items` (OneToMany) → `AnimalAgendaItem`

Pontos técnicos relevantes:

* Existe um método `getOwner()` com comentário “plataforma somente tutor”, retornando `animal->getTutor()`. Isso é um acoplamento legado (pode ou não bater com seu modelo atual de vínculos).

### 3.2 `AnimalAgendaItem` (alterada)

Arquivo:

* `src/Entity/AnimalAgendaItem.php`

Campos existentes (do trecho que você colou):

* `id` (int)
* `agenda` (ManyToOne AnimalAgenda)
* `createdBy` (ManyToOne Person) **obrigatório**
* `organizationId` (int nullable) — contexto
* `treatmentSchedule` (ManyToOne AnimalTreatmentSchedule nullable)
* `type` (string len 30) — usa valores como `'task'`
* `status` (string len 30) — usa valores `'PLANNED'`, `'done'`, `'canceled'` (mas está inconsistente, ver seção 7)
* `title` (string)
* `description` (text nullable)
* `startsAt` / `endsAt` (datetime_immutable nullable)
* `createdAt` (datetime_immutable)

Factories adicionadas:

* `createTask(...)` → cria um item com `type = 'task'` e `startsAt = $scheduledAt`

Métodos adicionados/ajustados:

* getters: `getCreatedBy()`, `getType()`, `getStatus()`, `setStatus()`, `markDone()`, `cancel()`, etc.

⚠️ Inconsistência clara:

* `markDone()` seta `status = 'done'` (minúsculo)
* `cancel()` seta `status = 'canceled'` (minúsculo)
* `setStatus('PLANNED')` usa maiúsculo
* `ReopenAnimalTaskService` compara com `'PLANNED'`
* `MarkAnimalTaskDoneService` compara com `'done'`

Ou seja: status está misturando convenções.

### 3.3 `AnimalAgendaItemActionLog` (alterada, mas incompleta)

Arquivo:

* `src/Entity/AnimalAgendaItemActionLog.php`

Campos do log:

* `id`
* `agendaItem` (ManyToOne AnimalAgendaItem)
* `actor` (ManyToOne Person)
* `action` (string)
* `payload` (json)
* `occurredAt` (datetime_immutable)

Factories:

* `created($item, $actor, $payload = [])` → cria log do tipo `'created'`

Métodos existentes (no trecho colado):

* `type()` (retorna action)
* `action()` (retorna action)
* `payload()` (retorna payload)

⚠️ Problema real e atual:
O controller de leitura (`AnimalTaskReadApiController`) está chamando métodos que **não existem** nessa entidade, conforme o erro:

> `Call to undefined method App\Entity\AnimalAgendaItemActionLog::action() (500 Internal Server Error)`

Pelo trecho que você colou, existe `action()`. Então há duas possibilidades **objetivas**:

1. O arquivo em runtime não é o mesmo que você colou (cache/opcache/autoload apontando para versão anterior), **ou**
2. O método `action()` não está presente na sua cópia real (o trecho colado pode estar desatualizado), **ou**
3. O erro que apareceu na tela era sobre **outro método** (por exemplo `actor()` ou `occurredAt()`), e a UI exibiu a última parte de forma confusa.

Mas o controller também chama:

* `$lastAction->actor()` ✅ **não existe** no trecho colado
* `$lastAction->occurredAt()` ✅ **não existe** no trecho colado

Então, mesmo que `action()` exista, **o controller está incompatível com a entidade**.

---

## 4) Repositórios implementados/alterados

### 4.1 `AnimalAgendaRepository`

Arquivo:

* `src/Repository/AnimalAgendaRepository.php`

Função relevante:

* `getOrCreateAgendaForAnimal(Animal $animal): AnimalAgenda`

  * busca agenda por animal
  * se não existir: cria, persist, flush
  * retorna agenda

Também existe um método deprecated:

* `getDomainAgendaForAnimal()` → lança exception

E um método de leitura de itens:

* `getAgendaItemsForAnimal(Animal $animal): array`

  * usa QueryBuilder para buscar `AnimalAgendaItem` por agenda e ordena por `startsAt`/`createdAt`.

### 4.2 `AnimalAgendaItemRepository` (modificado)

Arquivo:

* `src/Repository/AnimalAgendaItemRepository.php`

Foi implementado:

* `findTasksForAnimal(Animal $animal, ?from, ?to, ?status): array`

  * join `i.agenda a`
  * filtra por `a.animal = :animal`
  * filtra por `i.type = 'task'`
  * filtra por status, from, to (se fornecidos)
  * order by `startsAt`

⚠️ Observação:
Esse repo **não tem** (no trecho colado) método `save($entity, $flush)`.

Mas o controller `AnimalTaskApiController` chama:

* `$this->taskRepository->save($task, true);`

Isso é **incompatível** (fatal error) se `save()` não existe. Logo:

* ou o repo foi alterado além do trecho que você mostrou,
* ou o controller está chamando um método inexistente.

### 4.3 `AnimalAgendaItemActionLogRepository` (modificado)

Arquivo:

* `src/Repository/AnimalAgendaItemActionLogRepository.php`

Implementado:

* `findLastForAgendaItem(AnimalAgendaItem $item): ?AnimalAgendaItemActionLog`

  * busca o último log por `occurredAt DESC`

---

## 5) Application Services implementados

Todos usam `EntityManagerInterface`.

### 5.1 `CreateAnimalTaskService`

Arquivo:

* `src/Application/Animal/Task/CreateAnimalTaskService.php`

Fluxo:

* cria `AnimalAgendaItem::createTask(...)`
* cria log `AnimalAgendaItemActionLog::created(...)`
* persist task
* persist log
* flush
* retorna task

Observação:

* Este service cria task + log corretamente (conceitualmente).
* Mas o controller `AnimalTaskApiController` NÃO está usando este service; ele cria direto via entity factory (duplicação).

### 5.2 `MarkAnimalTaskDoneService`

Arquivo:

* `src/Application/Animal/Task/MarkAnimalTaskDoneService.php`

Regras:

* valida `type === 'task'`
* idempotente se status já `done`
* `markDone()`
* cria `AnimalAgendaItemActionLog(action='marked_done', payload{comment})`
* flush

### 5.3 `ReopenAnimalTaskService`

Arquivo:

* `src/Application/Animal/Task/ReopenAnimalTaskService.php`

Regras:

* valida `type === 'task'`
* idempotente se status já `'PLANNED'`
* `setStatus('PLANNED')`
* log `reopened`

⚠️ Status mixed-case: `markDone()` usa `'done'`, `reopen` usa `'PLANNED'`.

### 5.4 `CancelAnimalTaskService`

Arquivo:

* `src/Application/Animal/Task/CancelAnimalTaskService.php`

Regras:

* valida `type === 'task'`
* idempotente se status `'canceled'`
* `cancel()` (status `'canceled'`)
* log `canceled`

### 5.5 `DeleteAnimalTaskService`

Arquivo:

* `src/Application/Animal/Task/DeleteAnimalTaskService.php`

Regras:

* valida `type === task`
* somente criador pode deletar (`createdBy == actor`)
* consulta logs:

  * conta logs onde action != 'created'
  * se houver > 0: bloqueia deleção
* remove entity, flush

✅ Essa regra bate com sua política: “deletável só se ninguém interagiu”.

⚠️ Observação: Esse service **não está exposto** nos controllers colados (não há endpoint de DELETE de task ainda).

---

## 6) API Controllers implementados

### 6.1 `AnimalTaskApiController` (write/actions)

Arquivo:

* `src/Controller/Api/V1/AnimalTaskApiController.php`

Base route:

* `GET/POST/PATCH /api/v1/animals/{animalPublicId}/tasks...`

Implementado:

#### POST `/api/v1/animals/{animalPublicId}/tasks`

* autentica user/person
* busca animal por `publicId`
* `denyAccessUnlessGranted(ANIMAL_VIEW, $animal)` (tutor ativo)
* parse JSON
* parse `scheduled_at`
* pega agenda via `$animal->getAgenda()`

  * se não existir: 409 `agenda_not_initialized`
* cria task via `AnimalAgendaItem::createTask(...)`
* salva via `$taskRepository->save($task, true)`
* retorna `{ id }`

⚠️ Problemas concretos aqui:

* Dependência de `getAgenda()` existir e já estar inicializada para o animal (não está garantido).
* Não registra ActionLog de `created` (perde auditabilidade inicial).
* Chama `save()` no repository (pode não existir).

#### PATCH `/.../{id}/done|reopen|cancel`

* usa `handleTaskAction()`
* valida user/person
* busca animal
* permission `ANIMAL_VIEW`
* busca task por id
* garante que task pertence ao animal:

  * `$task->getAgenda()->animal()->getId() === $animal->getId()`
* parse `comment`
* chama o service apropriado (done/reopen/cancel)
* retorna 204

⚠️ Também tem um risco aqui:

* `getAgenda()->animal()` depende de existir método `animal()` em `AnimalAgenda` (ele existe: `animal(): Animal`).
* Mas esse controller depende também de `AnimalAgendaItem::getAgenda()` retornar instância válida.

### 6.2 `AnimalTaskReadApiController` (read)

Arquivo:

* `src/Controller/Api/V1/AnimalTaskReadApiController.php`

Implementado:

#### GET `/api/v1/animals/{animalPublicId}/tasks`

* autentica
* busca animal
* permission `ANIMAL_VIEW`
* lê query params: `from`, `to`, `status`
* chama repo `findTasksForAnimal(...)`
* monta response item a item
* adiciona `last_action` usando `AnimalAgendaItemActionLogRepository::findLastForAgendaItem($task)`

Formato de resposta pretendido:

```json
{
  "items": [
    {
      "id": ...,
      "title": ...,
      "status": ...,
      "scheduled_at": ...,
      "created_at": ...,
      "created_by": {...},
      "last_action": {
        "type": "...",
        "by": {...},
        "at": "...",
        "comment": "..."
      }
    }
  ]
}
```

⚠️ Problema crítico atual:

* O controller chama métodos na entidade ActionLog que **não existem** (pelo trecho colado):

  * `actor()`
  * `occurredAt()`
* Resultado: 500 ao tentar abrir `/agenda/tasks` no frontend.

---

## 7) Estado atual de compatibilidade (backend ↔ frontend)

O frontend `src/services/animalTasks.ts` está alinhado com os endpoints:

* GET `/api/v1/animals/{animalId}/tasks`
* POST `/api/v1/animals/{animalId}/tasks`
* PATCH `/.../done|reopen|cancel`

✅ rotas batem.

Mas o backend atualmente entrega 500 no GET por causa da incompatibilidade do read controller com a entidade ActionLog.

---

## 8) Problema de banco/schema (doctrine:schema:update)

Você executou:

```bash
php bin/console doctrine:schema:update --force
```

Erro:

```
constraint "fk_6777070a91ab301f" of relation "animal_agenda_item_action_log" does not exist
```

O que isso significa na prática:

* Doctrine tentou dropar/alterar uma constraint que ele “acha” que existe, mas o Postgres não encontra.
* Isso costuma acontecer quando:

  * schema foi alterado manualmente,
  * migrations não foram aplicadas corretamente,
  * o metadata mapping mudou nomes de constraints,
  * o banco está “fora do estado” do ORM.

✅ Isso não é só “um detalhe”: impede evolução segura do schema.

---

## 9) Decisões arquiteturais já tomadas (implícitas no que foi feito)

Mesmo sem declarar, o backend implementou estas decisões:

1. **Tarefa é um AnimalAgendaItem** com `type='task'`
   Não existe entidade `Task` separada.

2. **Auditoria é feita em tabela própria**
   `AnimalAgendaItemActionLog` grava ações com payload JSON.

3. **Permissão para operar tarefas = ANIMAL_VIEW**
   Ou seja, qualquer tutor ativo pode:

   * criar
   * marcar done/reopen/cancel
     (isso bate com sua regra: “qualquer tutor pode executar tarefa”)

4. **Regra de deleção (domínio) existe mas não está exposta por API**
   `DeleteAnimalTaskService` está pronto, mas não há endpoint.

---

## 10) Principais gaps técnicos atuais (objetivos)

Aqui é onde está “quebrando” ou incompleto, sem interpretação:

### 10.1 Read controller incompatível com `AnimalAgendaItemActionLog`

* controller chama:

  * `actor()`
  * `occurredAt()`
* entidade não tem esses métodos (no trecho colado).

### 10.2 Controller de create não grava log `created`

* `CreateAnimalTaskService` grava log.
* `AnimalTaskApiController::create()` NÃO usa o service, então não grava log.

### 10.3 `AnimalAgendaItemRepository` pode não ter `save()`

* controller chama `save()`.
* trecho colado do repo não mostra `save()`.

### 10.4 Inicialização de `AnimalAgenda`

* create endpoint retorna 409 se `$animal->getAgenda()` for null
* mas existe repository `getOrCreateAgendaForAnimal()` que resolveria isso
* controller não usa

### 10.5 Status inconsistente (case / enum)

* `'PLANNED'` vs `'done'` vs `'canceled'`
* filtros e UI dependem disso

---

## 11) Inventário de endpoints implementados

### Read

* `GET /api/v1/animals/{animalPublicId}/tasks`

  * status: **instável (500)** por incompatibilidade de ActionLog getters

### Write

* `POST /api/v1/animals/{animalPublicId}/tasks`

  * status: depende de `getAgenda()` inicializada + `save()` existir
* `PATCH /api/v1/animals/{animalPublicId}/tasks/{id}/done`
* `PATCH /api/v1/animals/{animalPublicId}/tasks/{id}/reopen`
* `PATCH /api/v1/animals/{animalPublicId}/tasks/{id}/cancel`

### Não implementado

* DELETE task (mesmo com service pronto)
* PUT edit de task (título, data etc.)
* listagem de histórico completo por tarefa (só “última ação” é retornada)

---

## 12) Resultado prático: o que hoje está “de pé” no backend

✅ Existe uma linha implementada completa de “tarefas como agenda item”, porém:

* A leitura 500 impede o frontend de renderizar
* O create não garante log nem criação de agenda
* O schema do banco está inconsistente com Doctrine

Ou seja:

* **a estrutura foi montada**
* **mas não está integrável ainda de forma confiável**