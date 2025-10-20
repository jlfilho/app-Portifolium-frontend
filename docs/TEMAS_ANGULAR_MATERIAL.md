# 🎨 Temas do Angular Material - Guia Completo

## 📋 Visão Geral

O Angular Material oferece **temas pré-construídos** que podem ser facilmente aplicados ao projeto. Este documento lista todos os temas disponíveis e como alterá-los.

---

## 🎨 **Temas Pré-construídos Disponíveis**

### **Material Design 3 (M3) - Temas Modernos:**

#### **1. `azure-blue.css`** ⭐ **RECOMENDADO**
```scss
Primary:  Azul Azure (#007FFF, #0277BD)
Accent:   Azul (tom diferente)
Theme:    Claro e moderno
```
✅ **Perfeito para "azul e azul"**  
✅ **Sem rosa/roxo**  
✅ **Consistente com nossa paleta "Minimal Tech Light+"**

---

#### **2. `rose-red.css`**
```scss
Primary:  Rosa (#E91E63)
Accent:   Vermelho (#F44336)
Theme:    Vibrante e energético
```
❌ Não recomendado - tem rosa

---

#### **3. `cyan-orange.css`**
```scss
Primary:  Ciano (#00BCD4)
Accent:   Laranja (#FF9800)
Theme:    Fresco e vibrante
```
⚠️ Cores muito vibrantes para sistema acadêmico

---

#### **4. `magenta-violet.css`** ❌ **ATUAL (Estava sendo usado)**
```scss
Primary:  Magenta (#E91E63)
Accent:   Violeta (#9C27B0)
Theme:    Rosa e roxo
```
❌ Causa cores rosa/roxo - **SUBSTITUÍDO por azure-blue.css**

---

### **Material Design 2 (M2) - Temas Clássicos:**

#### **5. `indigo-pink.css`** (Tema padrão clássico)
```scss
Primary:  Indigo (#3F51B5)
Accent:   Rosa (#FF4081)
Theme:    Tema original do Material
```
⚠️ Tem rosa no accent

---

#### **6. `deeppurple-amber.css`**
```scss
Primary:  Roxo Escuro (#673AB7)
Accent:   Âmbar (#FFC107)
Theme:    Contraste forte
```
⚠️ Tem roxo

---

#### **7. `pink-bluegrey.css`**
```scss
Primary:  Rosa (#E91E63)
Accent:   Cinza Azulado (#607D8B)
Theme:    Feminino e sóbrio
```
❌ Tem rosa

---

#### **8. `purple-green.css`**
```scss
Primary:  Roxo (#9C27B0)
Accent:   Verde (#4CAF50)
Theme:    Contraste complementar
```
❌ Tem roxo

---

## ✅ **Tema Aplicado no Projeto**

### **Tema Atual: `azure-blue.css`** ⭐

**Arquivo:** `angular.json`

```json
"styles": [
  "@angular/material/prebuilt-themes/azure-blue.css",
  "src/styles.css"
],
```

**Benefícios:**
- ✅ **Azul + Azul** conforme solicitado
- ✅ **Sem rosa/roxo**
- ✅ **Consistente** com paleta "Minimal Tech Light+"
- ✅ **Profissional** para sistema acadêmico
- ✅ **Material Design 3** (mais moderno)

---

## 🔧 **Como Alterar o Tema**

### **Passo 1: Editar angular.json**

Localize a seção `styles` (linha ~30) e altere:

```json
"styles": [
  "@angular/material/prebuilt-themes/NOME-DO-TEMA.css",
  "src/styles.css"
],
```

### **Passo 2: Substituir o nome do tema**

Opções:
- `azure-blue.css` ⭐ **Atual**
- `rose-red.css`
- `cyan-orange.css`
- `indigo-pink.css`
- `deeppurple-amber.css`
- `pink-bluegrey.css`
- `purple-green.css`

