# 👥 Implementação: Serviços de Gerenciamento de Pessoas em Atividades

## ✅ **IMPLEMENTAÇÃO COMPLETA**

---

## 📋 **Resumo**

Foram implementados **4 métodos** no `AtividadesService` para gerenciar a associação de pessoas (integrantes) com atividades, incluindo:

1. ✅ **Associar pessoa** à atividade
2. ✅ **Alterar papel** da pessoa
3. ✅ **Listar pessoas** da atividade
4. ✅ **Remover pessoa** da atividade

---

## 🔌 **Endpoints Implementados**

### **1. Associar Pessoa à Atividade**

**Endpoint:**
```
POST /api/atividades-pessoas/{atividadeId}/pessoas/{pessoaId}?papel={papel}
```

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

**Método TypeScript:**
```typescript
associarPessoa(atividadeId: number, pessoaId: number, papel: string): Observable<any>
```

**Uso:**
```typescript
this.atividadesService.associarPessoa(1, 5, 'BOLSISTA').subscribe({
  next: (associacao) => {
    console.log('Pessoa associada:', associacao);
  },
  error: (error) => {
    console.error('Erro ao associar:', error);
  }
});
```

**Request:**
```http
POST /api/atividades-pessoas/1/pessoas/5?papel=BOLSISTA
```

**Response (201 Created):**
```json
{
  "atividadeId": 1,
  "pessoaId": 5,
  "papel": "BOLSISTA",
  "dataAssociacao": "2024-01-15"
}
```

---

### **2. Alterar Papel da Pessoa**

**Endpoint:**
```
PUT /api/atividades-pessoas/{atividadeId}/pessoas/{pessoaId}?novoPapel={novoPapel}
```

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

**Método TypeScript:**
```typescript
alterarPapelPessoa(atividadeId: number, pessoaId: number, novoPapel: string): Observable<any>
```

**Uso:**
```typescript
this.atividadesService.alterarPapelPessoa(1, 5, 'COORDENADOR').subscribe({
  next: (associacao) => {
    console.log('Papel alterado:', associacao);
  },
  error: (error) => {
    console.error('Erro ao alterar papel:', error);
  }
});
```

**Request:**
```http
PUT /api/atividades-pessoas/1/pessoas/5?novoPapel=COORDENADOR
```

**Response (200 OK):**
```json
{
  "atividadeId": 1,
  "pessoaId": 5,
  "papel": "COORDENADOR",
  "dataAlteracao": "2024-01-20"
}
```

---

### **3. Listar Pessoas da Atividade**

**Endpoint:**
```
GET /api/atividades-pessoas/{atividadeId}/pessoas
```

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

**Método TypeScript:**
```typescript
listarPessoasPorAtividade(atividadeId: number): Observable<any[]>
```

**Uso:**
```typescript
this.atividadesService.listarPessoasPorAtividade(1).subscribe({
  next: (pessoas) => {
    console.log('Pessoas:', pessoas);
    this.integrantes = pessoas;
  },
  error: (error) => {
    console.error('Erro ao listar:', error);
  }
});
```

**Request:**
```http
GET /api/atividades-pessoas/1/pessoas
```

**Response (200 OK):**
```json
[
  {
    "atividadeId": 1,
    "pessoaId": 3,
    "pessoa": {
      "id": 3,
      "nome": "Carlos Souza",
      "cpf": "34567890123"
    },
    "papel": "COORDENADOR"
  },
  {
    "atividadeId": 1,
    "pessoaId": 5,
    "pessoa": {
      "id": 5,
      "nome": "Pedro Henrique",
      "cpf": "56789012345"
    },
    "papel": "BOLSISTA"
  }
]
```

---

### **4. Remover Pessoa da Atividade**

**Endpoint:**
```
DELETE /api/atividades-pessoas/{atividadeId}/pessoas/{pessoaId}
```

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

**Método TypeScript:**
```typescript
removerPessoaDaAtividade(atividadeId: number, pessoaId: number): Observable<void>
```

**Uso:**
```typescript
this.atividadesService.removerPessoaDaAtividade(1, 5).subscribe({
  next: () => {
    console.log('Pessoa removida com sucesso');
  },
  error: (error) => {
    console.error('Erro ao remover:', error);
  }
});
```

**Request:**
```http
DELETE /api/atividades-pessoas/1/pessoas/5
```

