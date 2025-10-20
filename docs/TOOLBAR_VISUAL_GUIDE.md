# 🎨 Guia Visual Rápido - Toolbar e Sidebar

## 📸 Elementos Principais

### **Toolbar (Header)**

```
┌──────────────────────────────────────────────────────────┐
│  ☰  [📱]  Portifólium              🔔³    👤 User Name ▾  │
│  💜━━━━━  Sistema de Gestão ━━━━━━━━━━━━━━━━━━━━━━━━━━  │
└──────────────────────────────────────────────────────────┘
```

**Elementos da Esquerda para Direita:**
1. Botão Menu (☰) - Toggle sidebar
2. Logo (40x40px) - Com animação hover
3. Título "Portifólium" - Bold 20px
4. Subtítulo "Sistema de Gestão" - 11px
5. Botão Notificações (🔔) - Com badge contador
6. Menu Usuário (👤) - Nome + avatar + dropdown

---

### **Sidebar (Navegação)**

```
┌────────────────────┐
│ █ Dashboard        │ ← Ativo (com barra lateral)
│ ▮ Cursos           │ ← Hover (mover 4px direita)
│ ▮ Categorias       │ ← Normal
│ ▮ Usuários         │ ← Apenas admin
│ ──────────────     │ ← Divider
│ ▮ Configurações    │
│                    │
│  Versão 1.0.0      │ ← Footer
└────────────────────┘
```

