# 🔍 Troubleshooting - Toggle de Status do Curso

## 📋 Problema Reportado

A funcionalidade de ativar/desativar curso **não está funcionando**.

---

## 🔍 **Checklist de Diagnóstico**

### **1. Verificar Console do Navegador**

Abra o console (F12) e procure por:

#### **Logs Esperados ao Clicar:**
```
🔄 Toggle status chamado para curso: {id: 1, nome: "...", ativo: true}
📊 Status atual: true
🎯 Novo status será: false
💬 Resultado do diálogo: true
✅ Confirmado! Executando atualização...
📡 Chamando API para atualizar status...
📋 Dados: {cursoId: 1, novoStatus: false}
✅ Resposta da API: {...}
🔄 Recarregando lista de cursos...
```

#### **Se NÃO aparecer nada:**
❌ O método não está sendo chamado
- Verifique se o botão tem `(click)="toggleCourseStatus(curso)"`
- Verifique se há erros de compilação

#### **Se aparecer erro 401/403:**
❌ Problema de autenticação/autorização
```
❌ Erro ao atualizar status do curso: {status: 403}
📊 Detalhes do erro: "Access Denied"
```
→ Usuário não é ADMINISTRADOR

#### **Se aparecer erro 404:**
❌ Endpoint não encontrado
```
❌ Erro ao atualizar status do curso: {status: 404}
```
→ Backend não tem o endpoint `/cursos/{id}/status`

#### **Se aparecer erro 500:**
❌ Erro no backend
```
❌ Erro ao atualizar status do curso: {status: 500}
```
→ Verificar logs do backend

---

### **2. Verificar Backend**

#### **Endpoint Correto:**
```java
@PutMapping("/{cursoId}/status")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public ResponseEntity<CursoDTO> atualizarStatusCurso(
    @PathVariable Long cursoId,
    @Validated @RequestBody CursoDTO cursoDTO
) {
    CursoDTO cursoAtualizado = cursoService.updateStatusCurso(cursoId, cursoDTO.ativo());
    return ResponseEntity.ok(cursoAtualizado);
}
```

#### **Verificar se:**
- ✅ Endpoint existe em `CursoController`
- ✅ Método `updateStatusCurso` existe em `CursoService`
- ✅ Usuário tem role `ADMINISTRADOR`

---

### **3. Verificar Request HTTP**

Abra a aba **Network** no navegador (F12):

#### **Request Esperado:**
```http
PUT http://localhost:8080/api/cursos/1/status
Content-Type: application/json
Authorization: Bearer eyJ...

Body:
{
  "ativo": false
}
```

#### **Response Esperado:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "nome": "Introdução ao Angular",
  "ativo": false,
  "categoria": {...}
}
```

---

### **4. Verificar Diálogo de Confirmação**

#### **Diálogo Abre?**
- ✅ Sim → Método está sendo chamado
- ❌ Não → Erro no componente

#### **Ao Clicar em "Sim, Ativar/Desativar":**
- Verifique logs no console
- Verifique request na aba Network

---

## 🔧 **Possíveis Problemas e Soluções**

### **Problema 1: Botão Não Responde**

**Sintoma:** Clicar no botão não faz nada

**Possíveis Causas:**
- ❌ Método não está no componente
- ❌ Nome do método está errado no HTML
- ❌ Erro de compilação

**Solução:**
```typescript
// Verificar se o método existe em cards-cursos.component.ts
toggleCourseStatus(curso: any): void {
  // ...
}
```

---

### **Problema 2: Diálogo Não Abre**

**Sintoma:** Clica mas diálogo não aparece

**Possíveis Causas:**
- ❌ `MatDialog` não foi injetado
- ❌ `ConfirmDialogComponent` não foi importado
- ❌ Erro no data do diálogo

**Solução:**
```typescript
// Verificar imports
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '...';

