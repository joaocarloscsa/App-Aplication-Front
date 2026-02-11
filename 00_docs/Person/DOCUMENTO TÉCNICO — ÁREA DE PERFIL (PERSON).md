Perfeito. Abaixo está a **entrega completa**, organizada, sem alterar nada do que já está estável, exatamente como combinado.

---

# 📄 DOCUMENTO TÉCNICO — ÁREA DE PERFIL (PERSON)

**Projeto:** GSA Animal
**Escopo:** Front-end
**Data:** 2026-02-11

Este documento serve como **referência canônica** para qualquer desenvolvedor que venha a trabalhar na **área de perfil do usuário (Person)** no front-end.

Ele explica **rotas, arquivos, decisões de UX, contratos com o backend, armadilhas já encontradas e padrões obrigatórios**.

---

## 1️⃣ Arquitetura geral (Person ≠ User)

Regra estrutural **não negociável**:

* **User**

  * Responsável apenas por autenticação
  * Campos principais: `email`, `password`
* **Person**

  * Perfil civil e pessoal
  * Todos os dados editáveis vivem aqui
  * Pode existir **com tudo nulo**, exceto o vínculo com User

📌 **Nunca misturar conceitos de User e Person no formulário.**

---

## 2️⃣ Rotas canônicas (fonte de verdade)

### Atualizar perfil (insert/update progressivo)

```
PATCH /api/v1/me/profile
```

* Payload parcial
* Campos ausentes → ignorados
* Campos `null` → gravados como `NULL`
* Nenhum campo obrigatório

### Ler perfil completo

```
GET /api/v1/me
```

### Foto de perfil (fora do formulário)

```
POST /api/v1/me/profile-photo
GET  /api/v1/me/profile-photo/read
```

📌 **Foto nunca é enviada junto com o profile.**

---

## 3️⃣ Localização dos arquivos no Front-end

### Página

```
/var/www/GSA/animal/frontend/src/app/(protected)/dashboard/profile/page.tsx
```

Responsável apenas por:

* carregar `/api/v1/me`
* renderizar o formulário
* **nenhuma lógica de negócio**

---

### Formulário

```
/var/www/GSA/animal/frontend/src/components/profile/UserProfileForm.tsx
```

Responsável por:

* estado do formulário
* PATCH `/api/v1/me/profile`
* UX, validações leves e feedback visual

---

## 4️⃣ Navegação (Dashboard)

### Menu lateral

Arquivo:

```
src/components/layout/menu.config.ts
```

Adicionar:

```ts
{
  key: "profile",
  label: "Perfil",
  href: "/dashboard/profile",
}
```

---

### Menu do usuário (TopBar)

Arquivo:

```
src/components/layout/TopBar.tsx
```

Adicionar opção no dropdown:

* **Editar perfil** → `/dashboard/profile`

📌 Não reutilizar overlay do UserCard para edição.

---

## 5️⃣ Campos do formulário (obrigatório implementar todos)

### Identificação

* `first_name`
* `last_name`
* `full_name`

  * **somente leitura**
  * derivado automaticamente

### Dados pessoais

* `date_of_birth`
* `place_of_birth`
* `gender`

### Documentos

* `national_identity_number`
* `national_identity_country`
* `passport_number`
* `passport_country`
* `passport_expiration_date`

### Fiscal

* `tax_identification_number`
* `tax_identification_country`

### Técnicos (read-only)

* `public_id`
* `created_at`
* `updated_at`

📌 **Todos opcionais.**
📌 **Nunca assumir que vêm preenchidos.**

---

## 6️⃣ UX obrigatória

* Campos com **ícone de ajuda (ℹ️)**

  * Tooltip ou modal (mobile-safe)
  * Texto explicando *para que serve o campo*
* Nenhum campo bloqueia o salvamento
* Botão **Salvar**:

  * não muda layout
  * feedback visível (ex: botão verde + texto “Salvo” por 2s)
* Sem scroll jump
* Sem reload de página

---

## 7️⃣ Foto de perfil

* **Não editável no UserCard**
* Editada apenas na página de perfil
* Componente reutilizável
* Crop:

  * Pessoa → **visual circular**
  * Upload → imagem quadrada normal
* Fluxo:

  1. Seleciona imagem
  2. Crop
  3. Upload
  4. Refresh `/me`

---

## 8️⃣ Erros comuns (já resolvidos — NÃO repetir)

❌ Assumir que `person.profile` sempre existe
❌ Assumir que `addresses[0]` existe
❌ Colocar `<button>` dentro de `<button>`
❌ Misturar edição de foto com card de visualização
❌ Forçar validação onde backend aceita `null`

---

## 9️⃣ Regra final (guia mental)

> **Ausência de dado NÃO é erro.
> Erro é assumir que o dado existe.**

---

## 10️⃣ Próximos passos naturais (fora deste escopo)

* Formulário de **endereços**
* Formulário de **contatos**
* Histórico/auditoria visual
* Permissões por papel
* Internacionalização (i18n)
