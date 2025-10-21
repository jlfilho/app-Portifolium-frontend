# 📢 Exibição de Mensagens de Erro do Servidor

## 📋 Visão Geral

Implementação de **extração inteligente** de mensagens de erro retornadas pelo backend, garantindo que o usuário veja **mensagens específicas** ao invés de erros genéricos.

---

## ✅ Implementação

### **Métodos Atualizados**

**Arquivo:** `src/app/features/cursos/components/cards-cursos/cards-cursos.component.ts`

#### **1. Exclusão de Curso (performDelete)**

```typescript
private performDelete(cursoId: number, cursoNome: string): void {
  this.cursosService.deleteCourse(cursoId).subscribe({
    error: (error) => {
      // Extrair mensagem de erro do servidor
      let errorMessage = 'Erro ao excluir curso. Tente novamente.';
      
      if (error.error) {
        // String direta
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } 
        // Objeto com propriedade 'message'
        else if (error.error.message) {
          errorMessage = error.error.message;
        } 
        // Objeto com propriedade 'error'
        else if (error.error.error) {
          errorMessage = error.error.error;
        }
      } 
      // Fallback para error.message
      else if (error.message) {
        errorMessage = error.message;
      }
      
      this.showMessage(errorMessage, 'error');
    }
  });
}
```

---

#### **2. Atualização de Status (performStatusUpdate)**

```typescript
private performStatusUpdate(cursoId: number, cursoNome: string, novoStatus: boolean): void {
  this.cursosService.updateCourseStatus(cursoId, novoStatus).subscribe({
    error: (error) => {
      // Mesma lógica de extração
      let errorMessage = 'Erro ao atualizar status do curso. Tente novamente.';
      
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.error) {
          errorMessage = error.error.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.showMessage(errorMessage, 'error');
    }
  });
}
```

---

## 🔍 **Formatos de Erro Suportados**

### **Formato 1: String Direta**
```json
"Curso não encontrado"
```
**Extração:**
```typescript
if (typeof error.error === 'string') {
  errorMessage = error.error;
}
```

---

### **Formato 2: Objeto com 'message'**
```json
{
  "message": "Não é possível excluir curso com atividades vinculadas",
  "status": 400
}
```
**Extração:**
```typescript
if (error.error.message) {
  errorMessage = error.error.message;
}
```

---

### **Formato 3: Objeto com 'error'**
```json
{
  "error": "Curso possui dependências que impedem a exclusão",
  "timestamp": "2025-10-20T..."
}
```
**Extração:**
```typescript
if (error.error.error) {
  errorMessage = error.error.error;
}
```

---

### **Formato 4: HttpErrorResponse.message**
```typescript
error.message = "Http failure response for http://..."
```
**Extração:**
```typescript
if (error.message) {
  errorMessage = error.message;
}
```

---

### **Formato 5: Mensagem Padrão (Fallback)**
```typescript
errorMessage = 'Erro ao excluir curso. Tente novamente.';
```
**Usado quando:** Nenhum dos formatos acima está disponível

---

## 📊 **Exemplos de Mensagens Exibidas**

### **Erro 403 (Forbidden):**
```
Backend retorna:
{
  "message": "Acesso negado. Apenas administradores podem excluir cursos."
}

Usuário vê:
"Acesso negado. Apenas administradores podem excluir cursos."
```

---

### **Erro 404 (Not Found):**
```
Backend retorna:
{
  "message": "Curso com ID 999 não encontrado"
}

Usuário vê:
"Curso com ID 999 não encontrado"
```

---

### **Erro 400 (Bad Request):**
```
Backend retorna:
{
  "message": "Não é possível excluir curso com atividades vinculadas"
}

Usuário vê:
"Não é possível excluir curso com atividades vinculadas"
```

---

### **Erro 500 (Internal Server Error):**
```
Backend retorna:
{
  "error": "Erro interno ao processar exclusão"
}

Usuário vê:
"Erro interno ao processar exclusão"
```