// Verificar constructor
constructor(
  private dialog: MatDialog,
  // ...
) {}
```

---

### **Problema 3: API Retorna Erro 403 (Forbidden)**

**Sintoma:** Console mostra "Access Denied" ou 403

**Causa:**
- ❌ Usuário **não é ADMINISTRADOR**

**Solução:**
1. Verificar role do usuário logado
2. Fazer login com usuário ADMINISTRADOR
3. Ou remover `@PreAuthorize` temporariamente no backend (não recomendado)

---

### **Problema 4: API Retorna Erro 404 (Not Found)**

**Sintoma:** Console mostra "Not Found" ou 404

**Causa:**
- ❌ Endpoint `/cursos/{id}/status` **não existe** no backend

**Solução:**
```java
// Adicionar no CursoController.java
@PutMapping("/{cursoId}/status")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public ResponseEntity<CursoDTO> atualizarStatusCurso(
    @PathVariable Long cursoId,
    @Validated @RequestBody CursoDTO cursoDTO
) {
    CursoDTO cursoAtualizado = cursoService.updateStatusCurso(cursoId, cursoDTO.ativo());
    return ResponseEntity.ok(cursoAtualizado);
}
```

---

### **Problema 5: API Retorna Erro 500 (Internal Server Error)**

**Sintoma:** Console mostra erro 500

**Causa:**
- ❌ Erro no método `updateStatusCurso` do backend
- ❌ Curso não existe
- ❌ Problema na validação

**Solução:**
1. Verificar logs do backend
2. Verificar se método `updateStatusCurso` existe em `CursoService`
3. Verificar se curso com ID existe

---

### **Problema 6: Request Não Sai (Nada no Network)**

**Sintoma:** Nenhum request aparece na aba Network

**Possíveis Causas:**
- ❌ Erro JavaScript antes de chamar API
- ❌ Observable não foi subscrito
- ❌ Erro no serviço

**Solução:**
```typescript
// Verificar se o método existe em cursos.service.ts
updateCourseStatus(id: number, ativo: boolean): Observable<any> {
  console.log('🔄 Atualizando status do curso:', id, 'Ativo:', ativo);
  return this.http.put(`${this.baseUrl}/cursos/${id}/status`, { ativo });
}
```

---

## 🧪 **Teste Manual Passo a Passo**

### **1. Abrir Console (F12)**
- Aba "Console" para ver logs
- Aba "Network" para ver requests

### **2. Clicar no Botão de Status**
- Card ativo (verde) ou inativo (cinza)
- Verificar se logs aparecem

### **3. Observar o Que Acontece:**

#### **Cenário A: Nada acontece**
```
❌ Sem logs no console
→ Botão não está conectado ao método
→ Verificar HTML: (click)="toggleCourseStatus(curso)"
```

#### **Cenário B: Diálogo abre mas erro ao confirmar**
```
✅ Logs até "Confirmado!"
❌ Erro na API
→ Verificar aba Network para ver erro HTTP
```

#### **Cenário C: Tudo OK mas lista não atualiza**
```
✅ API retorna 200 OK
❌ Visual não muda
→ Problema no loadCourses() ou binding
```

---

## 🔍 **Comandos de Debug**

### **No Console do Navegador:**

```javascript
// Verificar se componente existe
ng.probe($0).componentInstance

// Verificar cursos carregados
ng.probe($0).componentInstance.cursos

// Testar método diretamente
ng.probe($0).componentInstance.toggleCourseStatus({id: 1, nome: "Teste", ativo: true})
```

---

## 📊 **Checklist Completo**

| Item | Verificar | Status |
|------|-----------|--------|
| **Frontend** | Método existe no componente | ⬜ |
| **Frontend** | Botão tem (click) correto | ⬜ |
| **Frontend** | Logs aparecem no console | ⬜ |
| **Frontend** | Diálogo abre | ⬜ |
| **Frontend** | Serviço tem método updateCourseStatus | ⬜ |
| **Backend** | Endpoint /cursos/{id}/status existe | ⬜ |
| **Backend** | Método updateStatusCurso existe | ⬜ |
| **Backend** | Usuário tem role ADMINISTRADOR | ⬜ |
| **Network** | Request aparece na aba Network | ⬜ |
| **Network** | Response é 200 OK | ⬜ |

---

## 🚀 **Próximos Passos para Você**

### **1. Reinicie o Servidor Angular:**
```bash
# Parar servidor (Ctrl+C)
npm start
```

### **2. Faça Login como ADMINISTRADOR**

### **3. Abra o Console (F12)**

### **4. Clique no Botão de Status**

### **5. Compartilhe o Que Aparece no Console:**
- Screenshot dos logs
- Screenshot da aba Network
- Mensagem de erro (se houver)

---

## 📝 **Logs Adicionados**

Adicionei **logs detalhados** em cada etapa:

```typescript
// Ao clicar
console.log('🔄 Toggle status chamado para curso:', curso);
console.log('📊 Status atual:', curso.ativo);
console.log('🎯 Novo status será:', novoStatus);

// Após diálogo
console.log('💬 Resultado do diálogo:', result);
console.log('✅ Confirmado! Executando atualização...');

// Chamando API
console.log('📡 Chamando API para atualizar status...');
console.log('📋 Dados:', { cursoId, novoStatus });

// Resposta
console.log('✅ Resposta da API:', response);
console.log('🔄 Recarregando lista de cursos...');

// Erro
console.error('❌ Erro ao atualizar status do curso:', error);
console.error('📊 Detalhes do erro:', error.error);
console.error('🔢 Status HTTP:', error.status);
```

Esses logs vão ajudar a identificar **exatamente** onde está o problema! 🔍

---

**Reinicie o servidor, teste novamente e me diga o que aparece no console!** 🚀