**Estados:**
- **Normal**: Cinza (#9CA3AF)
- **Hover**: Branco + background azul + mover direita
- **Ativo**: Gradiente + sombra + barra lateral

---

## 🎨 Paleta de Cores

### **Primárias**
```
🟣 Primary:   #5B5BEA  (Azul violeta)
🔵 Secondary: #38BDF8  (Azul ciano)
🟣 Accent:    #7C3AED  (Roxo vibrante)
```

### **Utilitárias**
```
🟢 Success:  #10B981
🟡 Warning:  #F59E0B
🔴 Error:    #EF4444
```

### **Neutras**
```
⚫ Dark:      #111827  (Background sidebar)
⚫ Darker:    #0F172A  (Gradiente sidebar)
⚪ Light:     #F9FAFB  (Texto claro)
🔘 Secondary: #9CA3AF  (Texto secundário)
```

---

## 📐 Dimensões

### **Desktop (>1024px)**
```
Toolbar:  altura 64px | padding 24px
Sidebar:  largura 280px
Logo:     40x40px
```

### **Tablet (≤1024px)**
```
Toolbar:  altura 64px | padding 16px
Sidebar:  largura 250px
Logo:     40x40px
```

### **Mobile (≤768px)**
```
Toolbar:  altura 56px | padding 12px
Sidebar:  largura 100% (overlay)
Logo:     32x32px
```

### **Small Mobile (≤480px)**
```
Toolbar:  altura 56px | padding 8px
Logo:     28x28px
```

---

## 🎬 Animações

### **Hover Effects**
```
Botões:     scale(1.1) + background rgba(255,255,255,0.1)
Nav Items:  translateX(4px) + cor secundária
Logo:       scale(1.1) + rotate(5deg)
```

### **Active State**
```
Background: Gradiente 90deg (roxo → roxo claro)
Sombra:     0 2px 8px rgba(91, 91, 234, 0.3)
Ícone:      scale(1.1) + cor secundária
Indicador:  Barra lateral 4px (gradiente)
```

### **Slide In (Nav Items)**
```
De:    opacity 0 + translateX(-20px)
Para:  opacity 1 + translateX(0)
Delay: 0.05s, 0.1s, 0.15s, 0.2s, 0.25s
```

---

## 🎯 Estados Visuais

### **Nav Item - Normal**
```css
color: #9CA3AF
background: transparent
transform: translateX(0)
```

### **Nav Item - Hover**
```css
color: #F9FAFB
background: rgba(91, 91, 234, 0.1)
transform: translateX(4px)
icon-color: #38BDF8
```

### **Nav Item - Ativo**
```css
color: #F9FAFB
background: linear-gradient(90deg, rgba(91,91,234,0.2), rgba(124,58,237,0.1))
font-weight: 600
box-shadow: 0 2px 8px rgba(91, 91, 234, 0.3)
icon-color: #38BDF8
icon-scale: 1.1
indicator: visible (barra lateral 4px)
```

---

## 📱 Comportamento Responsivo

### **Elementos Ocultos por Breakpoint**

**Tablet (≤1024px):**
- ❌ Subtítulo do header
- ❌ Nome do usuário

**Mobile (≤768px):**
- ❌ Subtítulo do header
- ❌ Nome do usuário
- ❌ Ícone dropdown
- ❌ Botão de notificações
- 📱 Sidebar vira overlay (100% largura)

---

## 🎨 Gradientes Usados

### **Toolbar**
```css
background: linear-gradient(135deg, #5B5BEA 0%, #7C3AED 100%)
```

### **Sidebar**
```css
background: linear-gradient(180deg, #111827 0%, #0F172A 100%)
```

### **Nav Item Ativo**
```css
background: linear-gradient(90deg, 
  rgba(91, 91, 234, 0.2) 0%, 
  rgba(124, 58, 237, 0.1) 100%)
```

### **Indicador Ativo**
```css
background: linear-gradient(180deg, #5B5BEA 0%, #38BDF8 100%)
```

### **Scrollbar Thumb**
```css
background: linear-gradient(180deg, #5B5BEA, #38BDF8)
```

---

## 🔧 Classes CSS Principais

```css
.header              → Toolbar principal
.menu-button         → Botão menu (☰)
.header-brand        → Container logo + título
.header-logo         → Logo circular
.header-title        → Título + subtítulo
.notification-button → Botão notificações
.user-menu-button    → Botão menu usuário
.user-dropdown       → Dropdown do menu
.sidenav            → Sidebar
.nav-list           → Lista de navegação
.nav-item           → Item de navegação
.nav-icon           → Ícone do item
.nav-text           → Texto do item
.active-indicator   → Barra lateral (item ativo)
.sidebar-footer     → Footer com versão
```

---

## ✨ Efeitos Especiais

### **Sombras**
```
Toolbar:     0 4px 20px rgba(91, 91, 234, 0.3)
Sidebar:     4px 0 20px rgba(0, 0, 0, 0.2)
Logo:        0 2px 8px rgba(0, 0, 0, 0.2)
Nav Ativo:   0 2px 8px rgba(91, 91, 234, 0.3)
```

### **Bordas**
```
Toolbar:    border-bottom: 1px solid rgba(255,255,255,0.1)
Sidebar:    border-right: 1px solid rgba(255,255,255,0.1)
Divider:    background: rgba(255,255,255,0.1)
```

### **Ripple Effect**
```css
background: rgba(91, 91, 234, 0.2)
```

---

## 🎯 Tooltips

```
Menu Button:         "Menu"
Notification Button: "Notificações"
```

---

## 📊 Hierarquia Z-Index

```
1000  → Toolbar (sticky)
999   → Sidebar mobile (fixed)
Auto  → Dropdown overlay (CDK)
```

---

## ♿ Acessibilidade

### **Contraste**
- Todos os textos: mínimo 4.5:1
- Ícones importantes: 3:1

### **Interação**
- Tab: Todos os elementos navegáveis
- Enter/Space: Ativa botões
- Esc: Fecha dropdowns

### **ARIA**
```html
aria-expanded="true/false"  (menu dropdown)
matTooltip                  (todos os ícones)
matBadge                    (contador notificações)
```

---

## 🚀 Performance

- Transições: `transform` e `opacity` (GPU-accelerated)
- Animações: `will-change` aplicado automaticamente
- Scrollbar: Custom CSS (sem JavaScript)

---

## 📝 Notas Importantes

1. ✅ Gradientes são **apenas visuais** (não afetam performance)
2. ✅ Animações respeitam `prefers-reduced-motion`
3. ✅ Sidebar colapsa para 70px (apenas ícones)
4. ✅ Menu "Usuários" só aparece para admin
5. ✅ Todas as cores usam variáveis CSS

---

**Referência Rápida para Desenvolvedores**

- [Documentação Completa](src/app/dashboard/TOOLBAR_MELHORIAS.md)
- Paleta: Educação Moderna
- Framework: Angular 19 + Material Design
- Responsividade: Mobile-first

