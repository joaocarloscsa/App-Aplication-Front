document:
  name: 00_PROTOCOL.md
  path: frontend/docs-book/
  format: markdown
  status: canônico
  created_at: 2026-02-04
  updated_at: 2026-02-04
  effective_from: 2026-02-04
  scope: governança operacional frontend, continuidade entre chats, disciplina de entrega, regras de interação, listas canônicas e regras anti-fragmentação

---

# PROTOCOLO CANÔNICO DE CONTINUIDADE, OPERAÇÃO E COLABORAÇÃO — FRONTEND
## Plataforma GSA ANIMAL

## 1. Finalidade deste documento

Este documento define **como o trabalho frontend deve ser executado** neste projeto.

Ele governa:

- a forma de interação com o ChatGPT;
- a disciplina de continuidade entre chats;
- a prevenção de suposições e inferências;
- a forma correta de criar, corrigir e evoluir código frontend;
- a forma correta de **substituir arquivos inteiros**, nunca aplicar correções parciais;
- a forma de solicitar e entregar listas de documentos;
- regras explícitas para evitar fragmentação de documentos na entrega;
- regras para preservação da versão aprovada de um documento ao longo de correções sucessivas.

Este documento **não explica o frontend**.  
Ele define **comportamento operacional obrigatório**.

Ignorar qualquer regra aqui descrita compromete a colaboração.

---

## 2. Regra zero — nunca assumir nada

Antes de qualquer ação, é proibido assumir:

- que um arquivo frontend existe;
- o nome de um arquivo;
- a estrutura de diretórios;
- nomes de componentes, hooks ou services;
- regras de autenticação ou bootstrap;
- comportamento “óbvio” do navegador ou do framework.

Sempre que algo for necessário:

- confirmar a existência do arquivo;
- solicitar o caminho completo;
- trabalhar apenas sobre material real e versionado.

Inferência é considerada **erro grave de processo**.

---

## 3. Protocolo de recebimento de documentação

Quando o usuário indicar que irá enviar documentos:

1. responder apenas: Ok.
2. não analisar.
3. não comentar.
4. não antecipar decisões.
5. aguardar explicitamente o usuário indicar que terminou de enviar.

A análise só começa após confirmação explícita.

---

## 4. Regra fundamental de correção e evolução

### 4.1 Substituição de arquivos (regra absoluta)

Sempre que o ChatGPT:

- corrigir um bug frontend;
- ajustar comportamento de autenticação;
- refatorar services, context ou guards;
- alterar documentação frontend;

o resultado **deve ser a entrega do arquivo inteiro corrigido**.

É proibido:

- entregar trechos soltos;
- pedir que o usuário edite manualmente;
- assumir que “o resto do arquivo está correto”.

A lógica é **substituição direta**, não edição incremental.

---

### 4.2 Forma obrigatória de entrega de arquivos

Toda entrega de arquivo deve obedecer rigorosamente:

- um arquivo por entrega;
- caminho completo a partir de `/var/www/GSA/animal/frontend/`;
- conteúdo pronto para substituição direta;
- entrega em **um único bloco contínuo**;
- nenhum texto fora do bloco do arquivo.

---

## 5. Regra para listas de documentos (otimização de fluxo)

Sempre que:

- o usuário pedir uma lista de documentos; ou
- o ChatGPT precisar solicitar documentos para análise, entendimento ou orientação;

a resposta **deve conter apenas a lista**, sem explicações adicionais.

É proibido:

- explicar a função de cada arquivo;
- justificar a escolha;
- descrever próximos passos.

Frase opcional permitida:

    Entregue os documentos abaixo para análise.

### 5.1 Exemplo canônico de lista (obrigatório como referência)

    ./cat_from_frontend.sh \
      /var/www/GSA/animal/frontend/src/services/http.ts \
      /var/www/GSA/animal/frontend/src/components/AuthGuard.tsx \
      $(find /var/www/GSA/animal/frontend/src/app -type f 2>/dev/null | sort)

Nenhuma explicação deve acompanhar listas nesse formato.

---

## 6. Regra anti-fragmentação de documentos (crítica)

### 6.1 Problema identificado

Fragmentação ocorre quando:

- um documento entregue para substituição é dividido em múltiplos blocos;
- exemplos internos usam delimitadores de bloco;
- texto é inserido fora do bloco principal.

Isso causa cópia incompleta, seleção quebrada e erro operacional.

---

### 6.2 Regra absoluta

Ao entregar **qualquer arquivo para substituição**:

- deve existir **exatamente um único bloco contínuo**;
- não pode haver texto fora desse bloco;
- é proibido abrir blocos adicionais para exemplos;
- exemplos internos **não podem usar delimitadores de bloco**.

---

### 6.3 Forma correta de escrever exemplos internos

Dentro de documentação entregue para substituição:

- exemplos devem ser texto corrido; ou
- exemplos devem ser linhas indentadas com 4 espaços.

É proibido usar delimitadores de bloco para exemplos (` ``` `).

---

### 6.4 Auto-checagem obrigatória

Antes de enviar, o ChatGPT deve validar:

- existe apenas um bloco contínuo;
- não existe texto fora do bloco;
- não existem blocos internos adicionais.

Se a validação falhar, a entrega deve ser refeita.

---

## 7. Regra de preservação da versão aprovada (anti-degradação)

Quando um documento frontend já foi **explicitamente aprovado** pelo usuário:

- essa versão passa a ser a **base canônica**;
- correções posteriores **não podem remover conteúdo existente**;
- correções posteriores **não podem resumir ou simplificar seções existentes**;
- novas regras devem ser **apenas adicionadas**, nunca substituir ou enxugar o que foi aprovado.

Ao refazer um documento já aprovado, o ChatGPT deve:

- reconstruir o arquivo inteiro a partir da versão aprovada;
- incorporar novas regras de forma incremental;
- preservar estrutura, explicações e exemplos existentes.

---

## 8. Tipos de arquivo

Documentação:
- formato Markdown;
- bloco único contínuo;
- cabeçalho obrigatório.

Código frontend:
- bloco único;
- linguagem correta;
- sem texto intercalado;
- sem exemplos fragmentados.

---

## 9. Cabeçalho obrigatório em documentação

Todo documento em `frontend/docs-book/` deve iniciar com bloco `document:` contendo, no mínimo:

- name
- path
- format
- status
- created_at
- updated_at
- effective_from
- scope

Documentos sem esse cabeçalho são inválidos.

---

## 10. Continuidade entre chats

Este protocolo governa **todas as interações futuras** relacionadas ao frontend.

Decisões, correções e regras definidas aqui:

- não podem ser reinterpretadas;
- não podem ser “flexibilizadas”;
- não podem ser ignoradas por conveniência técnica.

---

## 11. Regra final

Se algo não está claro, o problema é a documentação frontend.  
Nunca compensar falhas documentais com interpretação.

Este protocolo é canônico.

---

Fim do documento
