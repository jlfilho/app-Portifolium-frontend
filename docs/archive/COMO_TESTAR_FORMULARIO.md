# 🧪 Como Testar o Formulário de Curso

## 🚀 Passo a Passo para Testar

### 1️⃣ Iniciar o Servidor

```bash
# Certifique-se de que está no diretório do projeto
cd D:\app-Portifolium-frontend

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar o servidor de desenvolvimento
npm start
```

Aguarde até ver a mensagem:
```
✔ Browser application bundle generation complete.
Initial Chunk Files | Names         |  Raw Size
...
Application bundle generation complete. [X.XXXs]

Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
```

---

### 2️⃣ Acessar a Aplicação

1. Abra seu navegador
2. Acesse: `http://localhost:4200`
3. Faça login (se necessário)

---

### 3️⃣ Testar Criação de Curso

#### Acessar o Formulário
1. Navegue para a página de **Meus Cursos**
2. Clique no botão **➕ (Add)** no canto superior direito
3. Você será redirecionado para `/cursos/novo`

#### Preencher o Formulário
```
📝 Nome: "Introdução ao TypeScript"
📄 Descrição: "Aprenda TypeScript do zero com exemplos práticos"
🏷️ Categoria: Selecione uma categoria
⏱️ Carga Horária: 40
📅 Data Início: 15/01/2025 (opcional)
📅 Data Fim: 15/03/2025 (opcional)
👥 Quantidade Alunos: 30
⚡ Ativo: Ligado (ON)
```

#### Validações a Testar
- [ ] Deixe o nome vazio e clique em Cadastrar (deve mostrar erro)
- [ ] Digite apenas 2 caracteres no nome (deve mostrar erro de mínimo)
- [ ] Deixe a descrição vazia (deve mostrar erro)
- [ ] Digite apenas 5 caracteres na descrição (deve mostrar erro de mínimo)
- [ ] Não selecione categoria (deve mostrar erro)
- [ ] Digite 0 na carga horária (deve mostrar erro de mínimo)

#### Ações a Testar
- [ ] Clique em **🔄 Limpar** (deve limpar todos os campos)
- [ ] Clique em **❌ Cancelar** (deve voltar para /cursos)
- [ ] Preencha corretamente e clique em **💾 Cadastrar**
  - Deve mostrar spinner "Salvando..."
  - Deve mostrar notificação verde de sucesso
  - Deve redirecionar para /cursos

---

### 4️⃣ Testar Edição de Curso

#### Acessar Modo Edição
1. Na lista de cursos, clique no botão **✏️ (Edit)** de um curso
2. Você será redirecionado para `/cursos/editar/:id`
3. O formulário deve aparecer **preenchido** com os dados do curso

#### Modificar e Salvar
- [ ] Altere o nome do curso
- [ ] Altere a descrição
- [ ] Mude a categoria
- [ ] Clique em **💾 Atualizar**
  - Deve mostrar notificação verde
  - Deve voltar para /cursos
  - As mudanças devem aparecer na listagem

---

### 5️⃣ Testar Exclusão de Curso

1. Na lista de cursos, clique no botão **🗑️ (Delete)** de um curso
2. Deve aparecer um **confirm dialog** perguntando: "Tem certeza que deseja excluir este curso?"
3. Clique em **OK**
   - O curso deve ser removido da lista
4. Teste cancelar a exclusão clicando em **Cancelar**
   - O curso deve permanecer

---

### 6️⃣ Testar Responsividade

#### Desktop (> 768px)
- [ ] Campos de data devem estar lado a lado
- [ ] Categoria e carga horária lado a lado
- [ ] Botões alinhados à direita

#### Mobile (< 768px)
- [ ] Abra o DevTools (F12)
- [ ] Ative o modo responsivo (Ctrl+Shift+M)
- [ ] Teste com resolução de celular (375x667)
- [ ] Todos os campos devem estar empilhados (1 coluna)
- [ ] Botões devem ocupar largura total

---

### 7️⃣ Testar Loading States

#### Loading de Categorias
1. Abra o DevTools → Network tab
2. Adicione throttling (Slow 3G)
3. Acesse `/cursos/novo`
4. Deve ver um **spinner** enquanto carrega as categorias

#### Loading ao Salvar
1. Preencha o formulário
2. Abra Network tab com throttling
3. Clique em Cadastrar
4. O botão deve mostrar "Salvando..." com ícone de ampulheta

---

### 8️⃣ Testar Notificações

#### Sucesso ✅
- Crie ou edite um curso com sucesso
- Deve aparecer notificação **verde** no canto superior direito
- Mensagem: "Curso cadastrado com sucesso!" ou "Curso atualizado com sucesso!"

#### Erro ❌
- Simule um erro de rede (desconecte da API)
- Tente criar um curso
- Deve aparecer notificação **vermelha**
- Mensagem: "Erro ao salvar curso. Tente novamente."

#### Aviso ⚠️
- Deixe campos obrigatórios vazios
- Clique em Cadastrar
- Deve aparecer notificação **laranja**
- Mensagem: "Por favor, preencha todos os campos obrigatórios."

---

