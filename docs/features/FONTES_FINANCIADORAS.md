# 💰 Fontes Financiadoras Module

Módulo para gerenciamento de fontes financiadoras no sistema AcadManage.

## 📁 Estrutura

```
fontes-financiadoras/
├── services/
│   ├── fontes-financiadoras.service.ts       # Serviço principal
│   └── fontes-financiadoras.service.spec.ts  # Testes
├── fontes-financiadoras.module.ts            # Módulo Angular
├── index.ts                                  # Exportações
└── README.md                                 # Documentação
```

## 🔌 API Endpoints

### 1. Listar Todas as Fontes Financiadoras
```typescript
GET /api/fontes-financiadoras
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "CNPq"
  },
  {
    "id": 2,
    "nome": "FAPEAM"
  }
]
```

**Uso:**
```typescript
this.fontesService.listarTodas().subscribe(fontes => {
  console.log('Fontes:', fontes);
});
```

---

### 2. Recuperar Fonte por ID
```typescript
GET /api/fontes-financiadoras/{id}
```

**Response:**
```json
{
  "id": 1,
  "nome": "CNPq"
}
```

**Uso:**
```typescript
this.fontesService.recuperarPorId(1).subscribe(fonte => {
  console.log('Fonte:', fonte);
});
```

---

### 3. Criar Nova Fonte Financiadora
```typescript
POST /api/fontes-financiadoras
```

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

**Request Body:**
```json
{
  "nome": "Nova Fonte"
}
```

**Response:**
```json
{
  "id": 3,
  "nome": "Nova Fonte"
}
```

**Uso:**
```typescript
const novaFonte = { nome: 'Nova Fonte' };
this.fontesService.salvar(novaFonte).subscribe(fonte => {
  console.log('Fonte criada:', fonte);
});
```

---

### 4. Atualizar Fonte Financiadora
```typescript
PUT /api/fontes-financiadoras/{id}
```

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

**Request Body:**
```json
{
  "nome": "Fonte Atualizada"
}
```

**Response:**
```json
{
  "id": 1,
  "nome": "Fonte Atualizada"
}
```

**Uso:**
```typescript
const updateData = { nome: 'Fonte Atualizada' };
this.fontesService.atualizar(1, updateData).subscribe(fonte => {
  console.log('Fonte atualizada:', fonte);
});
```

---

### 5. Deletar Fonte Financiadora
```typescript
DELETE /api/fontes-financiadoras/{id}
```

**Permissões:** `ADMINISTRADOR`

**Response:** `204 No Content`

**Uso:**
```typescript
this.fontesService.deletar(1).subscribe(() => {
  console.log('Fonte deletada com sucesso');
});
```

---

## 📦 Interfaces TypeScript

### FonteFinanciadoraDTO
```typescript
interface FonteFinanciadoraDTO {
  id?: number;
  nome: string;
}
```

### FonteFinanciadoraCreateDTO
```typescript
interface FonteFinanciadoraCreateDTO {
  nome: string;
}
```

### FonteFinanciadoraUpdateDTO
```typescript
interface FonteFinanciadoraUpdateDTO {
  nome: string;
}
```

---

## 🔧 Como Usar

### 1. Importar o Serviço
```typescript
import { FontesFinanciadorasService } from '@features/fontes-financiadoras';
```

### 2. Injetar no Componente
```typescript
constructor(private fontesService: FontesFinanciadorasService) {}
```

### 3. Usar os Métodos
```typescript
// Listar todas
this.fontesService.listarTodas().subscribe({
  next: (fontes) => {
    this.fontes = fontes;
  },
  error: (error) => {
    console.error('Erro ao carregar fontes:', error);
  }
});

// Criar nova
const novaFonte = { nome: 'CNPq' };
this.fontesService.salvar(novaFonte).subscribe({
  next: (fonte) => {
    console.log('Fonte criada:', fonte);
  },
  error: (error) => {
    console.error('Erro ao criar fonte:', error);
  }
});

// Atualizar
const updateData = { nome: 'CNPq - Atualizado' };
this.fontesService.atualizar(1, updateData).subscribe({
  next: (fonte) => {
    console.log('Fonte atualizada:', fonte);
  },
  error: (error) => {
    console.error('Erro ao atualizar fonte:', error);
  }
});

// Deletar
this.fontesService.deletar(1).subscribe({
  next: () => {
    console.log('Fonte deletada');
  },
  error: (error) => {
    console.error('Erro ao deletar fonte:', error);
  }
});
```

