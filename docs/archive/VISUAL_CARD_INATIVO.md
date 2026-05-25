# 🎨 Visual de Card Inativo - Curso Desativado

## 📋 Visão Geral

Implementação de **feedback visual claro** para cursos desativados, tornando os cards **apagados e esmaecidos** para indicar visualmente que o curso não está ativo.

---

## ✅ Implementação

### **1. Classe Dinâmica no Template**

**Arquivo:** `src/app/features/cursos/components/cards-cursos/cards-cursos.component.html`

```html
<mat-card 
  class="card" 
  appearance="outlined" 
  [class.card-inactive]="!curso.ativo">
```

**Funciona assim:**
- Se `curso.ativo = false` → Adiciona classe `.card-inactive`
- Se `curso.ativo = true` → Card normal

---

### **2. Estilos do Card Inativo**

**Arquivo:** `src/app/features/cursos/components/cards-cursos/cards-cursos.component.css`

#### **A. Card Base - Opacidade e Filtro**

```css
.card-inactive {
  opacity: 0.6;              /* ⬅ 60% de opacidade (esmaecido) */
  filter: grayscale(30%);    /* ⬅ 30% preto e branco */
  position: relative;
}
```

**Efeito:**
- 📉 **60% de opacidade** - Card mais transparente
- 🎨 **30% grayscale** - Cores menos vibrantes
- 👁️ Visual claramente "desligado"

---

#### **B. Overlay Branco Semi-Transparente**

```css
.card-inactive::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);  /* ⬅ Camada branca 40% */
  pointer-events: none;                   /* ⬅ Não bloqueia cliques */
  z-index: 1;
}
```

**Efeito:**
- ⚪ **Camada branca** sobre o card
- 🚫 **Não bloqueia cliques** (pointer-events: none)
- 💡 Visual de "desabilitado"

---

#### **C. Hover - Menos Apagado**

```css
.card-inactive:hover {
  opacity: 0.75;             /* ⬅ Melhora para 75% no hover */
  filter: grayscale(20%);    /* ⬅ Reduz grayscale para 20% */
}
```

**Efeito:**
- 👆 Ao passar o mouse, fica **menos apagado**
- 💡 Indica que ainda é **interativo**
- ✨ Transição suave

---

#### **D. Header - Saturação Reduzida**

```css
.card-inactive .card-header {
  opacity: 0.7;
  filter: saturate(0.5);     /* ⬅ 50% de saturação nas cores */
}
```

**Efeito:**
- 🌈 Gradiente azul → lilás mais **apagado**
- 🎨 Cores menos **vibrantes**

---

#### **E. Imagem - Muito Apagada e Cinza**

```css
.card-inactive .card-image {
  opacity: 0.5;              /* ⬅ 50% de opacidade */
  filter: grayscale(50%);    /* ⬅ 50% preto e branco */
}
```

**Efeito:**
- 🖼️ Imagem bem **esmaecida**
- ⚫ **50% cinza** (metade preto e branco)
- 👁️ Visual claro de "desligado"

---

#### **F. Título - Levemente Apagado**

```css
.card-inactive mat-card-title {
  opacity: 0.8;              /* ⬅ 80% de opacidade */
}
```

**Efeito:**
- 📝 Título ainda **legível**
- 💡 Mas claramente **menos importante**

---

#### **G. Botões - Apagados (Exceto Status)**

```css
.card-inactive mat-card-actions button:not(.status-inactive) {
  opacity: 0.6;
}

.card-inactive mat-card-actions button:not(.status-inactive):hover {
  opacity: 0.9;
}
```

**Efeito:**
- 🔘 Botões de ação (editar, excluir) mais **apagados**
- 👁️ Botão de status permanece **visível** (para reativar)
- 💡 Hover restaura **90% de opacidade**

---

## 🎨 **Comparação Visual**

### **Card ATIVO (Normal):**
```
Opacidade:    100%
Filtro:       Nenhum
Cores:        Vibrantes
Imagem:       100% visível
Header:       Gradiente completo
Visual:       Destaque total ✨
```

### **Card INATIVO (Apagado):**
```
Opacidade:    60% (75% no hover)
Filtro:       30% grayscale (20% no hover)
Overlay:      Branco 40%
Cores:        Esmaecidas
Imagem:       50% visível + 50% cinza
Header:       Gradiente com 50% saturação
Visual:       Apagado e esmaecido 🌫️
```

---

## 📊 **Efeitos Aplicados**

| Elemento | Opacidade | Grayscale | Saturação | Overlay |
|----------|-----------|-----------|-----------|---------|
| **Card** | 60% | 30% | - | Branco 40% |
| **Card (hover)** | 75% | 20% | - | Branco 40% |
| **Header** | 70% | - | 50% | - |
| **Imagem** | 50% | 50% | - | - |
| **Título** | 80% | - | - | - |
| **Botões** | 60% | - | - | - |

---

## 🎯 **Benefícios do Visual Apagado**

### **UX:**
- 👁️ **Identificação imediata** de cursos inativos
- 🎯 **Hierarquia visual** clara (ativos > inativos)
- 💡 **Foco** nos cursos importantes (ativos)
- ✨ **Ainda interativo** (hover restaura visibilidade)

