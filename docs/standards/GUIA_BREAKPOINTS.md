# 📱 Guia de Uso - Breakpoints Responsivos
## Portifólium - Padronização de Media Queries

**Versão:** 1.0  
**Última Atualização:** 2024

---

## 📋 Sumário

Este guia documenta o uso dos breakpoints padronizados para design responsivo na aplicação Portifólium.

---

## 1. 🎯 Objetivo

Os breakpoints padronizados garantem:
- ✅ Consistência em toda a aplicação
- ✅ Facilidade de manutenção
- ✅ Responsividade uniforme
- ✅ Uso de variáveis CSS centralizadas

---

## 2. 📦 Variáveis Disponíveis

As variáveis de breakpoint estão definidas em `src/styles/variables.css`:

```css
--breakpoint-xs: 480px;   /* Mobile pequeno */
--breakpoint-sm: 600px;   /* Mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop pequeno */
--breakpoint-xl: 1200px;  /* Desktop */
--breakpoint-2xl: 1400px; /* Desktop grande */
```

---

## 3. 🚀 Uso Básico

### 3.1 Media Queries com Variáveis CSS

```css
/* Mobile (≤600px) */
@media (max-width: 600px) {
  .container {
    padding: 16px;
  }
}

/* Tablet (≤768px) */
@media (max-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop (≤1024px) */
@media (max-width: 1024px) {
  .container {
    max-width: 100%;
  }
}
```

**⚠️ Nota:** CSS não suporta variáveis em media queries diretamente. Use os valores numéricos ou considere usar mixins SCSS se disponível.

### 3.2 Uso Recomendado (Valores Diretos)

```css
/* Mobile pequeno (≤480px) */
@media (max-width: 480px) {
  /* Estilos para mobile pequeno */
}

/* Mobile (≤600px) */
@media (max-width: 600px) {
  /* Estilos para mobile */
}

/* Tablet (≤768px) */
@media (max-width: 768px) {
  /* Estilos para tablet */
}

/* Desktop pequeno (≤1024px) */
@media (max-width: 1024px) {
  /* Estilos para desktop pequeno */
}

/* Desktop (≤1200px) */
@media (max-width: 1200px) {
  /* Estilos para desktop */
}

/* Desktop grande (≤1400px) */
@media (max-width: 1400px) {
  /* Estilos para desktop grande */
}
```

---

## 4. 📊 Breakpoints e Dispositivos

| Breakpoint | Valor | Dispositivo | Uso |
|------------|-------|-------------|-----|
| `xs` | 480px | Mobile pequeno | Smartphones pequenos |
| `sm` | 600px | Mobile | Smartphones |
| `md` | 768px | Tablet | Tablets verticais |
| `lg` | 1024px | Desktop pequeno | Tablets horizontais, laptops pequenos |
| `xl` | 1200px | Desktop | Desktops padrão |
| `2xl` | 1400px | Desktop grande | Desktops grandes, monitores wide |

---

## 5. 📝 Padrões de Uso

### 5.1 Mobile First (Recomendado)

```css
/* Estilos base (mobile) */
.container {
  padding: 16px;
  font-size: 14px;
}

/* Tablet e acima */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop e acima */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 5.2 Desktop First

```css
/* Estilos base (desktop) */
.container {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Tablet e abaixo */
@media (max-width: 1024px) {
  .container {
    padding: 24px;
    max-width: 100%;
  }
}

/* Mobile e abaixo */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
}
```

---

## 6. 🎨 Exemplos Completos

### 6.1 Grid Responsivo

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 colunas */
@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop: 3 colunas */
@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

### 6.2 Navegação Responsiva

```css
.nav-menu {
  display: none;
}

.nav-toggle {
  display: block;
}

/* Tablet e acima: mostrar menu */
@media (min-width: 768px) {
  .nav-menu {
    display: flex;
  }

  .nav-toggle {
    display: none;
  }
}
```

### 6.3 Tabela Responsiva

```css
.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 600px; /* Largura mínima */
}

/* Desktop: largura fixa */
@media (min-width: 1024px) {
  .table {
    min-width: auto;
  }
}
```

### 6.4 Cards Responsivos

```css
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 colunas */
@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop: 3 colunas */
@media (min-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

---

## 7. 🔄 Migração de Código Antigo

### Antes (Código Antigo):

```css
/* Breakpoints inconsistentes */
@media (max-width: 500px) { /* ❌ Não padronizado */
  .container {
    padding: 12px;
  }
}

@media (max-width: 900px) { /* ❌ Não padronizado */
  .container {
    padding: 20px;
  }
}
```

### Depois (Com Breakpoints Padronizados):

```css
/* Mobile pequeno */
@media (max-width: 480px) {
  .container {
    padding: 12px;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
}
```

---

## 8. ✅ Checklist de Uso

Antes de criar uma media query, verifique:

- [ ] Usar um dos breakpoints padronizados (480px, 600px, 768px, 1024px, 1200px, 1400px)
- [ ] Evitar breakpoints customizados (ex: 500px, 900px)
- [ ] Seguir padrão mobile-first quando possível
- [ ] Testar em diferentes tamanhos de tela
- [ ] Documentar breakpoints customizados se necessário

---

## 9. 🚫 Erros Comuns

### ❌ Não Fazer:

1. **Breakpoints customizados:**
```css
/* ERRADO */
@media (max-width: 500px) { }
@media (max-width: 900px) { }

/* CORRETO */
@media (max-width: 480px) { }
@media (max-width: 768px) { }
```

2. **Breakpoints muito próximos:**
```css
/* ERRADO */
@media (max-width: 600px) { }
@media (max-width: 601px) { }

/* CORRETO */
@media (max-width: 600px) { }
@media (min-width: 768px) { }
```

3. **Valores hardcoded sem referência:**
```css
/* ERRADO */
@media (max-width: 767px) { }

/* CORRETO */
@media (max-width: 768px) { }
```

---

## 10. 📋 Tabela de Referência Rápida

| Dispositivo | Breakpoint | Media Query |
|-------------|------------|-------------|
| Mobile pequeno | 480px | `@media (max-width: 480px)` |
| Mobile | 600px | `@media (max-width: 600px)` |
| Tablet | 768px | `@media (max-width: 768px)` |
| Desktop pequeno | 1024px | `@media (max-width: 1024px)` |
| Desktop | 1200px | `@media (max-width: 1200px)` |
| Desktop grande | 1400px | `@media (max-width: 1400px)` |

---

## 11. 🎯 Resumo Rápido

**Breakpoints Padronizados:**
- `480px` - Mobile pequeno
- `600px` - Mobile
- `768px` - Tablet
- `1024px` - Desktop pequeno
- `1200px` - Desktop
- `1400px` - Desktop grande

**Uso:**
```css
/* Mobile */
@media (max-width: 600px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (max-width: 1024px) { }
```

---

**Última Revisão:** 2024  
**Mantido por:** Equipe de Desenvolvimento Portifólium

