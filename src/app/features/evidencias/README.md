# 📸 Evidências - Feature Module

Módulo responsável pelo gerenciamento de evidências fotográficas de atividades.

## 📁 Estrutura

```
evidencias/
├── models/
│   └── evidencia.model.ts       # Interfaces e DTOs
├── services/
│   ├── evidencias.service.ts    # Serviço principal
│   └── evidencias.service.spec.ts # Testes unitários
├── evidencias.module.ts         # Módulo Angular
├── index.ts                     # Barrel exports
└── README.md                    # Esta documentação
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api/evidencias
```

### Endpoints Disponíveis

#### 1. **Listar Evidências por Atividade**
```typescript
GET /api/evidencias/atividade/{atividadeId}
```
**Resposta:** `EvidenciaDTO[]`
- **200 OK** - Lista de evidências
- **204 No Content** - Nenhuma evidência encontrada

---

#### 2. **Buscar Evidência por ID**
```typescript
GET /api/evidencias/{evidenciaId}
```
**Resposta:** `EvidenciaDTO`
- **200 OK** - Evidência encontrada
- **404 Not Found** - Evidência não encontrada

---

#### 3. **Salvar Nova Evidência**
```typescript
POST /api/evidencias
Content-Type: multipart/form-data
```
**Parâmetros:**
- `atividadeId`: Long (ID da atividade)
- `legenda`: String (Legenda da foto)
- `file`: MultipartFile (Arquivo de imagem)

**Resposta:** `EvidenciaDTO`
- **201 Created** - Evidência criada
- **400 Bad Request** - Dados inválidos
- **403 Forbidden** - Sem permissão

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

---

#### 4. **Atualizar Evidência**
```typescript
PUT /api/evidencias/{evidenciaId}
Content-Type: multipart/form-data
```
**Parâmetros:**
- `legenda`: String (Nova legenda)
- `file`: MultipartFile (Novo arquivo de imagem)

**Resposta:** `EvidenciaDTO`
- **200 OK** - Evidência atualizada
- **404 Not Found** - Evidência não encontrada
- **403 Forbidden** - Sem permissão

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

---

#### 5. **Excluir Evidência**
```typescript
DELETE /api/evidencias/{evidenciaId}
```
**Resposta:** `void`
- **204 No Content** - Evidência excluída
- **404 Not Found** - Evidência não encontrada
- **403 Forbidden** - Sem permissão

**Permissões:** `ADMINISTRADOR`, `GERENTE`, `SECRETARIO`

---

## 📦 Interfaces

### EvidenciaDTO
```typescript
interface EvidenciaDTO {
  id?: number;
  atividadeId: number;
  foto: string;          // Caminho da foto
  legenda: string;       // Legenda da evidência
  criadoPor?: string;    // Username do criador
}
```

### EvidenciaCreateDTO
```typescript
interface EvidenciaCreateDTO {
  atividadeId: number;
  legenda: string;
  file: File;
}
```

### EvidenciaUpdateDTO
```typescript
interface EvidenciaUpdateDTO {
  evidenciaId: number;
  legenda: string;
  file?: File;  // Opcional ao atualizar
}
```

---

## 🔧 Uso do Serviço

### Importar o Serviço

```typescript
import { EvidenciasService } from '@features/evidencias';
```

### Injetar no Componente

```typescript
constructor(private evidenciasService: EvidenciasService) {}
```

---

## 💡 Exemplos de Uso

### 1. **Listar Evidências de uma Atividade**

```typescript
listarEvidencias(atividadeId: number): void {
  this.evidenciasService.listarEvidenciasPorAtividade(atividadeId)
    .subscribe({
      next: (evidencias) => {
        console.log('Evidências:', evidencias);
        this.evidencias = evidencias;
      },
      error: (error) => {
        console.error('Erro ao carregar evidências:', error);
        this.showMessage(error.message, 'error');
      }
    });
}
```

---

### 2. **Buscar Evidência Específica**

```typescript
buscarEvidencia(evidenciaId: number): void {
  this.evidenciasService.getEvidenciasPorId(evidenciaId)
    .subscribe({
      next: (evidencia) => {
        console.log('Evidência:', evidencia);
        this.evidencia = evidencia;
      },
      error: (error) => {
        console.error('Erro ao buscar evidência:', error);
      }
    });
}
```

---

### 3. **Salvar Nova Evidência**

```typescript
salvarEvidencia(atividadeId: number, legenda: string, file: File): void {
  this.isSaving = true;

  this.evidenciasService.salvarEvidencia(atividadeId, legenda, file)
    .subscribe({
      next: (evidencia) => {
        console.log('Evidência salva:', evidencia);
        this.showMessage('Evidência salva com sucesso!', 'success');
        this.isSaving = false;
        this.recarregarEvidencias();
      },
      error: (error) => {
        console.error('Erro ao salvar evidência:', error);
        this.showMessage(error.message, 'error');
        this.isSaving = false;
      }
    });
}
```

---

### 4. **Atualizar Evidência**

```typescript
atualizarEvidencia(evidenciaId: number, legenda: string, file: File): void {
  this.isUpdating = true;

  this.evidenciasService.atualizarEvidencia(evidenciaId, legenda, file)
    .subscribe({
      next: (evidencia) => {
        console.log('Evidência atualizada:', evidencia);
        this.showMessage('Evidência atualizada com sucesso!', 'success');
        this.isUpdating = false;
        this.recarregarEvidencias();
      },
      error: (error) => {
        console.error('Erro ao atualizar evidência:', error);
        this.showMessage(error.message, 'error');
        this.isUpdating = false;
      }
    });
}
```

