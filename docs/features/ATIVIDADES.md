# 📚 Service de Atividades

Este módulo contém o service para gerenciar atividades educacionais, baseado no controller da API backend.

## 🏗️ Estrutura

```
src/app/features/atividades/
├── models/
│   └── atividade.model.ts          # Interfaces e tipos
├── services/
│   ├── atividades.service.ts       # Service principal
│   └── atividades.service.spec.ts   # Testes unitários
├── components/                     # Componentes futuros
├── atividades.module.ts            # Módulo Angular
└── index.ts                       # Exportações centralizadas
```

## 📋 Interfaces Disponíveis

### AtividadeDTO
```typescript
interface AtividadeDTO {
  id?: number;
  nome: string;
  objetivo: string;
  publicoAlvo: string;
  statusPublicacao: boolean;
  fotoCapa?: string;
  coordenador: string;
  dataRealizacao: string; // ISO date string (LocalDate)
  curso: CursoDTO;
  categoria: CategoriaDTO;
  fontesFinanciadora: FonteFinanciadoraDTO[];
  integrantes: PessoaPapelDTO[];
}
```

### CursoDTO
```typescript
interface CursoDTO {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}
```

### CategoriaDTO
```typescript
interface CategoriaDTO {
  id: number;
  nome: string;
  descricao?: string;
}
```

### FonteFinanciadoraDTO
```typescript
interface FonteFinanciadoraDTO {
  id: number;
  nome: string;
}
```

### PessoaPapelDTO
```typescript
interface PessoaPapelDTO {
  id: number;
  nome: string;
  cpf: string;
  papel: string; // Papel da pessoa na atividade
}
```

### AtividadeFiltroDTO
```typescript
interface AtividadeFiltroDTO {
  cursoId?: number;
  categoriaId?: number;
  nome?: string;
  dataRealizacao?: string; // ISO date string
  statusPublicacao?: boolean;
  coordenador?: string;
  publicoAlvo?: string;
}
```

## 🔧 Métodos do Service

### Consultas
- `getAtividadesPorCurso(cursoId: number)` - Buscar atividades por curso
- `getAtividadeById(atividadeId: number)` - Buscar atividade por ID
- `getAtividadeByIdAndUsuario(atividadeId: number, usuarioId: number)` - Buscar atividade por ID e usuário
- `getAtividadesPorFiltros(filtros: AtividadeFiltroDTO)` - Buscar atividades com filtros

### Criação e Atualização
- `salvarAtividade(atividade: AtividadeCreateDTO)` - Criar nova atividade
- `atualizarAtividade(atividadeId: number, atividade: AtividadeUpdateDTO)` - Atualizar atividade
- `salvarFotoCapa(atividadeId: number, file: File)` - Atualizar foto de capa

### Exclusão
- `excluirAtividade(atividadeId: number)` - Excluir atividade
- `excluirFotoCapa(atividadeId: number)` - Excluir foto de capa

### Métodos Auxiliares
- `formatarDataParaISO(data: Date | string)` - Converter data para ISO
- `converterISOParaData(dataISO: string)` - Converter ISO para Date
- `isAtividadeAtiva(atividade: AtividadeDTO)` - Verificar se atividade está ativa
- `getStatusAtividade(atividade: AtividadeDTO)` - Obter status (ativa/inativa/futura/realizada)
- `getCursoInfo(atividade: AtividadeDTO)` - Obter informações do curso
- `getCategoriaInfo(atividade: AtividadeDTO)` - Obter informações da categoria
- `getFontesFinanciadoras(atividade: AtividadeDTO)` - Obter lista de fontes financiadoras
- `getIntegrantes(atividade: AtividadeDTO)` - Obter lista de integrantes

## 🚀 Como Usar

### 1. Importar o Service
```typescript
import { AtividadesService } from './features/atividades';

// Ou importar diretamente
import { AtividadesService } from './features/atividades/services/atividades.service';
```

### 2. Injetar no Componente
```typescript
import { Component } from '@angular/core';
import { AtividadesService } from './features/atividades';

@Component({
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html'
})
export class ExemploComponent {
  constructor(private atividadesService: AtividadesService) {}

  ngOnInit() {
    this.carregarAtividades();
  }

  carregarAtividades() {
    this.atividadesService.getAtividadesPorCurso(1).subscribe({
      next: (atividades) => {
        console.log('Atividades carregadas:', atividades);
      },
      error: (error) => {
        console.error('Erro ao carregar atividades:', error);
      }
    });
  }
}
```