---

## 🧪 Testes

### Executar Testes
```bash
ng test --include='**/fontes-financiadoras.service.spec.ts'
```

### Cobertura
- ✅ Listar todas as fontes
- ✅ Recuperar por ID
- ✅ Criar nova fonte
- ✅ Atualizar fonte
- ✅ Deletar fonte
- ✅ Tratamento de erros

---

## 🔒 Permissões

| Endpoint | ADMINISTRADOR | GERENTE | SECRETARIO | Outros |
|----------|---------------|---------|------------|--------|
| GET (todos) | ✅ | ✅ | ✅ | ✅ |
| GET (por ID) | ✅ | ✅ | ✅ | ✅ |
| POST | ✅ | ✅ | ✅ | ❌ |
| PUT | ✅ | ✅ | ✅ | ❌ |
| DELETE | ✅ | ❌ | ❌ | ❌ |

---

## 📝 Exemplo Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { FontesFinanciadorasService, FonteFinanciadoraDTO } from '@features/fontes-financiadoras';

@Component({
  selector: 'app-fontes-financiadoras',
  templateUrl: './fontes-financiadoras.component.html'
})
export class FontesFinanciadorasComponent implements OnInit {
  fontes: FonteFinanciadoraDTO[] = [];
  isLoading = false;

  constructor(private fontesService: FontesFinanciadorasService) {}

  ngOnInit(): void {
    this.loadFontes();
  }

  loadFontes(): void {
    this.isLoading = true;
    this.fontesService.listarTodas().subscribe({
      next: (fontes) => {
        this.fontes = fontes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar fontes:', error);
        this.isLoading = false;
      }
    });
  }

  criarFonte(nome: string): void {
    const novaFonte = { nome };
    this.fontesService.salvar(novaFonte).subscribe({
      next: (fonte) => {
        console.log('Fonte criada:', fonte);
        this.loadFontes(); // Recarregar lista
      },
      error: (error) => {
        console.error('Erro ao criar fonte:', error);
      }
    });
  }

  atualizarFonte(id: number, nome: string): void {
    const updateData = { nome };
    this.fontesService.atualizar(id, updateData).subscribe({
      next: (fonte) => {
        console.log('Fonte atualizada:', fonte);
        this.loadFontes(); // Recarregar lista
      },
      error: (error) => {
        console.error('Erro ao atualizar fonte:', error);
      }
    });
  }

  deletarFonte(id: number): void {
    if (confirm('Tem certeza que deseja deletar esta fonte?')) {
      this.fontesService.deletar(id).subscribe({
        next: () => {
          console.log('Fonte deletada');
          this.loadFontes(); // Recarregar lista
        },
        error: (error) => {
          console.error('Erro ao deletar fonte:', error);
        }
      });
    }
  }
}
```

---

## 🐛 Tratamento de Erros

Todos os métodos incluem tratamento de erros detalhado:

```typescript
catchError((error: HttpErrorResponse) => {
  console.error('❌ Erro ao [operação]:', error);
  console.error('❌ Status:', error?.status);
  console.error('❌ Message:', error?.message);
  console.error('❌ Error body:', error?.error);
  throw error;
})
```

### Códigos de Status Comuns

- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `204 No Content` - Sucesso sem conteúdo
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

---

## 📚 Referências

- [Angular HttpClient](https://angular.io/guide/http)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Spring Boot REST](https://spring.io/guides/gs/rest-service/)

---

## ✅ Status

**Implementação:** ✅ Completa  
**Testes:** ✅ Implementados  
**Documentação:** ✅ Completa  
**Permissões:** ✅ Configuradas