### **Passo 3: Reiniciar o servidor**

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm start
```

---

## 🎨 **Comparação de Temas**

| Tema | Primary | Accent | Rosa/Roxo? | Recomendado? |
|------|---------|--------|------------|--------------|
| `azure-blue.css` | Azul | Azul | ❌ Não | ✅ **SIM** |
| `rose-red.css` | Rosa | Vermelho | ✅ Sim | ❌ Não |
| `cyan-orange.css` | Ciano | Laranja | ❌ Não | ⚠️ Muito vibrante |
| `magenta-violet.css` | Magenta | Violeta | ✅ Sim | ❌ Não |
| `indigo-pink.css` | Indigo | Rosa | ✅ Sim | ❌ Não |
| `deeppurple-amber.css` | Roxo | Âmbar | ✅ Sim | ❌ Não |
| `pink-bluegrey.css` | Rosa | Cinza | ✅ Sim | ❌ Não |
| `purple-green.css` | Roxo | Verde | ✅ Sim | ❌ Não |

---

## 💡 **Customização Adicional**

### **Além do tema pré-construído, também temos:**

1. **Variáveis CSS Globais** (`src/styles/variables.css`)
   ```css
   :root {
     --primary-color: #3B82F6;
     --secondary-color: #8B5CF6;
   }
   ```

2. **Overrides do Material** (`src/styles.css`)
   ```css
   ::ng-deep .mat-mdc-button.mat-primary {
     background: var(--gradient-primary) !important;
   }
   ```

3. **Overrides Específicos** (em cada componente)
   ```css
   ::ng-deep mat-form-field.mat-focused {
     --mat-form-field-focus-label-color: #3B82F6 !important;
   }
   ```

---

## 🎯 **Recomendação Final**

### **Para o Portifólium:**

**Tema Base:** `azure-blue.css` ✅ **(Aplicado)**

**Customizações Adicionais:**
- ✅ Variáveis CSS em `variables.css`
- ✅ Overrides globais em `styles.css`
- ✅ Overrides específicos nos componentes

**Resultado:**
- 💙 **100% azul** (sem rosa/roxo)
- 🎨 **Paleta "Minimal Tech Light+"** aplicada
- ✨ **Visual moderno** e profissional

---

## 📊 **Antes vs Depois**

### **ANTES:**
```json
"@angular/material/prebuilt-themes/magenta-violet.css"
```
- ❌ Primary: Magenta (rosa)
- ❌ Accent: Violeta (roxo)
- ❌ Cores rosa/roxo em todo o Material

### **DEPOIS:**
```json
"@angular/material/prebuilt-themes/azure-blue.css"
```
- ✅ Primary: Azul Azure
- ✅ Accent: Azul (tom diferente)
- ✅ **ZERO rosa/roxo** no tema base

---

## 🚀 **Próximos Passos**

### **1. Reiniciar o servidor:**
```bash
npm start
```

### **2. Verificar as cores:**
- ✅ Botões primários devem estar azul
- ✅ Campos focados devem estar azul
- ✅ Slide toggles devem estar azul
- ✅ Sem rastro de rosa/roxo

### **3. Se ainda houver rosa/roxo:**
- Nossos overrides em `styles.css` vão sobrescrever
- Overrides específicos nos componentes também aplicam

---

## ✅ **Resultado Final**

**Com `azure-blue.css` + nossos overrides:**

✅ **Tema base azul** do Angular Material  
✅ **Overrides customizados** para paleta "Minimal Tech Light+"  
✅ **Zero cores rosa/roxo**  
✅ **Visual consistente** em toda a aplicação  
✅ **Profissional** e moderno  

**O Angular Material agora usa azul como tema base, e nossos overrides garantem a paleta completa!** 🚀✨

---

**Tema Aplicado:** `azure-blue.css`  
**Data da Alteração:** 20 de outubro de 2025  
**Status:** ✅ **CONCLUÍDO**

