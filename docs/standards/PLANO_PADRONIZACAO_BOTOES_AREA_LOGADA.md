# Plano de Padronizacao de Botoes da Area Logada

## Escopo

Este plano cobre os botoes da area logada do frontend Angular, principalmente em:

- `src/app/dashboard`
- `src/app/features`
- `src/app/shared`

O objetivo e reduzir diferencas visuais e semanticas entre telas, preservando o Angular Material e o guia existente em `docs/standards/GUIA_ESTILO_BOTOES.md`.

## Padrao Alvo

- Acao principal: `mat-raised-button color="primary"` com icone a esquerda.
- Cancelar, voltar e limpar: `mat-stroked-button`, sem `color="primary"` salvo quando houver necessidade clara de destaque.
- Acoes de tabela: `mat-icon-button` com cor por intencao.
- Acoes de card/mobile: usar o mesmo tipo de acao da versao desktop sempre que possivel, evitando alternar com `mat-mini-fab` sem necessidade.
- Botoes de dialogo: acao secundaria primeiro, acao primaria por ultimo, alinhadas a direita.

## Icones Padrao

- Criar: `add`
- Salvar ou atualizar: `save`
- Cancelar ou fechar: `close`
- Voltar: `arrow_back`
- Editar: `edit`
- Excluir ou remover: `delete`
- Visualizar: `visibility`
- Filtrar ou aplicar filtro: `search`
- Limpar filtros: `clear`
- Importar: `file_upload`
- Relatorio PDF: `picture_as_pdf`
- Baixar arquivo: `download`

## Pontos Identificados

### Listas e Cards

- `usuarios/components/lista-usuarios`: desktop usa `mat-icon-button`, enquanto cards mobile usam `mat-mini-fab`.
- `cursos/components/lista-categorias`: desktop usa `mat-icon-button`, enquanto cards mobile usam `mat-mini-fab`.
- `atividades/components/lista-atividades`: cards usam botoes grandes para `Visualizar`, `Editar` e `Excluir`, diferente das demais listas.
- `cursos/components/cards-cursos`: as cores das acoes dependem de `nth-child`, o que e fragil quando a ordem dos botoes muda.
- `cursos/components/lista-tipos-curso`: as cores das acoes tambem dependem de `nth-child`.

### Formularios

- `usuarios/components/form-usuario`: usa `mat-button` para limpar e cancelar, enquanto outros formularios usam `mat-stroked-button`.
- `cursos/components/form-curso`: usa `mat-button` para limpar e cancelar.
- `atividades/components/form-atividade`: o rodape ja esta mais proximo do padrao, mas a tela tem acoes internas com estilos locais.
- `pessoas/components/form-pessoa`, `unidades-academicas/components/form-unidade-academica`, `cursos/components/form-categoria` e `cursos/components/form-tipo-curso`: usam classes locais como `cancel-button`, `submit-button` e `btn-primary` de forma parcialmente redundante.

### Dialogos e Relatorios

- Dialogos de perfil, edicao de perfil, troca de senha, cursos do usuario e novo usuario repetem overrides locais para botoes primarios.
- Relatorios alternam entre `description`, `download`, `Baixar PDF`, `Gerar PDF` e `Relatorio PDF`.
- Cancelar em dialogos alterna entre `mat-button` e `mat-stroked-button`.

### CSS Local

- Existem estilos locais duplicados para botoes primarios que ja sao tratados em `src/styles.css`.
- Existem seletores com `::ng-deep` em componentes para corrigir botoes primarios que deveriam herdar o padrao global.
- Existem classes de acao equivalentes com nomes diferentes, por exemplo `btn-primary`, `submit-button`, `cancel-button`, `btn-editar`, `btn-excluir`, `import-button`.

## Plano de Correcao

1. Revisar o contrato global em `src/styles.css` para garantir um unico comportamento para:
   - botoes primarios;
   - botoes secundarios;
   - botoes de perigo;
   - botoes de icone em tabelas;
   - botoes em rodapes de formulario e dialogo.
2. Atualizar o `GUIA_ESTILO_BOTOES.md` somente se alguma regra do plano precisar virar regra normativa.
3. Padronizar formularios:
   - `Cancelar`: `mat-stroked-button` com `close`;
   - `Limpar formulario`: `mat-stroked-button` ou `mat-button`, conforme definido no guia;
   - `Salvar`, `Atualizar` e `Cadastrar`: `mat-raised-button color="primary"` com `save` ou `add`.
4. Padronizar listas e cards:
   - substituir `mat-mini-fab` em cards mobile por `mat-icon-button` ou por botoes textuais compactos consistentes;
   - remover `nth-child` para cores de acoes e trocar por classes semanticas;
   - alinhar icones, tooltips e cores entre desktop e mobile.
5. Padronizar relatorios e importacao:
   - `picture_as_pdf` para acao de relatorio;
   - `download` para baixar arquivo;
   - `file_upload` para importar.
6. Remover overrides locais redundantes apos confirmar que o global cobre os casos.
7. Validar com `npm run build` e inspecao visual das principais telas da area logada.

## Ordem Recomendada de PRs

### PR 1: Base Global e Formularios

- Ajustar estilos globais necessarios.
- Aplicar padrao nos formularios de usuario, curso, atividade, pessoa, unidade academica, categoria e tipo de curso.
- Validar com `npm run build`.

### PR 2: Listas, Tabelas e Cards

- Padronizar acoes em usuarios, pessoas, cursos, categorias, tipos de curso, unidades academicas e atividades.
- Remover seletores `nth-child` para cores de botoes.
- Validar responsividade em desktop e mobile.

### PR 3: Dialogos, Perfil e Relatorios

- Padronizar botoes de dialogos.
- Padronizar relatorios de curso e atividade.
- Remover overrides locais de botoes primarios quando redundantes.

## Criterios de Aceite

- Botoes com a mesma intencao devem ter o mesmo tipo visual, cor, icone e tooltip em telas diferentes.
- Nenhuma acao secundaria deve parecer acao primaria.
- Nenhuma acao destrutiva deve usar cor primaria.
- Acoes desktop e mobile da mesma tela devem ser semanticamente equivalentes.
- `npm run build` deve passar.