**Response (204 No Content):**
```
(Sem corpo de resposta)
```

---

## 📊 **Papéis Disponíveis**

Baseado no enum `Papel` do backend:

```java
public enum Papel {
    COORDENADOR,
    SUBCOORDENADOR,
    BOLSISTA,
    VOLUNTARIO,
    PARTICIPANTE
}
```

**TypeScript Equivalente (Implementado):**
```typescript
export enum Papel {
  COORDENADOR = 'COORDENADOR',
  SUBCOORDENADOR = 'SUBCOORDENADOR',
  BOLSISTA = 'BOLSISTA',
  VOLUNTARIO = 'VOLUNTARIO',
  PARTICIPANTE = 'PARTICIPANTE'
}
```

**Arquivo:** `src/app/features/atividades/models/papel.enum.ts`

---

## 🔧 **Características da Implementação**

### **✅ Padrão Consistente:**

Todos os métodos seguem o mesmo padrão:

1. ✅ URL construída corretamente
2. ✅ Timeout de 30 segundos
3. ✅ Logs detalhados (início, sucesso, erro)
4. ✅ Tratamento de erros com `HttpErrorResponse`
5. ✅ Operadores RxJS (`tap`, `catchError`, `timeout`)

### **✅ Logs Detalhados:**

**Sucesso:**
```
📡 Associando pessoa à atividade: http://localhost:8080/api/atividades-pessoas/1/pessoas/5
📋 Papel: BOLSISTA
✅ Pessoa associada com sucesso: { ... }
```

**Erro:**
```
❌ Erro ao associar pessoa: HttpErrorResponse
❌ Status: 403
❌ Message: Forbidden
❌ Error body: { "message": "Sem permissão" }
```

---

## 📝 **Exemplo de Uso Completo**

### **Componente de Gerenciamento de Integrantes:**

```typescript
import { Component, OnInit } from '@angular/core';
import { AtividadesService } from '../../services/atividades.service';

@Component({
  selector: 'app-gerenciar-integrantes',
  template: `...`
})
export class GerenciarIntegrantesComponent implements OnInit {
  atividadeId = 1;
  integrantes: any[] = [];
  pessoaSelecionada: number | null = null;
  papelSelecionado = 'BOLSISTA';

  constructor(private atividadesService: AtividadesService) {}

  ngOnInit(): void {
    this.carregarIntegrantes();
  }

  carregarIntegrantes(): void {
    this.atividadesService.listarPessoasPorAtividade(this.atividadeId).subscribe({
      next: (pessoas) => {
        this.integrantes = pessoas;
        console.log('Integrantes carregados:', pessoas);
      },
      error: (error) => {
        console.error('Erro ao carregar integrantes:', error);
      }
    });
  }

  adicionarIntegrante(): void {
    if (!this.pessoaSelecionada) return;

    this.atividadesService.associarPessoa(
      this.atividadeId,
      this.pessoaSelecionada,
      this.papelSelecionado
    ).subscribe({
      next: (associacao) => {
        console.log('Integrante adicionado:', associacao);
        this.carregarIntegrantes(); // Recarregar lista
      },
      error: (error) => {
        console.error('Erro ao adicionar:', error);
      }
    });
  }

  alterarPapel(pessoaId: number, novoPapel: string): void {
    this.atividadesService.alterarPapelPessoa(
      this.atividadeId,
      pessoaId,
      novoPapel
    ).subscribe({
      next: (associacao) => {
        console.log('Papel alterado:', associacao);
        this.carregarIntegrantes(); // Recarregar lista
      },
      error: (error) => {
        console.error('Erro ao alterar papel:', error);
      }
    });
  }

  removerIntegrante(pessoaId: number): void {
    this.atividadesService.removerPessoaDaAtividade(
      this.atividadeId,
      pessoaId
    ).subscribe({
      next: () => {
        console.log('Integrante removido');
        this.carregarIntegrantes(); // Recarregar lista
      },
      error: (error) => {
        console.error('Erro ao remover:', error);
      }
    });
  }
}
```

---

## 🔒 **Permissões**

