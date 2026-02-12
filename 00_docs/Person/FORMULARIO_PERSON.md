## Regra-mestra (pra parar o “vai e volta”)

1. **Nenhuma feature de formulário entra “pela metade”.**
   Se um domínio tem campos/entidades, a UI precisa cobrir:

   * **Visualização** (listar e ler)
   * **Criação**
   * **Edição**
   * **Remoção**
   * **Metadados** (created_at / updated_at quando existirem e forem úteis)
   * **Semântica** (tipo/label humano e códigos/enums separados)

2. **Enums sempre com fallback semântico (“other” exige rótulo).**
   Se a API tem `type=other`, a UI **obrigatoriamente** pede `label` (ex.: “Casa do cão”, “WhatsApp da loja”, “Residência no Brasil”).
   Sem isso, “other” vira lixo e o dado perde valor.

3. **Seção “principal” = o que é mais usado e mais crítico.**
   O que é usado em 80% do tempo fica aberto e visível. O resto fica em seções colapsáveis.

4. **Fonte da verdade:**

   * Profile payload (`/api/v1/me/profile`) só manda campos editáveis.
   * `created_at` / `updated_at` **nunca** vão no payload de update.
   * Entidades separadas (contacts/addresses) seguem suas rotas próprias.

---

## Checklist obrigatório do formulário do usuário (não esquecer nada)

### A) Cabeçalho do perfil (sempre visível)

* Foto de perfil (com crop) **quadrada**
* Email (read-only)
* **Person public_id + botão copiar** (abaixo da foto)
* **created_at + updated_at (read-only)** (formatação de data/hora)

> Se a API do `me.person` ainda não traz created_at/updated_at, a UI não inventa: ou você adiciona no backend, ou o campo não aparece.

---

### B) Dados principais (sempre abertos)

Obrigatórios na UI (editáveis se existirem na API):

* first_name
* last_name
* full_name (read-only: concat)
* date_of_birth
* tax_identification_number (NIF/CPF/etc.)
* tax_identification_country (se existir / mesmo que hoje seja livre)
* gender (select fixo):

  * male, female, other, prefer_not_to_say (ou null)
* place_of_birth (opcional mas útil)

---

### C) Documento nacional (colapsável, fechado por padrão)

* national_identity_number
* national_identity_country (ISO-2 ou livre por enquanto)

---

### D) Passaporte (colapsável, fechado por padrão)

* passport_number
* passport_country
* passport_expiration_date

---

### E) Informações adicionais (colapsável, fechado por padrão)

* Qualquer outro campo do profile que não esteja em “principais”, mas exista no payload (ex.: observações futuras)

---

## Entidades separadas (não misturar com /me/profile)

### F) Telefones (colapsável, fechado por padrão)

**Listagem (sempre):**

* label do tipo (mobile/home/work/other)
* valor
* botões: remover
* edição do valor (onBlur)

**Criação (sempre):**

* select `contact_type`: phone_mobile | phone_home | phone_work | other
* input `value`
* **se contact_type === other:** mostrar input obrigatório `other_label` (ex.: “WhatsApp da loja”, “Telefone da vizinha”)

**Regra “other”:**

* other sem label é inválido na UI (bloqueia submit).

> Se o backend hoje não suporta `other_label`, a UI guarda onde?
> Existem só 2 opções válidas:
>
> 1. **Adicionar `label` no backend** (correto)
> 2. Mapear “other_label” num campo existente (gambiarra que vira dívida técnica).
>    Eu recomendo 1). Se você quiser, eu te passo o contrato mínimo.

---

### G) Endereços (colapsável, fechado por padrão)

**Listagem (sempre):**

* label do tipo (home/work/other)
* campos do endereço
* botão remover
* edição por campo (onBlur)

**Criação (sempre):**

* select `address_type`: home | work | other
* street, city, region, postal_code, country
* **se address_type === other:** mostrar input obrigatório `other_label` (ex.: “Casa do cão”, “Casa na outra ilha”, “Endereço temporário”)

**Regra “other”:**

* other sem label é inválido na UI.

> Mesma observação: se backend não tem `other_label`, precisa ser adicionado.

---

## Anti-regressão (o que a gente PARA de fazer)

* Parar de “ajustar visual” sem checklist de campos.
* Parar de duplicar lógica de formulário em lugares diferentes.
* Parar de inventar `read_url` vs `url`: cada componente tem contrato claro e único.

---

## Pergunta objetiva (pra destravar sem chute)

Hoje, **contacts** e **addresses** no backend suportam armazenar um “rótulo livre” quando o tipo é `other`?

* Se **sim**, me diga o nome do campo (ex.: `label`, `display_name`, `other_label`, `description`).
* Se **não**, a regra acima exige **alteração de contrato** (backend) — senão você vai continuar com “other” inútil.

Se você colar um exemplo de payload de **create contact** e **create address** aceito pela API (ou o controller/schema), eu te devolvo a implementação exata no frontend sem regressão.