### 9️⃣ Testar Ícones e Tooltips

#### Ícones nos Campos
- [ ] **school** (nome)
- [ ] **description** (descrição)
- [ ] **category** (categoria)
- [ ] **schedule** (carga horária)
- [ ] **event** (datas)
- [ ] **groups** (alunos)

#### Tooltips
Passe o mouse sobre:
- [ ] Botão "Adicionar" (na listagem)
- [ ] Botão "Editar" (na listagem)
- [ ] Botão "Excluir" (na listagem)
- [ ] Botão "Limpar" (no formulário)
- [ ] Botão "Salvar" (no formulário)

---

### 🔟 Testar Animações

#### Entrada do Card
- [ ] Ao abrir o formulário, o card deve aparecer com fade-in suave

#### Hover em Botões
- [ ] Passe o mouse sobre qualquer botão
- [ ] Deve ter uma elevação sutil (translateY)

#### Focus em Campos
- [ ] Clique em qualquer campo de input
- [ ] O ícone à esquerda deve ter uma animação de escala
- [ ] A cor do ícone deve mudar para o primário

---

## 🎯 Cenários de Teste Completos

### Cenário 1: Fluxo Completo de Sucesso
```
1. Fazer login
2. Ir para "Meus Cursos"
3. Clicar em "Adicionar"
4. Preencher todos os campos corretamente
5. Clicar em "Cadastrar"
6. Verificar notificação de sucesso
7. Verificar novo curso na lista
8. Clicar em "Editar" no curso criado
9. Modificar nome e descrição
10. Clicar em "Atualizar"
11. Verificar mudanças na lista
12. Clicar em "Excluir"
13. Confirmar exclusão
14. Verificar que o curso foi removido
```

### Cenário 2: Validações e Erros
```
1. Acessar formulário de novo curso
2. Deixar todos os campos vazios
3. Clicar em "Cadastrar"
4. Verificar mensagens de erro nos campos
5. Preencher nome com menos de 3 caracteres
6. Verificar erro específico
7. Corrigir nome
8. Preencher descrição com menos de 10 caracteres
9. Verificar erro específico
10. Corrigir todos os erros
11. Cadastrar com sucesso
```

### Cenário 3: Cancelamentos
```
1. Acessar formulário de novo curso
2. Preencher metade dos campos
3. Clicar em "Cancelar"
4. Verificar que voltou para listagem
5. Verificar que dados NÃO foram salvos
6. Acessar formulário novamente
7. Preencher todos os campos
8. Clicar em "Limpar"
9. Verificar que campos foram resetados
10. Cancelar e voltar
```

---

## 🐛 Problemas Comuns

### Formulário não aparece
```
Possível causa: Backend não está rodando
Solução: 
1. Verificar se a API está rodando
2. Verificar URL no environment.development.ts
3. Verificar console do navegador para erros
```

### Categorias não carregam
```
Possível causa: Endpoint de categorias não funciona
Solução:
1. Abrir DevTools → Network
2. Verificar se GET /api/categorias retorna 200
3. Verificar se o token JWT está sendo enviado
```

### Erro ao salvar
```
Possível causa: Validação no backend ou autenticação
Solução:
1. Verificar console do navegador
2. Verificar Network → Response
3. Verificar se token é válido
4. Verificar estrutura dos dados enviados
```

---

## ✅ Checklist Final de Testes

### Funcionalidades
- [ ] Criar curso com sucesso
- [ ] Editar curso com sucesso
- [ ] Excluir curso com sucesso
- [ ] Cancelar criação/edição
- [ ] Limpar formulário

### Validações
- [ ] Campos obrigatórios validados
- [ ] Tamanhos mínimos/máximos validados
- [ ] Mensagens de erro aparecem
- [ ] Form fica inválido quando necessário

### Visual
- [ ] Ícones aparecem corretamente
- [ ] Cores do gradiente funcionam
- [ ] Tooltips aparecem no hover
- [ ] Animações funcionam suavemente
- [ ] Responsivo funciona (mobile)

### Notificações
- [ ] Sucesso (verde) aparece
- [ ] Erro (vermelho) aparece
- [ ] Aviso (laranja) aparece
- [ ] Notificações desaparecem após 4s

### Loading
- [ ] Spinner ao carregar categorias
- [ ] Spinner ao carregar curso (edição)
- [ ] Botão "Salvando..." ao submeter
- [ ] Botões desabilitados durante loading

---

## 📸 Como Reportar Bugs

Se encontrar algum problema:

1. **Tire um screenshot**
2. **Abra o console** (F12)
3. **Copie erros** (se houver)
4. **Descreva o passo a passo** para reproduzir

Exemplo:
```
Bug: Formulário não salva
Passos:
1. Acessar /cursos/novo
2. Preencher nome: "Teste"
3. Preencher descrição: "Teste curso"
4. Selecionar categoria: Frontend
5. Clicar em Cadastrar
6. Erro no console: [copiar erro aqui]
```

---

## 🎉 Teste Concluído!

Se todos os itens acima funcionaram, o formulário está **100% operacional**! 🚀

---

**Boa Sorte nos Testes!** 🧪✨