| Método | ADMINISTRADOR | GERENTE | SECRETARIO | Outros |
|--------|---------------|---------|------------|--------|
| **associarPessoa** | ✅ | ✅ | ✅ | ❌ |
| **alterarPapelPessoa** | ✅ | ✅ | ✅ | ❌ |
| **listarPessoasPorAtividade** | ✅ | ✅ | ✅ | ❌ |
| **removerPessoaDaAtividade** | ✅ | ✅ | ✅ | ❌ |

**Nota:** As permissões são validadas no backend com `@PreAuthorize`

---

## 📊 **Fluxo de Trabalho**

### **Adicionar Integrante:**
```
1. Listar pessoas disponíveis
   ↓
2. Selecionar pessoa e papel
   ↓
3. Chamar associarPessoa()
   ↓
4. Backend valida permissões
   ↓
5. Pessoa é associada
   ↓
6. Recarregar lista de integrantes
```

### **Alterar Papel:**
```
1. Usuário seleciona novo papel
   ↓
2. Chamar alterarPapelPessoa()
   ↓
3. Backend atualiza o papel
   ↓
4. Recarregar lista
```

### **Remover Integrante:**
```
1. Usuário clica em remover
   ↓
2. Confirmar ação
   ↓
3. Chamar removerPessoaDaAtividade()
   ↓
4. Backend remove associação
   ↓
5. Recarregar lista
```

---

## 🎯 **Benefícios**

### **API Completa:**
- ✅ CRUD completo de integrantes
- ✅ Gerenciamento de papéis
- ✅ Listagem dedicada por atividade

### **Tratamento Robusto:**
- ✅ Timeout em todas as requisições
- ✅ Logs detalhados para debug
- ✅ Tratamento de erros HTTP
- ✅ Tipagem TypeScript

### **Integração Fácil:**
- ✅ Métodos prontos para uso
- ✅ Observable pattern
- ✅ Documentação inline

---

## 📝 **Interface PessoaPapelDTO**

**Java Record:**
```java
public record PessoaPapelDTO(
    Long id, 
    String nome, 
    String cpf, 
    String papel
) {}
```

**TypeScript (já existe em atividade.model.ts):**
```typescript
export interface PessoaPapelDTO {
  id: number;
  nome: string;
  cpf: string;
  papel: string;
}
```

---

## 🔧 **Recursos Técnicos**

### **1. Query Parameters:**
```typescript
const params = new HttpParams().set('papel', papel);
this.http.post(url, null, { params })
```

### **2. Timeout:**
```typescript
.pipe(timeout(30000))  // 30 segundos
```

### **3. Logs Estruturados:**
```typescript
console.log('📡 Operação:', url);
console.log('✅ Sucesso:', response);
console.error('❌ Erro:', error);
```

### **4. Tratamento de Erros:**
```typescript
catchError((error: HttpErrorResponse) => {
  console.error('❌ Detalhes:', {
    status: error.status,
    message: error.message,
    body: error.error
  });
  throw error;
})
```

---

## 📊 **Checklist de Implementação**

| Método | Endpoint | HTTP | Params | Permissões | Logs | Errors | Status |
|--------|----------|------|--------|------------|------|--------|--------|
| **associarPessoa** | `/atividades-pessoas/{id}/pessoas/{id}` | POST | papel | ✅ | ✅ | ✅ | ✅ |
| **alterarPapelPessoa** | `/atividades-pessoas/{id}/pessoas/{id}` | PUT | novoPapel | ✅ | ✅ | ✅ | ✅ |
| **listarPessoasPorAtividade** | `/atividades-pessoas/{id}/pessoas` | GET | - | ✅ | ✅ | ✅ | ✅ |
| **removerPessoaDaAtividade** | `/atividades-pessoas/{id}/pessoas/{id}` | DELETE | - | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 **Casos de Uso**

### **Caso 1: Adicionar Bolsista**
```typescript
// Adicionar Pedro como BOLSISTA na atividade 1
this.atividadesService.associarPessoa(1, 5, 'BOLSISTA').subscribe({
  next: (result) => {
    this.showMessage('Bolsista adicionado com sucesso!', 'success');
    this.recarregarIntegrantes();
  }
});
```

---

### **Caso 2: Promover para Coordenador**
```typescript
// Alterar papel de Pedro de BOLSISTA para COORDENADOR
this.atividadesService.alterarPapelPessoa(1, 5, 'COORDENADOR').subscribe({
  next: (result) => {
    this.showMessage('Papel atualizado para Coordenador!', 'success');
    this.recarregarIntegrantes();
  }
});
```

