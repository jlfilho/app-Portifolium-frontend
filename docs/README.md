# Documentacao do Frontend

Esta pasta concentra a documentacao tecnica do frontend do app-Portifolium.

## Estrutura

```text
docs/
├── README.md
├── INDEX.md
├── standards/
├── features/
└── archive/
```

## standards

Documentacao viva sobre convencoes e padroes de manutencao:

- nomenclatura
- botoes
- breakpoints
- empty states
- servicos de mensagem
- constantes de mensagem
- validacao
- temas e paleta visual
- testes

Consulte `docs/standards/` antes de alterar componentes compartilhados, mensagens, formularios, validacoes ou estilos recorrentes.

## features

Documentacao viva de funcionalidades e modulos ainda relevantes:

- dashboard
- atividades
- evidencias
- fontes financiadoras
- cursos
- permissoes de curso
- autenticacao/token
- dialogos compartilhados

Consulte `docs/features/` antes de alterar fluxos de negocio ou telas de modulo.

## archive

Historico de implementacoes, correcoes, troubleshooting e registros de organizacao.

Arquivos em `docs/archive/` devem ser tratados como referencia historica. Antes de seguir uma orientacao arquivada, confirme no codigo atual se ela ainda se aplica.

## Regras

- Mantenha `README.md` na raiz do projeto apenas para apresentacao e setup.
- Mantenha `AGENTS.md` curto, com regras operacionais para agentes.
- Novos padroes devem ir para `docs/standards/`.
- Novas documentacoes de modulo devem ir para `docs/features/`.
- Registros pontuais de correcao ou investigacao devem ir para `docs/archive/`, ou ser omitidos se o Git ja registrar a mudanca com clareza.
