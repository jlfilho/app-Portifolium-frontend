# Frontend Agent Instructions

Responda em portugues do Brasil.

## Escopo

Este repositorio contem o frontend Angular do app-Portifolium.

## Regras de Trabalho

- Preserve os padroes de componentes standalone ja usados no projeto.
- Use Angular Material seguindo os componentes e estilos existentes.
- Mantenha URLs de API em `src/environments`.
- Use `MessageService`, `messages.constants` e utilitarios existentes para mensagens ao usuario.
- Antes de alterar formularios, confira validacoes e helpers compartilhados.
- Antes de alterar telas ou fluxos de modulo, consulte `docs/features/`.
- Antes de alterar padroes visuais, mensagens, validacao ou nomenclatura, consulte `docs/standards/`.
- Nao use documentos de `docs/archive/` como regra atual sem confirmar no codigo.
- Rode `npm run build` antes de finalizar alteracoes de frontend.

## Fluxo Git Padrao

Este workspace tem dois repositorios Git separados:

- Backend/API: `app-Portifolium-api-restfull`
- Frontend: `app-Portifolium-frontend`

Siga este fluxo para ambos os projetos:

1. Identifique qual repositorio foi alterado.
2. Nunca misture alteracoes de backend e frontend no mesmo commit.
3. Para qualquer nova feature ou fix, atualize a `main` local dos repositorios afetados a partir de `origin/main` antes de criar branch ou implementar, salvo quando a tarefa exigir uma PR empilhada.
4. Trabalhe a partir de `main` atualizada, salvo quando a tarefa exigir uma PR empilhada.
5. Crie uma branch especifica para a tarefa quando a alteracao ainda nao estiver em `main`.
6. Use nomes de branch descritivos, por exemplo:
   - `codex-backend-ajuste-seguranca`
   - `codex-frontend-versionamento`
   - `codex-docs-organizacao`
7. Implemente apenas o escopo solicitado.
8. Rode a validacao adequada antes do commit:
   - Backend/API: `./mvnw test`
   - Frontend: `npm run build`
9. Faca commit somente dos arquivos alterados pela tarefa.
10. Use mensagens objetivas, por exemplo:
   - `fix: corrigir validacao de curso`
   - `feat: adicionar fluxo de relatorio`
   - `docs: reorganizar documentacao`
   - `chore(release): vX.Y.Z`
11. Envie a branch para `origin`.
12. Abra PR para `main` quando a alteracao nao deve ir direto para `main`.
13. Se a tarefa pedir explicitamente para atualizar `main`, avance `main`, valide, faca push e informe o commit enviado.
14. Ao finalizar, informe repositorio, branch, commit, PR ou destino do push, e validacoes executadas.

## Release

Releases usam SemVer `x.y.z` e tag `vX.Y.Z`.

Use o script da raiz do workspace:

```powershell
.\scripts\release.ps1 patch
.\scripts\release.ps1 minor
.\scripts\release.ps1 major
.\scripts\release.ps1 1.4.2
```

Nao altere versoes manualmente quando o script puder ser usado.

## Documentacao

- Padroes vivos: `docs/standards/`
- Funcionalidades vivas: `docs/features/`
- Historico: `docs/archive/`
