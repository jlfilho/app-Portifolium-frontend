# 🔍 Troubleshooting: Integrantes Não Estão Persistindo

## 🎯 **GUIA DE DIAGNÓSTICO**

---

## 📊 **Passo 1: Verificar se o Integrante Foi Adicionado**

### **Ao Adicionar um Integrante:**

**Logs Esperados:**
```
🔄 Tentando adicionar integrante. Pessoa ID: 5, Papel: BOLSISTA
📋 Integrantes selecionados ANTES: [...]
🔍 Pessoa encontrada na lista completa: { id: 5, nome: "Maria Santos", cpf: "98765432100" }
✅ Integrante adicionado à lista: { id: 5, nome: "Maria Santos", cpf: "98765432100", papel: "BOLSISTA" }
📋 Integrantes selecionados DEPOIS: [...]
📊 Total de integrantes: 3
```

**✅ Se aparecer:** Integrante foi adicionado ao array  
**❌ Se NÃO aparecer:** Problema ao adicionar

---

## 📊 **Passo 2: Verificar se Está no Array ao Salvar**

### **Ao Clicar em "Salvar":**

**Logs Esperados:**
```
👥 Integrantes Formatados: [
  {
    "id": 3,
    "nome": "João Silva",
    "cpf": "12345678901",
    "papel": "COORDENADOR"
  },
  {
    "id": 5,
    "nome": "Maria Santos",
    "cpf": "98765432100",
    "papel": "BOLSISTA"
  }
]
👥 Quantidade de integrantes: 2
👥 Integrantes Selecionados (raw): [...]
```

**✅ Se aparecer com 2 integrantes:** Array está correto  
**❌ Se aparecer com 0 ou 1:** Integrante não foi adicionado

---

## 📊 **Passo 3: Verificar JSON Enviado**

**Log Esperado:**
```
📋 JSON que será enviado: {
  "id": 1,
  "nome": "Atividade 1",
  ...
  "integrantes": [
    {
      "id": 3,
      "nome": "João Silva",
      "cpf": "12345678901",
      "papel": "COORDENADOR"
    },
    {
      "id": 5,
      "nome": "Maria Santos",
      "cpf": "98765432100",
      "papel": "BOLSISTA"
    }
  ]
}
```

**Verifique:**
- ✅ Campo `integrantes` existe no JSON?
- ✅ Array tem os integrantes corretos?
- ✅ Cada integrante tem `id`, `nome`, `cpf`, `papel`?

---

## 📊 **Passo 4: Verificar Resposta do Backend**

**Log Esperado:**
```
✅ Atividade atualizada com sucesso: {
  "id": 1,
  "nome": "Atividade 1",
  ...
  "integrantes": [
    {
      "id": 3,
      "nome": "João Silva",
      "cpf": "12345678901",
      "papel": "COORDENADOR"
    },
    {
      "id": 5,
      "nome": "Maria Santos",
      "cpf": "98765432100",
      "papel": "BOLSISTA"
    }
  ]
}
```

**Verifique:**
- ✅ Resposta inclui os integrantes?
- ✅ Integrantes estão completos?

**Se os integrantes NÃO aparecem na resposta:**
- ⚠️ **Problema no backend!**
- O backend não está salvando/retornando os integrantes

---

## 🔍 **Possíveis Causas**

### **Causa 1: Integrante não foi adicionado ao array**

**Sintoma:**
```
📊 Total de integrantes: 0
```

**Diagnóstico:**
- Verifique se clicou em "Adicionar"
- Veja se apareceu na lista visual

**Solução:**
- Selecione pessoa
- Selecione papel
- Clique em "Adicionar"
- Confirme que a linha apareceu

---

### **Causa 2: Array está vazio ao salvar**

**Sintoma:**
```
👥 Integrantes Formatados: []
📋 JSON: { "integrantes": [] }
```

**Diagnóstico:**
- Array `integrantesSelecionados` está vazio
- Integrantes foram removidos ou não adicionados

**Solução:**
- Adicione integrantes novamente
- Não clique em remover (🗑️) antes de salvar

---

### **Causa 3: JSON está correto mas backend não salva**

**Sintoma:**
```
📋 JSON enviado: { "integrantes": [...] }  // ✅ Correto
✅ Atividade atualizada com sucesso: { "integrantes": [] }  // ❌ Vazio!
```

**Diagnóstico:**
- Frontend enviando corretamente
- **Backend não está processando**

**Solução:**
- Verifique logs do backend
- Confirme que o controller está recebendo `integrantes`
- Verifique se há erro no backend ao salvar

---

### **Causa 4: Integrantes são objetos diferentes**

**Sintoma:**
Backend espera apenas IDs, mas estamos enviando objetos completos.

**Possível Solução:**
Se o backend espera apenas IDs (similar às fontes financiadoras):

```typescript
// Em vez de:
"integrantes": [
  { "id": 3, "nome": "João", "cpf": "123", "papel": "COORDENADOR" }
]

// Deveria ser:
"integrantesIds": [3, 5, 7]
// OU
"integrantes": [
  { "pessoaId": 3, "papel": "COORDENADOR" },
  { "pessoaId": 5, "papel": "BOLSISTA" }
]
```

---

## 🔧 **Checklist de Verificação**

Execute estas verificações e me envie os resultados:

### **1. Adicionar Integrante:**
- [ ] Selecionei uma pessoa?
- [ ] Selecionei um papel?
- [ ] Cliquei em "Adicionar"?
- [ ] A linha apareceu na tabela?
- [ ] Console mostra: `✅ Integrante adicionado à lista`?

### **2. Ao Salvar:**
- [ ] Console mostra: `👥 Quantidade de integrantes: X` (X > 0)?
- [ ] Console mostra: `👥 Integrantes Formatados: [...]`?
- [ ] JSON enviado tem campo `integrantes`?
- [ ] Array de integrantes não está vazio?

### **3. Resposta do Backend:**
- [ ] Console mostra: `✅ Atividade atualizada com sucesso`?
- [ ] Resposta do backend inclui `integrantes`?
- [ ] Integrantes na resposta estão vazios ou cheios?

---

## 📝 **O Que Fazer Agora**

### **Por favor, me envie:**

1. **Logs do console ao adicionar integrante:**
   ```
   🔄 Tentando adicionar integrante...
   ✅ Integrante adicionado à lista...
   📊 Total de integrantes: ?
   ```

2. **Logs do console ao salvar:**
   ```
   👥 Quantidade de integrantes: ?
   👥 Integrantes Formatados: [...]
   📋 JSON que será enviado: {...}
   ```

3. **Resposta do backend:**
   ```
   ✅ Atividade atualizada com sucesso: {...}
   ```

Com esses logs, poderei identificar exatamente onde está o problema!

---

## 🎯 **Hipóteses Mais Prováveis**

### **1. Backend espera formato diferente** (80% provável)
- Talvez apenas `pessoaId` e `papel`
- Ou apenas array de IDs
- Precisa ver logs do backend

### **2. Campo não está sendo incluído no JSON** (15% provável)
- Variável `integrantesFormatados` não está sendo usada
- Verificar se está dentro do `if (this.atividade)`

### **3. Backend não está salvando** (5% provável)
- Controller não processa `integrantes`
- Erro no serviço do backend

---

**🔍 AGUARDANDO LOGS PARA DIAGNÓSTICO PRECISO! 🔍**

