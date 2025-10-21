# 🔧 Correção: Persistência de Fontes Financiadoras

## ⚠️ **PROBLEMA IDENTIFICADO E CORRIGIDO**

---

## 🐛 **Problema**

As fontes financiadoras não estavam sendo persistidas ao salvar a atividade porque o JSON enviado não estava no formato correto esperado pelo backend.

---

## 📊 **Análise do Problema**

### **JSON Esperado pelo Backend:**
```json
{
  "id": 1,
  "nome": "Atividade 1 Engenharia",
  "objetivo": "Objetivo 1",
  "publicoAlvo": "Estudantes",
  "statusPublicacao": true,
  "fotoCapa": "/fotos-capa/1/1/def25309-ede6-41aa-a1ae-a253c3c5cd04.jpg",
  "coordenador": "João Silva",
  "dataRealizacao": "2023-01-15",
  "curso": {
    "id": 1,
    "nome": "Curso de Engenharia de Software",
    "ativo": true  // ⚠️ Campo 'ativo' era obrigatório!
  },
  "categoria": {
    "id": 1,
    "nome": "Ensino"
  },
  "fontesFinanciadora": [
    {
      "id": 1,
      "nome": "CNPq"  // ✅ Apenas id e nome
    },
    {
      "id": 2,
      "nome": "FAPEAM"
    }
  ],
  "integrantes": [ /* ... */ ]
}
```

### **JSON que Estava Sendo Enviado (INCORRETO):**
```json
{
  // ... outros campos ...
  "curso": {
    "id": 1,
    "nome": "Curso de Engenharia de Software"
    // ❌ FALTAVA: "ativo": true
  },
  "fontesFinanciadora": [
    {
      "id": 1,
      "nome": "CNPq",
      "ativo": false,  // ❌ Campo extra desnecessário
      "descricao": "..." // ❌ Campo extra desnecessário
    }
  ]
}
```

---

## ✅ **Solução Implementada**

### **1. Formatação das Fontes Financiadoras**

**Antes:**
```typescript
fontesFinanciadora: this.fontesFinanciadorasSelecionadas
```

**Depois:**
```typescript
// Formatar fontes financiadoras no padrão esperado pelo backend
const fontesFinanciadoraFormatadas = this.fontesFinanciadorasSelecionadas.map(fonte => ({
  id: fonte.id,
  nome: fonte.nome
}));

// Usar no objeto de atualização
fontesFinanciadora: fontesFinanciadoraFormatadas
```

**Benefício:** Remove campos extras e garante que apenas `id` e `nome` sejam enviados.

---

### **2. Adição do Campo 'ativo' no Curso**

**Antes:**
```typescript
curso: {
  id: formData.cursoId || 0,
  nome: this.atividade.curso.nome
  // ❌ FALTAVA: ativo
}
```

**Depois:**
```typescript
// Buscar o curso completo para obter o status 'ativo'
const cursoSelecionado = this.cursos.find(c => c.id === formData.cursoId);

curso: {
  id: formData.cursoId || 0,
  nome: cursoSelecionado?.nome || this.atividade.curso.nome,
  ativo: cursoSelecionado?.ativo !== undefined ? cursoSelecionado.ativo : this.atividade.curso.ativo
}
```

**Benefício:** Garante que o campo `ativo` seja sempre incluído no JSON.

---

### **3. Busca da Categoria Selecionada**

**Antes:**
```typescript
categoria: {
  id: formData.categoriaId || 0,
  nome: this.atividade.categoria.nome
}
```

**Depois:**
```typescript
// Buscar a categoria completa
const categoriaSelecionada = this.categorias.find(c => c.id === formData.categoriaId);

categoria: {
  id: formData.categoriaId || 0,
  nome: categoriaSelecionada?.nome || this.atividade.categoria.nome
}
```

**Benefício:** Nome correto mesmo se o usuário mudar a categoria.

---

### **4. Logs Detalhados para Debug**

Adicionados logs para facilitar a identificação de problemas:

```typescript
console.log('💰 IDs das fontes financiadoras:', fontesFinanciadoraIds);
console.log('💰 Fontes Financiadoras Formatadas:', fontesFinanciadoraFormatadas);
console.log('📋 JSON que será enviado:', JSON.stringify(atividadeUpdate, null, 2));
```

---

## 📝 **Código Completo Corrigido**

