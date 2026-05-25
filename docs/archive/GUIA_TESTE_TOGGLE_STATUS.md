# ✅ Guia de Teste - Toggle de Status do Curso

## 📋 Funcionalidade Implementada

A funcionalidade de **ativar/desativar curso** já está **100% implementada**! 🎉

---

## 🔧 **Componentes Implementados**

### **✅ 1. Serviço (cursos.service.ts)**
```typescript
updateCourseStatus(id: number, ativo: boolean): Observable<any> {
  return this.http.put(`${this.baseUrl}/cursos/${id}/status`, { ativo });
}
```
**Endpoint:** `PUT /api/cursos/{cursoId}/status`

---

### **✅ 2. Componente (cards-cursos.component.ts)**
```typescript
toggleCourseStatus(curso: any): void {
  // Abre diálogo de confirmação
  // Se confirmado, chama performStatusUpdate()
}

private performStatusUpdate(cursoId, cursoNome, novoStatus): void {
  this.cursosService.updateCourseStatus(cursoId, novoStatus).subscribe({
    next: () => {
      this.showMessage('Curso atualizado!', 'success');
      this.loadCourses();
    }
  });
}
```

---

### **✅ 3. Template (cards-cursos.component.html)**
```html
<button
  mat-icon-button
  [matTooltip]="curso.ativo ? 'Desativar curso' : 'Ativar curso'"
  [class.status-active]="curso.ativo"
  [class.status-inactive]="!curso.ativo"
  (click)="toggleCourseStatus(curso); $event.stopPropagation()">
  <mat-icon>{{ curso.ativo ? 'visibility' : 'visibility_off' }}</mat-icon>
</button>
```

---

### **✅ 4. Estilos (cards-cursos.component.css)**
```css
/* Botão verde quando ativo */
.status-active {
  color: #10B981 !important;
  background-color: rgba(16, 185, 129, 0.1) !important;
}

/* Botão cinza quando inativo */
.status-inactive {
  color: #475569 !important;
  background-color: rgba(100, 116, 139, 0.1) !important;
}

/* Card apagado quando inativo */
.card-inactive {
  opacity: 0.6;
  filter: grayscale(30%);
}
```

---

## 🧪 **Como Testar**

### **Pré-requisitos:**
1. ✅ Backend rodando (`http://localhost:8080`)
2. ✅ Frontend rodando (`npm start`)
3. ✅ Logado como **ADMINISTRADOR**
4. ✅ Pelo menos 1 curso cadastrado

---

### **Teste 1: Desativar Curso Ativo**

**Passo a Passo:**
```
1. Vá para /cursos
2. Localize um curso com ícone 👁️ verde
3. Clique no botão verde
4. Verifique:
   ✅ Diálogo abre: "Desativar Curso"
   ✅ Mensagem: "Tem certeza que deseja desativar o curso [nome]?"
   ✅ Botão: "Sim, Desativar"
   ✅ Tipo: warning (laranja)
5. Clique em "Sim, Desativar"
6. Aguarde...
7. Verifique:
   ✅ Snackbar verde: "Curso desativado com sucesso!"
   ✅ Ícone muda para 👁️‍🗨️ cinza
   ✅ Card fica apagado (60% opacidade)
   ✅ Imagem fica em tons de cinza
```

---

### **Teste 2: Ativar Curso Inativo**

**Passo a Passo:**
```
1. Vá para /cursos
2. Localize um curso com ícone 👁️‍🗨️ cinza
3. Clique no botão cinza
4. Verifique:
   ✅ Diálogo abre: "Ativar Curso"
   ✅ Mensagem: "Tem certeza que deseja ativar o curso [nome]?"
   ✅ Botão: "Sim, Ativar"
   ✅ Tipo: info (azul)
5. Clique em "Sim, Ativar"
6. Aguarde...
7. Verifique:
   ✅ Snackbar verde: "Curso ativado com sucesso!"
   ✅ Ícone muda para 👁️ verde
   ✅ Card volta a ficar vibrante (100% opacidade)
   ✅ Imagem volta colorida
```

---

### **Teste 3: Cancelar Ação**

**Passo a Passo:**
```
1. Clique em qualquer botão de status
2. Diálogo abre
3. Clique em "Cancelar"
4. Verifique:
   ✅ Diálogo fecha
   ✅ NADA acontece
   ✅ Status permanece inalterado
   ✅ Nenhum request na aba Network
```

---

## 🔍 **Abrir Console para Logs**

### **F12 no Navegador:**

#### **Aba Console - Deve mostrar:**
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

#### **Aba Network - Deve mostrar:**
```
PUT http://localhost:8080/api/cursos/1/status
Status: 200 OK
Response: { "id": 1, "nome": "...", "ativo": false }
```

---

## ⚠️ **Problemas Comuns**

### **1. Erro 403 (Forbidden)**
```
❌ Erro: 403 Forbidden
📊 Detalhes: "Access Denied"
```

**Solução:**
- Faça login como **ADMINISTRADOR**
- Ou crie um usuário ADMINISTRADOR no backend

---

### **2. Erro 404 (Not Found)**
```
❌ Erro: 404 Not Found
📊 Detalhes: "Endpoint not found"
```

**Solução:**
- Verifique se backend tem endpoint `PUT /cursos/{id}/status`
- Verifique se backend está rodando

---

### **3. Nada Acontece ao Clicar**

**Solução:**
- Verifique se há erros no console
- Reinicie o servidor Angular
- Limpe cache do navegador (Ctrl+Shift+Del)

---

## 🎉 **Resumo**

**A funcionalidade ESTÁ implementada e inclui:**

✅ **Método no serviço** (`updateCourseStatus`)  
✅ **Lógica no componente** (`toggleCourseStatus`)  
✅ **Botão dinâmico** no template  
✅ **Estilos visuais** (verde/cinza)  
✅ **Card apagado** quando inativo  
✅ **Diálogo de confirmação**  
✅ **Mensagens de feedback**  
✅ **Logs detalhados** para debug  
✅ **Tratamento de erros**  

**Tudo pronto para usar! Teste seguindo os passos acima.** 🚀✨

---

## 📞 **Próximos Passos**

1. 🔄 **Reinicie o servidor** (`npm start`)
2. 🔐 **Faça login como ADMINISTRADOR**
3. 🧪 **Teste** clicando no botão de status
4. 👀 **Abra o console** (F12) para ver os logs
5. 📸 **Me envie screenshot** se houver erro

**Estou aqui para ajudar se encontrar algum problema!** 💪