---

### **Erro de Rede (Sem Conexão):**
```
Backend não responde

Usuário vê:
"Http failure response for http://localhost:8080/api/cursos/1: 0 Unknown Error"
```

---

## 🎯 **Lógica de Prioridade**

A extração tenta na seguinte ordem:

```
1. error.error (string) 
   ↓ se não for string
2. error.error.message
   ↓ se não existir
3. error.error.error
   ↓ se não existir
4. error.message
   ↓ se não existir
5. Mensagem padrão (fallback)
```

**Resultado:** Sempre exibe a melhor mensagem disponível! ✅

---

## 📝 **Logs no Console**

### **Quando Ocorre Erro:**
```
❌ Erro ao deletar curso: {status: 400, error: {...}}
📊 Detalhes do erro: {message: "Não é possível excluir..."}
🔢 Status HTTP: 400
📢 Mensagem de erro extraída: "Não é possível excluir curso com atividades vinculadas"
```

**Snackbar exibe:**
```
⚠️ "Não é possível excluir curso com atividades vinculadas"
```

---

## ✅ **Benefícios da Implementação**

### **UX:**
- 👁️ **Mensagens específicas** do servidor
- 💡 **Feedback claro** sobre o problema
- 🎯 **Usuário entende** o que aconteceu
- ⚡ **Mais fácil** resolver o problema

### **Debug:**
- 🔍 **Logs completos** no console
- 📊 **Detalhes do erro** registrados
- 🔢 **Status HTTP** visível
- 📢 **Mensagem extraída** mostrada

### **Técnico:**
- 🔧 **Suporta múltiplos formatos** de erro
- 🔄 **Fallback robusto** quando não há mensagem
- 📦 **Código reutilizável**
- 🚀 **Manutenível**

---

## 🎨 **Exemplos Visuais**

### **Erro Específico (Backend):**
```
┌─────────────────────────────────────────┐
│  ⚠️                                      │
│                                         │
│  Não é possível excluir curso com       │
│  atividades vinculadas                  │
│                                         │
│                           [Fechar]      │
└─────────────────────────────────────────┘
```

### **Erro Genérico (Fallback):**
```
┌─────────────────────────────────────────┐
│  ⚠️                                      │
│                                         │
│  Erro ao excluir curso.                 │
│  Tente novamente.                       │
│                                         │
│                           [Fechar]      │
└─────────────────────────────────────────┘
```

---

## 📊 **Cobertura de Erros**

| Tipo de Erro | Mensagem Extraída | Fonte |
|--------------|-------------------|-------|
| **403 Forbidden** | "Acesso negado..." | `error.error.message` |
| **404 Not Found** | "Curso não encontrado" | `error.error.message` |
| **400 Bad Request** | "Não é possível excluir..." | `error.error.message` |
| **500 Server Error** | "Erro interno..." | `error.error.error` |
| **Network Error** | "Http failure response..." | `error.message` |
| **Desconhecido** | "Erro ao excluir... Tente novamente." | Fallback |

---

## 🎉 **Resultado Final**

**Agora as mensagens de erro:**

✅ **Mostram detalhes específicos** do servidor  
✅ **Suportam múltiplos formatos** de resposta  
✅ **Têm fallback robusto** quando não há mensagem  
✅ **São registradas no console** para debug  
✅ **Aparecem no snackbar** vermelho  
✅ **Ajudam o usuário** a entender o problema  

**Mensagens de erro do servidor agora são exibidas ao usuário!** 🚀✨

---

## 📚 **Arquivos Modificados**

| Arquivo | Mudanças |
|---------|----------|
| `cards-cursos.component.ts` | +26 linhas - Extração de mensagens em 2 métodos |

---

**Data da Implementação:** 20 de outubro de 2025  
**Métodos Atualizados:** 2 (performDelete + performStatusUpdate)  
**Formatos Suportados:** 5 formatos de erro  
**Status:** ✅ **CONCLUÍDO**



