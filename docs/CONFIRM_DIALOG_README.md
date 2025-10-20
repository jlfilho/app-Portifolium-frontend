# 🎯 Componente Confirm Dialog

Componente de diálogo de confirmação reutilizável usando **Angular Material**.

## 📦 Características

- ✨ **Standalone Component** (sem NgModules)
- 🎨 **3 Tipos Visuais** (warning, danger, info)
- 🎭 **Animações Suaves** (entrada com escala e fade)
- 📱 **Totalmente Responsivo**
- ♿ **Acessível** (ARIA compliant)
- 🎯 **Reutilizável** em qualquer parte da aplicação

---

## 🎨 Tipos de Diálogo

### 1️⃣ **Danger** (Vermelho)
Para ações destrutivas como exclusões permanentes.
- Fundo vermelho no ícone
- Ícone: `delete_forever`
- Botão primário: vermelho (warn)

### 2️⃣ **Warning** (Laranja)
Para ações que requerem atenção mas não são destrutivas.
- Fundo laranja no ícone
- Ícone: `warning`
- Botão primário: azul (primary)

### 3️⃣ **Info** (Azul)
Para confirmações informativas.
- Fundo azul no ícone
- Ícone: `info`
- Botão primário: azul (primary)

---

## 🚀 Como Usar

### 1. **Importar no Componente**

```typescript
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

export class MyComponent {
  constructor(private dialog: MatDialog) {}
}
```

### 2. **Abrir o Diálogo**

#### Exemplo 1: Exclusão (Danger)
```typescript
deleteCourse(curso: any): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '500px',
    panelClass: 'confirm-dialog-panel',
    data: {
      title: 'Excluir Curso',
      message: `Tem certeza que deseja excluir "${curso.nome}"?`,
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // Usuário confirmou
      this.performDelete(curso.id);
    } else {
      // Usuário cancelou
      console.log('Exclusão cancelada');
    }
  });
}
```

#### Exemplo 2: Aviso (Warning)
```typescript
archiveCourse(): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '500px',
    panelClass: 'confirm-dialog-panel',
    data: {
      title: 'Arquivar Curso',
      message: 'O curso será arquivado e não aparecerá mais na lista principal.',
      confirmText: 'Arquivar',
      cancelText: 'Voltar',
      type: 'warning'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.archiveItem();
    }
  });
}
```

#### Exemplo 3: Informação (Info)
```typescript
publishCourse(): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '500px',
    panelClass: 'confirm-dialog-panel',
    data: {
      title: 'Publicar Curso',
      message: 'O curso será publicado e ficará visível para todos os alunos.',
      confirmText: 'Publicar',
      cancelText: 'Cancelar',
      type: 'info'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.publishItem();
    }
  });
}
```

---

## 📊 Interface de Dados

```typescript
interface ConfirmDialogData {
  title: string;           // Título do diálogo
  message: string;         // Mensagem de confirmação
  confirmText?: string;    // Texto do botão confirmar (padrão: "Confirmar")
  cancelText?: string;     // Texto do botão cancelar (padrão: "Cancelar")
  type?: 'warning' | 'danger' | 'info';  // Tipo visual (padrão: "warning")
}
```

---

## 🎨 Personalização

### Cores dos Tipos

```css
/* Danger (Vermelho) */
--danger-gradient: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
--danger-bg: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);

/* Warning (Laranja) */
--warning-gradient: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
--warning-bg: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);

/* Info (Azul) */
--info-gradient: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
--info-bg: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
```

### Largura do Diálogo

```typescript
// Padrão (500px)
width: '500px'

// Pequeno (400px)
width: '400px'

// Grande (600px)
width: '600px'

// Responsivo (90% em mobile)
maxWidth: '90vw'
```

---

## 🎭 Animações

### Ícone
- **Scale In**: O ícone cresce de 0 para 1
- **Duração**: 0.3s
- **Easing**: ease-out