### 3. Usar com Filtros
```typescript
const filtros: AtividadeFiltroDTO = {
  cursoId: 1,
  statusPublicacao: true,
  coordenador: 'João Silva',
  publicoAlvo: 'Estudantes'
};

this.atividadesService.getAtividadesPorFiltros(filtros).subscribe(atividades => {
  console.log('Atividades filtradas:', atividades);
});
```

### 4. Criar Nova Atividade
```typescript
const novaAtividade: AtividadeCreateDTO = {
  nome: 'Nova Atividade',
  objetivo: 'Objetivo da atividade',
  publicoAlvo: 'Público alvo',
  statusPublicacao: true,
  coordenador: 'João Silva',
  dataRealizacao: '2024-01-01',
  cursoId: 1,
  categoriaId: 1,
  fontesFinanciadoraIds: [1, 2],
  integrantesIds: [1, 2, 3]
};

this.atividadesService.salvarAtividade(novaAtividade).subscribe({
  next: (atividade) => {
    console.log('Atividade criada:', atividade);
  },
  error: (error) => {
    console.error('Erro ao criar atividade:', error);
  }
});
```

### 6. Usar Métodos Auxiliares
```typescript
// Verificar se atividade está ativa
const isAtiva = this.atividadesService.isAtividadeAtiva(atividade);

// Obter status da atividade
const status = this.atividadesService.getStatusAtividade(atividade);
// Retorna: 'ativa' | 'inativa' | 'futura' | 'realizada'

// Obter informações do curso
const cursoInfo = this.atividadesService.getCursoInfo(atividade);
// Retorna: "Curso de Engenharia (ID: 1)"

// Obter informações da categoria
const categoriaInfo = this.atividadesService.getCategoriaInfo(atividade);
// Retorna: "Categoria A (ID: 1)"

// Obter lista de fontes financiadoras
const fontes = this.atividadesService.getFontesFinanciadoras(atividade);
// Retorna: ["Fonte 1", "Fonte 2"]

// Obter lista de integrantes
const integrantes = this.atividadesService.getIntegrantes(atividade);
// Retorna: ["João Silva (Coordenador)", "Maria Santos (Participante)"]
// Formato: "Nome (Papel)"
```

### 7. Upload de Foto de Capa
```typescript
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.atividadesService.salvarFotoCapa(atividadeId, file).subscribe({
      next: (atividade) => {
        console.log('Foto de capa atualizada:', atividade);
      },
      error: (error) => {
        console.error('Erro ao fazer upload da foto:', error);
      }
    });
  }
}
```

## 🔐 Permissões

Os seguintes endpoints requerem autenticação e roles específicas:
- **ADMINISTRADOR**, **GERENTE** ou **SECRETARIO**: Criação, atualização e exclusão de atividades

## 🧪 Testes

O service inclui testes unitários completos usando `HttpClientTestingModule`. Para executar:

```bash
ng test --include="**/atividades.service.spec.ts"
```

## 📝 Notas Importantes

1. **Datas**: Todas as datas são tratadas como strings ISO (YYYY-MM-DD)
2. **Upload de Arquivos**: Use `FormData` para upload de fotos de capa
3. **Filtros**: Todos os parâmetros de filtro são opcionais
4. **Status**: Use os métodos auxiliares para verificar status das atividades
5. **Error Handling**: Sempre implemente tratamento de erro nas chamadas HTTP

## 🔗 Endpoints da API

- `GET /api/atividades/curso/{cursoId}` - Atividades por curso
- `GET /api/atividades/{atividadeId}` - Atividade por ID
- `GET /api/atividades/{atividadeId}/usuario/{usuarioId}` - Atividade por ID e usuário
- `GET /api/atividades/filtros` - Atividades com filtros
- `POST /api/atividades` - Criar atividade
- `PUT /api/atividades/foto-capa/{atividadeId}` - Upload foto de capa
- `PUT /api/atividades/{atividadeId}` - Atualizar atividade
- `DELETE /api/atividades/{atividadeId}/foto-capa` - Excluir foto de capa
- `DELETE /api/atividades/{atividadeId}` - Excluir atividade
