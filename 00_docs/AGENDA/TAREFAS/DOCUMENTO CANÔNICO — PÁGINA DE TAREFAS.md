Perfeito. Abaixo está o **documento canônico, não técnico**, que consolida **tudo o que foi entendido sobre a página de Tarefas**, com foco em **significado**, **papel no produto**, **permissões**, **responsabilidades** e **conexões futuras**.
Este documento deve ser tratado como **fonte de verdade conceitual**, acima de UI, backend ou implementação.

---

# 📘 DOCUMENTO CANÔNICO — PÁGINA DE TAREFAS

## 1. Propósito da página de Tarefas

A página de **Tarefas** existe para responder a uma pergunta simples e operacional:

> **“O que precisa ser feito para este animal, por pessoas, ao longo do tempo?”**

Ela não define tratamentos, não define planos e não faz diagnóstico.
Ela **executa ações humanas**, registra essas ações e mantém rastreabilidade.

Tarefa é **ação**, não **intenção**.

---

## 2. Lugar da Tarefa dentro da aplicação

### Hierarquia conceitual

* **Animal**
  └── **Agenda** (domínio do tempo)
     └── **Tarefas** (execuções humanas)

Ou seja:

* Tarefa **sempre pertence a um animal**
* Tarefa **sempre pertence à agenda**
* Tarefa **nunca existe sozinha**

A página de tarefas **não é um módulo independente**:
ela é uma **visão especializada da Agenda**.

---

## 3. O que é uma Tarefa (definição semântica)

Uma **Tarefa** é:

* Uma **ação executável**
* Associada a um **momento no tempo**
* Que pode ser **realizada por qualquer tutor autorizado**
* Que deixa **rastro de quem fez o quê e quando**

Exemplos:

* Dar medicação
* Dar banho
* Passear
* Trocar curativo
* Levar para consulta (quando tratada como execução, não agendamento)

---

## 4. O que NÃO é uma Tarefa

Não são tarefas:

* Tratamentos (isso pertence à Clínica)
* Prescrições médicas
* Planos futuros abstratos
* Histórico clínico
* Configuração de medicação recorrente

Esses elementos **podem gerar tarefas**, mas **não são tarefas**.

---

## 5. Campos conceituais de uma Tarefa

Uma tarefa, conceitualmente, contém:

### Identidade

* Identificador único
* Animal ao qual pertence

### Conteúdo

* **Título** (obrigatório, curto, humano)
* **Observação** (opcional, texto livre)

### Tempo

* **Data**
* **Hora**
* (No futuro: recorrência indireta via origem)

### Estado

* Pendente
* Realizada
* Cancelada

### Prioridade

* Baixa
* Normal
* Alta
  *(prioridade é operacional, não clínica)*

---

## 6. Ações possíveis sobre uma Tarefa

As ações **não pertencem à tarefa**, pertencem às **pessoas interagindo com ela**.

### Ações esperadas:

* Criar
* Marcar como realizada
* Reabrir
* Cancelar
* (Em condições restritas) Excluir

Cada ação:

* Tem um **autor**
* Tem um **momento**
* Pode ter um **comentário**

---

## 7. Registro e auditabilidade (princípio central)

A tarefa **nunca é apenas “alterada”**.

Ela:

* **registra eventos**
* **mantém histórico**
* **não perde informação**

Exemplo de linha do tempo:

1. Criada por João
2. Marcada como feita por Maria
3. Reaberta por João
4. Cancelada por Ana com observação

Isso é **obrigatório**, não opcional.

---

## 8. Permissões (modelo mental)

### Quem pode criar tarefas?

* Qualquer tutor **ativo** do animal

### Quem pode executar tarefas?

* Qualquer tutor **ativo** do animal
  (não precisa ser quem criou)

### Quem pode cancelar?

* Qualquer tutor ativo

### Quem pode excluir?

* Apenas quem criou
* **Somente se ninguém mais interagiu**

Depois de qualquer interação externa:

* A tarefa **não pode mais ser excluída**
* Apenas alterada de estado com histórico

---

## 9. Relação com outros domínios (conexões futuras)

### Clínica → Tarefas

* Um tratamento ou medicação **pode gerar tarefas**
* A tarefa **referencia a origem**, mas continua independente
* Excluir tarefa **não altera tratamento**

### Agenda (visão geral)

* A página de tarefas é **um recorte**
* A agenda mostra tarefas + eventos + agendamentos
* A tarefa aparece na agenda pelo seu **tempo**

### Notificações / Alertas

* Tarefas pendentes geram alertas
* Alertas são derivados, não entidades

---

## 10. Papel da UI da página de Tarefas

A UI deve:

* Facilitar **criação rápida**
* Tornar **execução óbvia**
* Mostrar **status sem ambiguidade**
* Exibir **quem fez o quê**
* Não esconder histórico
* Não permitir ações inválidas

A UI **não decide regras**.
Ela **aplica regras já definidas pelo domínio**.

---

## 11. O que pode evoluir sem quebrar o conceito

Este modelo permite, no futuro:

* Filtros por período
* Agrupamento por prioridade
* Origem da tarefa (manual, clínica, sistema)
* Anexos
* Comentários múltiplos
* Notificações automáticas
* Integração com agenda global

Sem precisar mudar:

* Definição de tarefa
* Permissões
* Responsabilidade humana

---

## 12. Regra de ouro (frase canônica)

> **“Tarefa é execução humana no tempo, sempre auditável, sempre ligada a um animal.”**

Se algo viola essa frase, **não é tarefa**.
