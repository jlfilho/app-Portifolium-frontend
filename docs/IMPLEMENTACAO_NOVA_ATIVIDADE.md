# ➕ Implementação: Criar Nova Atividade

## ✅ **FUNCIONALIDADE COMPLETA IMPLEMENTADA**

---

## 📋 **Resumo**

Foi implementada a funcionalidade completa de **criar nova atividade** reutilizando o formulário de edição existente, com detecção automática de modo (criar/editar).

---

## 🎯 **Funcionalidades Implementadas**

### **1. Rota de Criação:**
```typescript
{
  path: 'atividades/nova/:cursoId',
  component: FormAtividadeComponent,
  title: 'Nova Atividade'
}
```

**URL:** `/atividades/nova/1` (onde 1 é o ID do curso)

---

### **2. Detecção de Modo:**

```typescript
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  const cursoIdParam = this.route.snapshot.paramMap.get('cursoId');
  
  if (id) {
    // Modo EDIÇÃO
    this.isEditMode = true;
    this.atividadeId = Number(id);
  } else if (cursoIdParam) {
    // Modo CRIAÇÃO
    this.isEditMode = false;
    this.cursoId = Number(cursoIdParam);
  }
}
```

---

### **3. Serviço de Criação:**

```typescript
createAtividade(atividade: AtividadeCreateDTO): Observable<AtividadeDTO> {
  const url = this.baseUrl;  // POST /api/atividades
  return this.http.post<AtividadeDTO>(url, atividade).pipe(
    timeout(30000),
    tap(response => console.log('✅ Atividade criada:', response)),
    catchError(error => { /* logs */ throw error; })
  );
}
```

---

### **4. Método de Salvamento Diferenciado:**

```typescript
onSubmit(): void {
  if (this.atividadeForm.valid) {
    if (this.isEditMode) {
      this.updateAtividade(formData);   // PUT /api/atividades/{id}
    } else {
      this.createNovaAtividade(formData); // POST /api/atividades
    }
  }
}
```

---

### **5. Botão "Nova Atividade" na Lista:**

```html
<button mat-raised-button color="primary" (click)="novaAtividade()">
  <mat-icon>add_circle</mat-icon>
  Nova Atividade
</button>
```

**Visual:** Botão branco no header azul

---

## 📊 **Fluxo de Criação**

### **Passo a Passo:**

```
1. Usuário está na lista de atividades do curso
   ↓
2. Clica em "Nova Atividade"
   ↓
3. Sistema navega para /atividades/nova/{cursoId}
   ↓
4. Formulário abre em modo CRIAÇÃO
   - Título: "➕ Nova Atividade"
   - Campo "Curso": readonly com nome do curso
   - Campos vazios para preencher
   ↓
5. Usuário preenche:
   - Nome da atividade
   - Objetivo, público alvo
   - Coordenador (dropdown)
   - Data de realização
   - Categoria
   - Fontes financiadoras (opcional)
   - Outros integrantes (opcional)
   ↓
6. Clica em "Salvar"
   ↓
7. Sistema cria AtividadeCreateDTO:
   {
     nome, objetivo, publicoAlvo,
     statusPublicacao, coordenador, dataRealizacao,
     cursoId,  ← Fixo do parâmetro da rota
     categoriaId,
     fontesFinanciadoraIds,
     integrantesIds
   }
   ↓
8. POST /api/atividades
   ↓
9. ✅ Sucesso → Redireciona para lista
   ❌ Erro → Mostra mensagem
```

---

## 🎨 **Diferenças Visuais**

### **Modo CRIAÇÃO:**
```
┌─────────────────────────────────────┐
│ ➕ Nova Atividade                   │
├─────────────────────────────────────┤
│ Nome: [___________________________] │
│ Curso: [Curso de Engenharia______] │ ← Readonly
│ Categoria: [▼ Selecione __________] │
│ Coordenador: [▼ Selecione ________] │
│ ...                                 │
│                   [← Voltar] [Salvar]│
└─────────────────────────────────────┘
```

### **Modo EDIÇÃO:**
```
┌─────────────────────────────────────┐
│ ✏️ Editar Atividade                 │
│ Atividade 1 Engenharia              │ ← Subtitle
├─────────────────────────────────────┤
│ Nome: [Atividade 1 Engenharia____] │
│ Curso: [Curso de Engenharia______] │ ← Readonly
│ Categoria: [Extensão ▼___________] │
│ Coordenador: [João Silva ▼_______] │
│ ...                                 │
│                   [← Voltar] [Salvar]│
└─────────────────────────────────────┘
```

---

## 📝 **JSON Enviado**

### **Criar (POST):**
```json
{
  "nome": "Workshop de Inteligência Artificial",
  "objetivo": "Ensinar conceitos de IA",
  "publicoAlvo": "Estudantes de computação",
  "statusPublicacao": false,
  "coordenador": "João Silva",
  "dataRealizacao": "2024-03-15",
  "cursoId": 1,
  "categoriaId": 2,
  "fontesFinanciadoraIds": [1, 3],
  "integrantesIds": [3, 5, 7]
}
```

