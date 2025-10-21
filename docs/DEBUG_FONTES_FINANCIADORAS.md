# 🔍 Guia de Debug: Fontes Financiadoras

## 📋 **LOGS DETALHADOS IMPLEMENTADOS**

Foram adicionados logs extensivos para diagnosticar o problema de persistência das fontes financiadoras.

---

## 🎯 **Como Usar Este Guia**

### **1. Abra o Console do Navegador**
- Pressione `F12` ou `Ctrl + Shift + I`
- Vá para a aba **Console**
- Limpe o console (ícone 🚫 ou `Ctrl + L`)

---

### **2. Teste: Adicionar Fonte Financiadora**

**Passos:**
1. Abra o formulário de edição de uma atividade
2. Na seção "Fontes Financiadoras", selecione uma fonte
3. Clique em "Adicionar"

**Logs Esperados:**
```
🔄 Tentando adicionar fonte. ID selecionado: 3
📋 Fontes selecionadas ANTES: [
  { id: 1, nome: "UEA" },
  { id: 2, nome: "FAPEAM" }
]
🔍 Fonte encontrada na lista completa: { id: 3, nome: "CNPq" }
✅ Fonte financiadora adicionada: { id: 3, nome: "CNPq" }
📋 Fontes selecionadas DEPOIS: [
  { id: 1, nome: "UEA" },
  { id: 2, nome: "FAPEAM" },
  { id: 3, nome: "CNPq" }
]
📊 Total de fontes: 3
```

**Se a fonte NÃO for adicionada, verifique:**
- ⚠️ `Fonte já adicionada!` → Fonte já está na lista
- ❌ `Fonte não encontrada na lista completa!` → Problema ao buscar fonte

---

### **3. Teste: Remover Fonte Financiadora**

**Passos:**
1. Clique no X de um chip de fonte

**Logs Esperados:**
```
🗑️ Tentando remover fonte: { id: 2, nome: "FAPEAM" }
📋 Fontes selecionadas ANTES da remoção: [
  { id: 1, nome: "UEA" },
  { id: 2, nome: "FAPEAM" },
  { id: 3, nome: "CNPq" }
]
📍 Índice encontrado: 1
❌ Fonte financiadora removida: { id: 2, nome: "FAPEAM" }
📋 Fontes restantes: [
  { id: 1, nome: "UEA" },
  { id: 3, nome: "CNPq" }
]
📊 Total de fontes: 2
```

---

### **4. Teste: Salvar Atividade**

**Passos:**
1. Após adicionar/remover fontes, clique em "Salvar"

**Logs Esperados:**
```
💰 Fontes Selecionadas (Array Completo): [
  { id: 1, nome: "UEA" },
  { id: 3, nome: "CNPq" }
]
💰 IDs das fontes financiadoras: [1, 3]
💰 Quantidade de fontes selecionadas: 2
💰 Fontes Formatadas: [
  { id: 1, nome: "UEA" },
  { id: 3, nome: "CNPq" }
]
📚 Cursos disponíveis: [...]
📚 Curso selecionado (ID: 1): { id: 1, nome: "...", ativo: true }
📂 Categoria selecionada (ID: 1): { id: 1, nome: "..." }
📋 JSON que será enviado: {
  "id": 1,
  "nome": "Atividade 1 Engenharia",
  "curso": {
    "id": 1,
    "nome": "Curso de Engenharia de Software",
    "ativo": true
  },
  "fontesFinanciadora": [
    { "id": 1, "nome": "UEA" },
    { "id": 3, "nome": "CNPq" }
  ],
  ...
}
```

---

## 🔍 **Diagnóstico de Problemas**

### **Problema 1: Fonte não é adicionada**

**Sintoma:**
```
❌ Fonte não encontrada na lista completa!
```

**Causa Possível:**
- A lista `fontesFinanciadoras` não está carregada
- O ID selecionado não corresponde a nenhuma fonte

**Solução:**
1. Verifique se `loadFontesFinanciadoras()` foi chamado
2. Confirme que `fontesFinanciadoras` tem dados:
   ```javascript
   console.log('Lista completa:', this.fontesFinanciadoras);
   ```

---

### **Problema 2: Fontes não aparecem no JSON**

**Sintoma:**
```json
{
  "fontesFinanciadora": []
}
```

**Causa Possível:**
- Array `fontesFinanciadorasSelecionadas` está vazio

**Diagnóstico:**
Verifique nos logs:
```
💰 Quantidade de fontes selecionadas: 0  // ❌ Problema aqui!
💰 Fontes Formatadas: []
```

**Solução:**
- Adicione fontes usando o botão "Adicionar"
- Verifique se o método `adicionarFonteFinanciadora()` está funcionando

---

### **Problema 3: JSON não tem campo 'ativo' no curso**

**Sintoma:**
```json
{
  "curso": {
    "id": 1,
    "nome": "Curso de Engenharia de Software"
    // ❌ Falta: "ativo": true
  }
}
```

**Diagnóstico:**
Verifique nos logs:
```
📚 Curso selecionado (ID: 1): undefined  // ❌ Problema!
```

**Causa Possível:**
- Array `cursos` está vazio
- ID do curso não corresponde

**Solução:**
1. Verifique se `loadCursos()` foi chamado
2. Confirme que `cursos` tem dados:
   ```javascript
   console.log('Cursos carregados:', this.cursos);
   ```