```typescript
onSubmit(): void {
  if (this.atividadeForm.valid) {
    this.isSaving = true;

    const formData = this.atividadeForm.value;
    
    // Converter data para formato ISO
    let dataRealizacao = formData.dataRealizacao;
    if (dataRealizacao instanceof Date) {
      dataRealizacao = dataRealizacao.toISOString().split('T')[0];
    }

    // Extrair IDs das fontes financiadoras
    const fontesFinanciadoraIds = this.fontesFinanciadorasSelecionadas.map(f => f.id);
    console.log('💰 IDs das fontes financiadoras:', fontesFinanciadoraIds);

    // Formatar fontes financiadoras no padrão esperado
    const fontesFinanciadoraFormatadas = this.fontesFinanciadorasSelecionadas.map(fonte => ({
      id: fonte.id,
      nome: fonte.nome
    }));

    if (this.atividade) {
      // Buscar dados completos
      const cursoSelecionado = this.cursos.find(c => c.id === formData.cursoId);
      const categoriaSelecionada = this.categorias.find(c => c.id === formData.categoriaId);

      // Formato completo
      const atividadeUpdate = {
        id: this.atividade.id,
        nome: formData.nome || '',
        objetivo: formData.objetivo || '',
        publicoAlvo: formData.publicoAlvo || '',
        statusPublicacao: formData.statusPublicacao !== null ? formData.statusPublicacao : false,
        coordenador: formData.coordenador || '',
        dataRealizacao: dataRealizacao || '',
        fotoCapa: this.atividade.fotoCapa || '',
        curso: {
          id: formData.cursoId || 0,
          nome: cursoSelecionado?.nome || this.atividade.curso.nome,
          ativo: cursoSelecionado?.ativo !== undefined ? cursoSelecionado.ativo : this.atividade.curso.ativo
        },
        categoria: {
          id: formData.categoriaId || 0,
          nome: categoriaSelecionada?.nome || this.atividade.categoria.nome
        },
        fontesFinanciadora: fontesFinanciadoraFormatadas,  // ✅ CORRIGIDO
        integrantes: this.atividade.integrantes || []
      };

      console.log('📋 JSON que será enviado:', JSON.stringify(atividadeUpdate, null, 2));

      this.atividadesService.updateAtividade(this.atividadeId, atividadeUpdate).subscribe({
        next: (response) => {
          console.log('✅ Atividade atualizada com sucesso:', response);
          this.showMessage('Atividade atualizada com sucesso!', 'success');
          this.isSaving = false;
          this.atividade = response;
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar atividade:', error);
          this.showMessage('Erro ao atualizar atividade', 'error');
          this.isSaving = false;
        }
      });
    }
  }
}
```

---

## 🔍 **Como Verificar se Está Funcionando**

### **1. Abrir o Console do Navegador**

Ao salvar a atividade, você deve ver:

```
💰 IDs das fontes financiadoras: [1, 2]
💰 Fontes Financiadoras Formatadas: [
  { id: 1, nome: "CNPq" },
  { id: 2, nome: "FAPEAM" }
]
📋 JSON que será enviado: {
  "id": 1,
  "nome": "Atividade 1 Engenharia",
  "curso": {
    "id": 1,
    "nome": "Curso de Engenharia de Software",
    "ativo": true  // ✅ Deve aparecer
  },
  "fontesFinanciadora": [
    { "id": 1, "nome": "CNPq" },      // ✅ Apenas id e nome
    { "id": 2, "nome": "FAPEAM" }     // ✅ Apenas id e nome
  ]
}
```

---

### **2. Verificar a Requisição no Network**

1. Abra **DevTools** → **Network**
2. Filtre por **XHR/Fetch**
3. Edite e salve uma atividade
4. Encontre a requisição `PUT /api/atividades/{id}`
5. Clique em **Payload** ou **Request**
6. Verifique se o JSON está correto

---

### **3. Verificar a Resposta do Backend**

Se der erro, o console mostrará:
```
❌ Erro ao atualizar atividade: ...
❌ Status: 400
❌ Error Body: { "message": "..." }
```

Se der sucesso:
```
✅ Atividade atualizada com sucesso: { ... }
```

---

## 📊 **Comparação Antes vs Depois**

| Item | Antes | Depois | Status |
|------|-------|--------|--------|
| **Fontes Financiadoras** | Objeto completo com campos extras | Apenas `id` e `nome` | ✅ Corrigido |
| **Campo 'ativo' no Curso** | ❌ Ausente | ✅ Presente | ✅ Corrigido |
| **Busca de Curso** | Nome da atividade atual | Nome do curso selecionado | ✅ Melhorado |
| **Busca de Categoria** | Nome da atividade atual | Nome da categoria selecionada | ✅ Melhorado |
| **Logs de Debug** | Básicos | Detalhados com JSON | ✅ Melhorado |

---

## ✅ **Checklist de Validação**

Antes de testar, verifique:

- ✅ Código atualizado no componente
- ✅ Navegador recarregado (Ctrl + F5)
- ✅ Console aberto para ver logs
- ✅ Network tab aberta para inspecionar requisição

---

## 🎯 **Resultado Esperado**

Ao salvar uma atividade com 2 fontes financiadoras:

**Requisição:**
```http
PUT http://localhost:8080/api/atividades/1
Content-Type: application/json

{
  "id": 1,
  "nome": "Atividade 1 Engenharia",
  "objetivo": "Objetivo 1",
  "publicoAlvo": "Estudantes",
  "statusPublicacao": true,
  "fotoCapa": "/fotos-capa/1/1/...",
  "coordenador": "João Silva",
  "dataRealizacao": "2023-01-15",
  "curso": {
    "id": 1,
    "nome": "Curso de Engenharia de Software",
    "ativo": true
  },
  "categoria": {
    "id": 1,
    "nome": "Ensino"
  },
  "fontesFinanciadora": [
    { "id": 1, "nome": "CNPq" },
    { "id": 2, "nome": "FAPEAM" }
  ],
  "integrantes": [ /* ... */ ]
}
```

**Resposta Esperada:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "nome": "Atividade 1 Engenharia",
  // ... todos os campos atualizados ...
  "fontesFinanciadora": [
    { "id": 1, "nome": "CNPq" },
    { "id": 2, "nome": "FAPEAM" }
  ]
}
```

---

## 🚀 **Status: CORRIGIDO E PRONTO PARA TESTE**

As correções foram aplicadas e o JSON agora está sendo enviado no formato correto esperado pelo backend!

**Próximos Passos:**
1. Recarregue a aplicação (Ctrl + F5)
2. Edite uma atividade
3. Adicione/remova fontes financiadoras
4. Salve e verifique os logs no console
5. Confirme que as fontes foram persistidas

---

**Data da Correção:** 2024  
**Arquivo Modificado:** `src/app/features/atividades/components/form-atividade/form-atividade.component.ts`  
**Status:** ✅ **CORRIGIDO**

