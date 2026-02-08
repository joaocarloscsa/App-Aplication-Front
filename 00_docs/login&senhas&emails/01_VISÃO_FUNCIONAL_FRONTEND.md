Perfeito. Abaixo estão **os DOIS DOCUMENTOS**, **com cabeçalho formal**, **data**, **nome do arquivo**, **finalidade**, **escopo**, **explicações explícitas**, escritos para **não técnico** e para **desenvolvedor**, **sem suposições**, **alinhados ao código real** e **com foco máximo em API e riscos**.

---

# 📄 DOCUMENTO 01

## Visão funcional do Frontend — do acesso ao Dashboard

**Arquivo:**
`docs/frontend/01_VISÃO_FUNCIONAL_FRONTEND.md`

**Documento:**
Visão Funcional do Frontend — Fluxo do Usuário até o Dashboard

**Data:**
2026-02-08

---

## 1. Finalidade deste documento

Este documento existe para **explicar, de forma clara e didática**, como funciona o site **do ponto de vista do usuário**, desde o primeiro acesso até a entrada no **Dashboard**.

Ele foi escrito para:

* pessoas **não técnicas**
* gestores
* analistas
* novos membros do time
* qualquer pessoa que **não conhece código**

Não é necessário conhecimento prévio de:

* programação
* APIs
* autenticação
* segurança

O objetivo é que qualquer leitor consiga **entender exatamente o que acontece**, **por que acontece**, e **qual é o resultado esperado em cada página**.

---

## 2. O que é este site

Este site é uma **plataforma web**, acessada por navegador (Chrome, Safari, etc).

O usuário pode:

* criar uma conta
* entrar com e-mail e senha
* entrar com Google
* recuperar senha
* confirmar e-mail
* acessar uma área interna (Dashboard)

O site **não armazena senha no navegador** e **não expõe dados sensíveis ao usuário**.

---

## 3. Estrutura geral de navegação

Fluxo principal:

```
Acesso ao site
→ Login ou Cadastro
→ Confirmação de e-mail (primeiro acesso)
→ Login validado
→ Dashboard
```

Fluxos auxiliares:

* Esqueci a senha
* Reenvio de e-mail de confirmação
* Login com Google

---

## 4. Página de Login (`/login`)

### O que o usuário vê

* Campo de e-mail
* Campo de senha
* Botão “Entrar”
* Botão “Entrar com Google”
* Link “Esqueci a senha”
* Link “Criar conta”

### O que acontece ao clicar em **Entrar**

1. O site envia o e-mail e a senha ao servidor
2. O servidor valida:

   * se o e-mail existe
   * se a senha está correta
3. Se estiver tudo correto:

   * o site confirma quem é o usuário
   * o usuário é levado ao **Dashboard**
4. Se estiver incorreto:

   * aparece a mensagem
     **“E-mail ou senha inválidos”**

### Caso especial — e-mail não verificado

Se:

* o e-mail existe
* a senha está correta
* mas o e-mail ainda não foi confirmado

O usuário **não entra no sistema**
Ele é levado para a página **E-mail não verificado**, com explicação clara e opção de reenvio.

---

## 5. Login com Google

### Como funciona

1. O usuário clica em “Entrar com Google”
2. É redirecionado para o Google
3. Autoriza o acesso
4. Volta automaticamente para o site
5. Se autorizado:

   * entra diretamente no Dashboard

O usuário **não digita senha no site** nesse fluxo.

---

## 6. Página Criar Conta (`/register`)

### Campos obrigatórios

* Nome
* Sobrenome
* E-mail
* Senha
* Confirmar senha

### Regras da senha (sempre visíveis)

* Entre **5 e 12 caracteres**
* Deve conter:

  * letras minúsculas
  * letras maiúsculas
  * números
* Caracteres especiais são opcionais

### Comportamento

* Se algum campo estiver inválido:

  * o site mostra **mensagem clara**
* Se tudo estiver correto:

  * a conta é criada
  * o usuário vai para **Verifique seu e-mail**

---

## 7. Página Verifique seu e-mail (`/check-your-email`)

Esta página **sempre usa mensagens neutras**.

Ela diz, em resumo:

> “Se este e-mail puder receber mensagens, enviamos um link de confirmação.”

Motivo:

* o site **nunca informa se um e-mail existe ou não**
* isso evita tentativas de fraude

O usuário:

* abre o e-mail
* clica no link
* confirma o e-mail

---

## 8. Página E-mail não verificado (`/email-not-verified`)

Essa página aparece quando:

* o usuário tentou fazer login
* mas o e-mail ainda não foi confirmado

Ela:

* explica o motivo do bloqueio
* permite reenviar o e-mail de confirmação

Ao reenviar:

* o usuário é redirecionado para **Verifique seu e-mail**
* sem contagem confusa ou travamento

---

## 9. Página Esqueci a senha (`/forgot-password`)

O usuário informa o e-mail.

O sistema:

* **sempre mostra sucesso**
* envia o e-mail **apenas se existir conta**
* nunca informa se o e-mail é válido ou não

---

## 10. Página Redefinir senha (`/reset-password`)

O usuário chega aqui pelo link recebido no e-mail.

Ele:

* informa a nova senha
* confirma a senha
* segue as mesmas regras de senha do cadastro

Se tudo estiver correto:

* a senha é alterada
* o usuário volta ao login

---

## 11. Dashboard (`/dashboard`)

O Dashboard:

* só é acessível se o usuário estiver autenticado
* se não estiver, o site redireciona automaticamente para o login

---

## 12. Conclusão funcional

O site foi desenhado para:

* ser claro para o usuário
* não confundir
* não vazar informação
* manter segurança mesmo em erros

Este documento descreve **o que o usuário vê e entende**, não como o código funciona.