### **Visual:**
- 🎨 **Esmaecimento progressivo** (card, header, imagem)
- 🌫️ **Overlay branco** para efeito "desligado"
- ⚫ **Grayscale** para reduzir vibração de cores
- 🔄 **Transições suaves** no hover

### **Acessibilidade:**
- ♿ **Não bloqueia interação** (pointer-events: none no overlay)
- 👆 **Hover melhora visibilidade** (75% opacity)
- 🎯 **Botão de status permanece visível** para reativar
- 📱 **Funciona em todas as telas**

---

## 🔄 **Estados Visuais Detalhados**

### **1. Card Ativo (Padrão)**
```css
.card {
  opacity: 1;
  filter: none;
  background: white;
  border: 1px solid #CBD5E1;
}
```

**Visual:**
- ✨ Cores vibrantes
- 🌈 Gradiente completo no header
- 🖼️ Imagem nítida
- 🎯 Destaque total

---

### **2. Card Inativo (Apagado)**
```css
.card-inactive {
  opacity: 0.6;
  filter: grayscale(30%);
}

.card-inactive::before {
  background: rgba(255, 255, 255, 0.4);
}

.card-inactive .card-image {
  opacity: 0.5;
  filter: grayscale(50%);
}
```

**Visual:**
- 🌫️ Esmaecido e apagado
- ⚫ Parcialmente em preto e branco
- 📉 Imagem bem desbotada
- 💤 Visual de "dormindo"

---

### **3. Card Inativo (Hover)**
```css
.card-inactive:hover {
  opacity: 0.75;
  filter: grayscale(20%);
}
```

**Visual:**
- 👆 Melhora ao passar o mouse
- 💡 Indica que é clicável
- ✨ Transição suave

---

## 📊 **Comparação Lado a Lado**

| Aspecto | Card Ativo | Card Inativo | Card Inativo (Hover) |
|---------|------------|--------------|----------------------|
| **Opacidade** | 100% | 60% | 75% |
| **Grayscale** | 0% | 30% | 20% |
| **Overlay** | Não | Branco 40% | Branco 40% |
| **Imagem Opacity** | 100% | 50% | 50% |
| **Imagem Grayscale** | 0% | 50% | 50% |
| **Botão Status** | Verde vibrante | Cinza visível | Cinza visível |

---

## 🎉 **Resultado Final**

**Cards inativos agora têm:**

✅ **60% de opacidade** (esmaecido)  
✅ **30% grayscale** (cores menos vibrantes)  
✅ **Overlay branco 40%** (efeito "desligado")  
✅ **Imagem 50% opaca + 50% cinza** (bem desbotada)  
✅ **Header com saturação reduzida**  
✅ **Botões apagados** (exceto o de status)  
✅ **Hover melhora visibilidade** (75% opacity)  
✅ **Ainda totalmente interativo**  

**Visual claro e intuitivo de curso desativado!** 🚀✨

---

## 📚 **Arquivos Modificados**

| Arquivo | Mudança |
|---------|---------|
| `cards-cursos.component.html` | +1 - Classe dinâmica `[class.card-inactive]` |
| `cards-cursos.component.css` | +55 linhas - Estilos de card inativo |

---

## 💡 **Técnicas CSS Aplicadas**

### **1. Opacity (Transparência)**
```css
opacity: 0.6;
```
→ Card fica semi-transparente

### **2. Grayscale (Preto e Branco)**
```css
filter: grayscale(30%);
```
→ Reduz vibração das cores em 30%

### **3. Overlay com ::before**
```css
.card-inactive::before {
  background: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}
```
→ Camada branca sem bloquear cliques

### **4. Saturate (Saturação de Cores)**
```css
filter: saturate(0.5);
```
→ Reduz intensidade das cores em 50%

### **5. Seletores Negativos**
```css
button:not(.status-inactive)
```
→ Aplica em todos exceto o botão de status

---

## 🎨 **Preview Visual**

### **Curso Ativo:**
```
╔═══════════════════════════╗
║ Introdução ao Angular     ║ ← Gradiente vibrante
║ [Editar] ✏️                ║
╠═══════════════════════════╣
║                           ║
║   [Imagem Colorida]       ║ ← Imagem nítida
║                           ║
╠═══════════════════════════╣
║ [🎯] [👥] [👁️🟢] [🗑️]     ║ ← Botões visíveis
╚═══════════════════════════╝
```

### **Curso Inativo:**
```
╔═══════════════════════════╗
║ React Avançado (apagado)  ║ ← Gradiente esmaecido
║ [Editar] ✏️ (opaco)        ║
╠═══════════════════════════╣
║                           ║
║   [Imagem Desbotada]      ║ ← 50% cinza + opaco
║                           ║
╠═══════════════════════════╣
║ [🎯] [👥] [👁️⚫] [🗑️]     ║ ← Botões apagados
╚═══════════════════════════╝
    ↑ overlay branco
```

---

**Data da Implementação:** 20 de outubro de 2025  
**Arquivos Modificados:** 2 arquivos  
**Status:** ✅ **CONCLUÍDO**