### **Editar (PUT):**
```json
{
  "id": 1,
  "nome": "Workshop de IA - Atualizado",
  "objetivo": "...",
  "curso": {
    "id": 1,
    "nome": "Curso de Engenharia de Software",
    "ativo": true
  },
  "fontesFinanciadora": [
    { "id": 1, "nome": "CNPq" }
  ],
  "integrantes": [
    { "id": 3, "nome": "João", "cpf": "123", "papel": "COORDENADOR" }
  ]
}
```

---

## 🔧 **Validações**

### **Modo CRIAÇÃO:**
- ✅ Todos os campos obrigatórios devem ser preenchidos
- ✅ Coordenador é obrigatório
- ✅ Categoria é obrigatória
- ✅ Data é obrigatória
- ✅ Nome mínimo 3 caracteres

### **Modo EDIÇÃO:**
- ✅ Mesmas validações
- ✅ Curso não pode ser alterado
- ✅ Coordenador não pode ser removido

---

## 📂 **Arquivos Modificados**

| Arquivo | Alteração | Descrição |
|---------|-----------|-----------|
| `atividades.routes.ts` | +5 linhas | Nova rota `/atividades/nova/:cursoId` |
| `atividades.service.ts` | +24 linhas | Método `createAtividade()` |
| `form-atividade.component.ts` | +80 linhas | Detecção de modo, método criar |
| `form-atividade.component.html` | Modificado | Título dinâmico, hint do curso |
| `lista-atividades.component.ts` | +10 linhas | Método `novaAtividade()` |
| `lista-atividades.component.html` | +12 linhas | Botão "Nova Atividade" |
| `lista-atividades.component.css` | +20 linhas | Estilos do botão |

**Total:** ~151 linhas

---

## ✨ **Recursos Especiais**

### **1. Reutilização de Código:**
- ✅ Mesmo formulário para criar e editar
- ✅ Mesmas validações
- ✅ Mesmas seções (fontes, integrantes, upload)

### **2. Curso Fixo:**
- ✅ Definido pela rota `/atividades/nova/:cursoId`
- ✅ Nome buscado automaticamente
- ✅ Exibido como readonly
- ✅ Impossível alterar

### **3. Navegação Inteligente:**
- ✅ De lista → criação: passa cursoId e cursoNome
- ✅ Após criar: volta para lista do curso
- ✅ Após editar: permanece no formulário

---

## 🎯 **Como Usar**

### **Criar Nova Atividade:**

1. **Navegue** para lista de atividades de um curso
2. **Clique** em "Nova Atividade" (botão branco no header)
3. **Preencha** os campos:
   - Nome
   - Objetivo, público alvo
   - **Coordenador** (dropdown obrigatório)
   - Data de realização
   - Categoria
4. **Opcional:** Adicione fontes e integrantes
5. **Clique** em "Salvar"
6. **✅ Sucesso:** Volta para lista com nova atividade

---

## 📊 **Exemplo Completo**

### **Criar "Workshop de IA":**

```typescript
// Campos preenchidos:
nome: "Workshop de Inteligência Artificial"
objetivo: "Ensinar conceitos básicos de IA"
publicoAlvo: "Estudantes de graduação"
coordenador: "João Silva" (ID: 3)  ← Adiciona como COORDENADOR
dataRealizacao: "15/03/2024"
cursoId: 1  ← Fixo (Engenharia de Software)
categoriaId: 2 (Extensão)
fontesFinanciadoraIds: [1, 3]  ← CNPq, FAPEAM
integrantesIds: [3, 5, 7]  ← João (COORD), Maria (BOLSISTA), Pedro (VOLUNTARIO)

// JSON enviado:
POST /api/atividades
{
  "nome": "Workshop de Inteligência Artificial",
  "objetivo": "Ensinar conceitos básicos de IA",
  "publicoAlvo": "Estudantes de graduação",
  "statusPublicacao": false,
  "coordenador": "João Silva",
  "dataRealizacao": "2024-03-15",
  "cursoId": 1,
  "categoriaId": 2,
  "fontesFinanciadoraIds": [1, 3],
  "integrantesIds": [3, 5, 7]
}

// Response (201 Created):
{
  "id": 6,  ← ID gerado pelo backend
  "nome": "Workshop de Inteligência Artificial",
  ...
}
```

---

## ✅ **Checklist de Funcionalidades**

- ✅ Rota `/atividades/nova/:cursoId` criada
- ✅ Detecção de modo (criar/editar)
- ✅ Título dinâmico (Nova/Editar)
- ✅ Campo curso fixo e readonly
- ✅ Método `createAtividade()` no serviço
- ✅ Método `createNovaAtividade()` no componente
- ✅ Botão "Nova Atividade" na lista
- ✅ Navegação após criar
- ✅ Logs detalhados
- ✅ Tratamento de erros
- ✅ Validações ativas
- ✅ Integração com fontes e integrantes

---

## 🚀 **Status: PRONTO PARA USO**

A funcionalidade está **completa e pronta** para criar novas atividades!

**Para testar:**
1. Acesse lista de atividades de um curso
2. Clique em "Nova Atividade"
3. Preencha o formulário
4. Adicione coordenador, fontes e integrantes
5. Salve
6. Verifique que foi criada na lista!

---

**Data:** 2024  
**Funcionalidade:** Criar Nova Atividade  
**Status:** ✅ **COMPLETO E FUNCIONAL**

---

**🎉 CRIAÇÃO DE ATIVIDADES IMPLEMENTADA! 🎉**