---

### 5. **Excluir Evidência**

```typescript
excluirEvidencia(evidenciaId: number): void {
  if (!confirm('Tem certeza que deseja excluir esta evidência?')) {
    return;
  }

  this.isDeleting = true;

  this.evidenciasService.excluirEvidencia(evidenciaId)
    .subscribe({
      next: () => {
        console.log('Evidência excluída');
        this.showMessage('Evidência excluída com sucesso!', 'success');
        this.isDeleting = false;
        this.recarregarEvidencias();
      },
      error: (error) => {
        console.error('Erro ao excluir evidência:', error);
        this.showMessage(error.message, 'error');
        this.isDeleting = false;
      }
    });
}
```

---

### 6. **Obter URL Completa da Imagem**

```typescript
getImageUrl(foto: string): string {
  return this.evidenciasService.getImageUrl(foto);
}
```

**No Template:**
```html
<img [src]="getImageUrl(evidencia.foto)" [alt]="evidencia.legenda">
```

---

## 📤 Upload de Arquivo

### Seleção de Arquivo

```html
<input 
  type="file" 
  accept="image/*"
  (change)="onFileSelected($event)"
  #fileInput>
```

```typescript
selectedFile: File | null = null;

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      this.showMessage('Por favor, selecione apenas imagens', 'error');
      return;
    }

    // Validar tamanho (ex: máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      this.showMessage('Imagem muito grande. Máximo 5MB', 'error');
      return;
    }

    this.selectedFile = file;
    console.log('Arquivo selecionado:', file.name);
  }
}
```

---

## 🎨 Exemplo de Componente Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvidenciasService, EvidenciaDTO } from '@features/evidencias';

@Component({
  selector: 'app-evidencias-atividade',
  templateUrl: './evidencias-atividade.component.html'
})
export class EvidenciasAtividadeComponent implements OnInit {
  atividadeId!: number;
  evidencias: EvidenciaDTO[] = [];
  selectedFile: File | null = null;
  legenda: string = '';
  isLoading = false;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private evidenciasService: EvidenciasService
  ) {}

  ngOnInit(): void {
    this.atividadeId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarEvidencias();
  }

  carregarEvidencias(): void {
    this.isLoading = true;
    this.evidenciasService.listarEvidenciasPorAtividade(this.atividadeId)
      .subscribe({
        next: (evidencias) => {
          this.evidencias = evidencias;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  salvar(): void {
    if (!this.selectedFile || !this.legenda) {
      alert('Preencha todos os campos');
      return;
    }

    this.isSaving = true;
    this.evidenciasService.salvarEvidencia(
      this.atividadeId, 
      this.legenda, 
      this.selectedFile
    ).subscribe({
      next: () => {
        alert('Evidência salva!');
        this.selectedFile = null;
        this.legenda = '';
        this.carregarEvidencias();
        this.isSaving = false;
      },
      error: (error) => {
        alert(error.message);
        this.isSaving = false;
      }
    });
  }

  excluir(evidenciaId: number): void {
    if (confirm('Excluir esta evidência?')) {
      this.evidenciasService.excluirEvidencia(evidenciaId)
        .subscribe({
          next: () => {
            alert('Evidência excluída!');
            this.carregarEvidencias();
          },
          error: (error) => {
            alert(error.message);
          }
        });
    }
  }

  getImageUrl(foto: string): string {
    return this.evidenciasService.getImageUrl(foto);
  }
}
```

---

## ✅ Features Implementadas

- ✅ Listagem de evidências por atividade
- ✅ Busca de evidência por ID
- ✅ Upload de nova evidência (multipart/form-data)
- ✅ Atualização de evidência existente
- ✅ Exclusão de evidência
- ✅ Geração de URL completa para imagens
- ✅ Formatação de tamanho de arquivo
- ✅ Tratamento robusto de erros
- ✅ Logs detalhados para debug
- ✅ Timeout configurável (30s)
- ✅ Testes unitários completos

---

## 🔒 Permissões Necessárias

As operações de **criar**, **atualizar** e **excluir** requerem uma das seguintes roles:
- `ROLE_ADMINISTRADOR`
- `ROLE_GERENTE`
- `ROLE_SECRETARIO`

A operação de **listar** e **buscar** são públicas (sem restrição de role no backend).

---

## 🐛 Tratamento de Erros

O serviço inclui tratamento específico para diversos cenários de erro:

| Status | Mensagem |
|--------|----------|
| **0** | Não foi possível conectar ao servidor |
| **400** | Dados inválidos |
| **401** | Não autorizado |
| **403** | Sem permissão |
| **404** | Evidência não encontrada |
| **413** | Arquivo muito grande |
| **415** | Tipo de arquivo não suportado |
| **500** | Erro interno do servidor |
| **503** | Serviço temporariamente indisponível |

---

## 📝 Notas Importantes

1. **FormData Automático**: O serviço cria automaticamente o FormData para envio multipart
2. **Timeout**: Requisições têm timeout de 30 segundos
3. **Logs**: Todos os métodos incluem logs detalhados no console
4. **Validação**: A validação de dados é feita no backend
5. **Autenticação**: O token JWT é enviado automaticamente pelo HttpClient

---

## 🧪 Executar Testes

```bash
ng test --include='**/evidencias.service.spec.ts'
```

---

**✨ Serviço pronto para uso! ✨**