---

### **Caso 3: Listar Todos os Integrantes**
```typescript
// Carregar todos os integrantes da atividade
this.atividadesService.listarPessoasPorAtividade(1).subscribe({
  next: (pessoas) => {
    this.integrantes = pessoas;
    console.log(`Total de integrantes: ${pessoas.length}`);
  }
});
```

---

### **Caso 4: Remover Integrante**
```typescript
// Remover Pedro da atividade
this.atividadesService.removerPessoaDaAtividade(1, 5).subscribe({
  next: () => {
    this.showMessage('Integrante removido com sucesso!', 'success');
    this.recarregarIntegrantes();
  }
});
```

---

## 🔍 **Logs Esperados**

### **Ao Associar Pessoa:**
```
📡 Associando pessoa à atividade: http://localhost:8080/api/atividades-pessoas/1/pessoas/5
📋 Papel: BOLSISTA
✅ Pessoa associada com sucesso: { atividadeId: 1, pessoaId: 5, papel: "BOLSISTA" }
```

### **Ao Alterar Papel:**
```
📡 Alterando papel da pessoa: http://localhost:8080/api/atividades-pessoas/1/pessoas/5
📋 Novo papel: COORDENADOR
✅ Papel alterado com sucesso: { atividadeId: 1, pessoaId: 5, papel: "COORDENADOR" }
```

### **Ao Listar Pessoas:**
```
📡 Listando pessoas da atividade: http://localhost:8080/api/atividades-pessoas/1/pessoas
✅ Pessoas da atividade carregadas: [ { ... }, { ... } ]
```

### **Ao Remover Pessoa:**
```
📡 Removendo pessoa da atividade: http://localhost:8080/api/atividades-pessoas/1/pessoas/5
✅ Pessoa removida da atividade com sucesso
```

---

## 🚨 **Tratamento de Erros Comuns**

### **1. Erro 403 - Sem Permissão**
```
❌ Status: 403
❌ Message: Forbidden
❌ Error body: { "message": "Usuário sem permissão" }
```

**Solução:** Verificar se o usuário tem role ADMINISTRADOR, GERENTE ou SECRETARIO

---

### **2. Erro 404 - Atividade/Pessoa Não Encontrada**
```
❌ Status: 404
❌ Message: Not Found
❌ Error body: { "message": "Atividade não encontrada" }
```

**Solução:** Verificar se os IDs existem no banco

---

### **3. Erro 400 - Papel Inválido**
```
❌ Status: 400
❌ Message: Bad Request
❌ Error body: { "message": "Papel inválido" }
```

**Solução:** Usar apenas papéis válidos: COORDENADOR, BOLSISTA, VOLUNTARIO, COLABORADOR

---

### **4. Erro 409 - Pessoa Já Associada**
```
❌ Status: 409
❌ Message: Conflict
❌ Error body: { "message": "Pessoa já está associada a esta atividade" }
```

**Solução:** Verificar se a pessoa já está na lista antes de adicionar

---

## 📂 **Arquivo Modificado**

- ✅ `src/app/features/atividades/services/atividades.service.ts`
  - 4 novos métodos adicionados
  - ~105 linhas de código
  - Totalmente documentado

---

## ✅ **Status Final**

| Item | Status | Observação |
|------|--------|------------|
| **Métodos implementados** | ✅ | 4 métodos completos |
| **Endpoints corretos** | ✅ | Conforme controller |
| **Permissões** | ✅ | Documentadas |
| **Logs** | ✅ | Detalhados |
| **Tratamento de erros** | ✅ | Robusto |
| **Timeout** | ✅ | 30 segundos |
| **Documentação** | ✅ | Completa |

---

## 🎉 **IMPLEMENTAÇÃO COMPLETA E PRONTA PARA USO**

Os serviços de gerenciamento de pessoas em atividades estão **totalmente implementados** e prontos para serem utilizados nos componentes!

**Próximo Passo Sugerido:**
- Implementar interface visual no formulário de edição de atividades
- Similar ao gerenciamento de fontes financiadoras
- Permitir adicionar/remover integrantes com seus papéis

---

**Data:** 2024  
**Serviço:** `AtividadesService`  
**Métodos:** 4  
**Status:** ✅ **COMPLETO E FUNCIONAL**