### Conteúdo
- **Fade In**: Aparece com opacidade + movimento
- **Duração**: 0.3s
- **Delay**: 0.1s (após o ícone)

### Botões
- **Hover**: Elevação sutil (translateY -2px)
- **Active**: Volta ao normal (translateY 0)

---

## 📱 Responsividade

### Desktop (> 500px)
- Largura: 400-500px
- Ícone: 80px
- Botões: lado a lado

### Mobile (< 500px)
- Largura: 280px mínimo
- Ícone: 64px
- Botões: empilhados (coluna)
- Fonte reduzida

---

## ✅ Retorno de Valores

```typescript
dialogRef.afterClosed().subscribe(result => {
  // result = true  → Usuário clicou em Confirmar
  // result = false → Usuário clicou em Cancelar
  // result = undefined → Usuário fechou com ESC ou clicando fora
});
```

---

## 🔑 Atalhos de Teclado

- **Enter**: Confirma a ação
- **ESC**: Cancela e fecha o diálogo

---

## 🎯 Casos de Uso

### ✅ Quando Usar

1. **Exclusões permanentes**
   ```
   "Excluir curso? Esta ação não pode ser desfeita."
   ```

2. **Ações irreversíveis**
   ```
   "Publicar curso? Todos os alunos terão acesso."
   ```

3. **Mudanças importantes**
   ```
   "Desativar curso? Os alunos não poderão mais acessar."
   ```

### ❌ Quando NÃO Usar

1. **Ações triviais** (usar toast/snackbar)
2. **Formulários complexos** (usar dialog customizado)
3. **Múltiplas opções** (usar select/radio)

---

## 🧪 Testes

### Unitários Incluídos

```typescript
✅ Criação do componente
✅ Fechar com false ao cancelar
✅ Fechar com true ao confirmar
✅ Ícone correto para cada tipo
✅ Classe CSS correta para cada tipo
```

### Para Executar

```bash
npm test
```

---

## 📦 Dependências

```typescript
// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
```

---

## 🎨 Exemplo Visual

```
┌──────────────────────────────────┐
│                                   │
│         ⚠️                        │
│      (ícone animado)              │
│                                   │
│     Excluir Curso                 │
│                                   │
│  Tem certeza que deseja excluir  │
│  o curso "Angular Básico"?       │
│  Esta ação não pode ser desfeita.│
│                                   │
│            [Cancelar] [Excluir]  │
│                                   │
└──────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Diálogo não abre
```typescript
// ❌ Esqueceu de importar MatDialog
constructor(private dialog: MatDialog) {}

// ✅ Certifique-se de importar no constructor
```

### Estilos não aparecem
```typescript
// ✅ Use panelClass no open()
this.dialog.open(ConfirmDialogComponent, {
  panelClass: 'confirm-dialog-panel'  // Importante!
});
```

### Botão não responde
```typescript
// ✅ Certifique-se de subscrever afterClosed()
dialogRef.afterClosed().subscribe(result => {
  // Processar resultado aqui
});
```

---

## 📚 Exemplos Completos

### Exemplo 1: Deletar com Notificação

```typescript
deleteCourse(curso: any): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '500px',
    panelClass: 'confirm-dialog-panel',
    data: {
      title: 'Excluir Curso',
      message: `Tem certeza que deseja excluir "${curso.nome}"?`,
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.cursosService.deleteCourse(curso.id).subscribe({
        next: () => {
          this.snackBar.open('Curso excluído com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.loadCourses();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir curso.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  });
}
```

---

## ✅ Checklist de Implementação

- [x] Componente standalone criado
- [x] 3 tipos visuais (danger, warning, info)
- [x] Animações implementadas
- [x] Responsivo (mobile e desktop)
- [x] Testes unitários
- [x] Documentação completa
- [x] Integrado com cards-cursos
- [x] Notificações de sucesso/erro

---

**Desenvolvido com** ❤️ **usando Angular Material**