---

### **Problema 4: Fontes aparecem mas não persistem**

**Sintoma:**
- Fontes aparecem no JSON enviado
- Backend retorna sucesso
- Ao recarregar, fontes não aparecem

**Diagnóstico:**
1. Verifique a resposta do backend no console:
   ```
   ✅ Atividade atualizada com sucesso: { ... }
   ```

2. Veja se a resposta inclui as fontes:
   ```json
   {
     "fontesFinanciadora": [
       { "id": 1, "nome": "UEA" },
       { "id": 3, "nome": "CNPq" }
     ]
   }
   ```

**Se as fontes NÃO aparecem na resposta:**
- ⚠️ **Problema no backend!**
- O backend não está salvando corretamente

**Solução:**
- Verifique os logs do backend
- Confirme que o controller está processando `fontesFinanciadora`
- Verifique o relacionamento `@ManyToMany` no backend

---

## 📊 **Checklist de Verificação**

### **Frontend:**
- [ ] `fontesFinanciadoras` está carregado?
  ```
  console.log('Fontes disponíveis:', this.fontesFinanciadoras);
  ```

- [ ] `fontesFinanciadorasSelecionadas` tem as fontes corretas?
  ```
  console.log('Fontes selecionadas:', this.fontesFinanciadorasSelecionadas);
  ```

- [ ] JSON enviado está correto?
  ```
  📋 JSON que será enviado: { ... }
  ```

- [ ] Curso tem campo `ativo`?
  ```json
  "curso": { "id": 1, "nome": "...", "ativo": true }
  ```

### **Backend:**
- [ ] Endpoint recebeu o JSON?
  - Verifique logs do backend

- [ ] Fontes foram salvas no banco?
  - Execute query SQL para verificar

- [ ] Resposta do backend inclui as fontes?
  ```
  ✅ Atividade atualizada com sucesso: { "fontesFinanciadora": [...] }
  ```

---

## 🎯 **Cenários de Teste**

### **Cenário 1: Adicionar 1 Fonte**
1. Atividade original tem: [UEA, FAPEAM]
2. Adicionar: CNPq
3. Esperado: [UEA, FAPEAM, CNPq]

**Logs para conferir:**
```
📊 Total de fontes: 3
💰 IDs das fontes financiadoras: [1, 2, 3]
```

---

### **Cenário 2: Remover 1 Fonte**
1. Atividade tem: [UEA, FAPEAM, CNPq]
2. Remover: FAPEAM
3. Esperado: [UEA, CNPq]

**Logs para conferir:**
```
📊 Total de fontes: 2
💰 IDs das fontes financiadoras: [1, 3]
```

---

### **Cenário 3: Remover Todas e Adicionar Novas**
1. Atividade tem: [UEA, FAPEAM]
2. Remover: UEA, FAPEAM
3. Adicionar: CNPq, CAPES
4. Esperado: [CNPq, CAPES]

**Logs para conferir:**
```
📊 Total de fontes: 2
💰 IDs das fontes financiadoras: [3, 4]
```

---

## 🚨 **Problemas Comuns e Soluções**

### **1. Array vazio após adicionar**
```javascript
// Verifique se está usando push corretamente
this.fontesFinanciadorasSelecionadas.push(fonte); // ✅ Correto
```

### **2. Fontes duplicadas**
```javascript
// Verificação de duplicatas está implementada
const jaAdicionada = this.fontesFinanciadorasSelecionadas.some(
  f => f.id === this.fonteFinanciadoraSelecionada
);
```

### **3. Campo 'ativo' não aparece**
```javascript
// Verificar se curso foi encontrado
const cursoSelecionado = this.cursos.find(c => c.id === formData.cursoId);
console.log('Curso:', cursoSelecionado); // Deve ter 'ativo'
```

---

## 📝 **Exemplo de Fluxo Completo de Logs**

```
// CARREGAMENTO
💰 Fontes financiadoras carregadas: [
  { id: 1, nome: "UEA" },
  { id: 2, nome: "FAPEAM" },
  { id: 3, nome: "CNPq" }
]
💰 Fontes financiadoras da atividade carregadas: [
  { id: 1, nome: "UEA" },
  { id: 2, nome: "FAPEAM" }
]

// ADICIONAR FONTE
🔄 Tentando adicionar fonte. ID selecionado: 3
📋 Fontes selecionadas ANTES: [...]
🔍 Fonte encontrada: { id: 3, nome: "CNPq" }
✅ Fonte financiadora adicionada
📋 Fontes selecionadas DEPOIS: [UEA, FAPEAM, CNPq]
📊 Total de fontes: 3

// SALVAR
💰 Quantidade de fontes selecionadas: 3
💰 Fontes Formatadas: [
  { id: 1, nome: "UEA" },
  { id: 2, nome: "FAPEAM" },
  { id: 3, nome: "CNPq" }
]
📋 JSON enviado: { "fontesFinanciadora": [...] }
✅ Atividade atualizada com sucesso
```

---

## 🔧 **Próximos Passos**

1. **Teste cada cenário** listado acima
2. **Copie os logs** do console
3. **Compare** com os logs esperados neste guia
4. **Identifique** onde está a diferença
5. **Reporte** o problema específico encontrado

---

**Data:** 2024  
**Status:** Logs implementados  
**Próximo:** Testar e analisar resultados

