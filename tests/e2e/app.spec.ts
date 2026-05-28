import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const pessoasCsvPath = 'D:\\app-portifolium\\docs\\pessoas.csv';

const pessoaE2E = {
  nome: 'Maria Mara',
  cpf: '512.782.200-89'
};

const pessoaEditadaE2E = {
  nome: 'Mário Andre',
  cpf: '521.150.430-57'
};

const pessoaUsuarioE2E = {
  nome: 'Usuario Vinculo E2E',
  cpf: '267.877.590-96'
};

const usuarioPessoaE2E = {
  email: 'usuario.vinculo.e2e@uea.edu.br',
  senha: 'usuario123'
};

const usuarioNovoE2E = {
  nome: 'Manuel Machado',
  cpf: '147.369.310-19',
  email: 'manuel@uea.edu.br',
  senha: 'manuel123',
  funcao: 'Gerente'
};

const usuarioNovoEditadoE2E = {
  nome: 'Manoel Machado',
  cpf: usuarioNovoE2E.cpf,
  email: 'manoel@uea.edu.br',
  senha: 'manoel123'
};

const unidadeAcademicaE2E = {
  nome: 'Instituto de Computação e Tecnologias Digitais',
  nomeEditado: 'Instituto de Computação e Tecnologias Digitais Aplicadas',
  descricao: 'O Instituto de Computação e Tecnologias Digitais é uma unidade acadêmica voltada ao ensino, pesquisa, extensão e inovação nas áreas de Ciência da Computação, Sistemas de Informação, Engenharia de Software, Inteligência Artificial, Ciência de Dados e Tecnologias Educacionais. A unidade promove formação acadêmica e desenvolvimento de projetos tecnológicos em parceria com instituições públicas, privadas e comunidades, incentivando a transformação digital, a inovação e a inclusão tecnológica.'
};

const tipoCursoE2E = {
  nome: 'Tipo de Curso E2E',
  nomeEditado: 'Tipo de Curso E2E Editado'
};

const tipoAtividadeE2E = {
  nome: 'Tipo de Atividade E2E',
  nomeEditado: 'Tipo de Atividade E2E Editado'
};

const cursoE2E = {
  nome: 'Curso E2E Frontend',
  nomeEditado: 'Curso E2E Frontend Editado',
  descricao: 'Curso criado pelo teste e2e do frontend.',
  descricaoEditada: 'Curso editado pelo teste e2e do frontend.',
  tipoNome: 'Tipo de Curso para Curso E2E',
  unidadeNome: 'Unidade Academica para Curso E2E',
  unidadeDescricao: 'Unidade academica usada como dependencia do teste e2e de curso.'
};

const pessoasCsvE2E = [
  { nome: 'Camila Rodrigues', cpf: '353.277.147-05' },
  { nome: 'Marcos Ferreira', cpf: '474.206.446-16' },
  { nome: 'Patrícia Gomes', cpf: '435.028.362-56' },
  { nome: 'Lucas Martins', cpf: '928.100.204-34' },
  { nome: 'Aline Barbosa', cpf: '405.369.987-87' },
  { nome: 'Rafael Ribeiro', cpf: '386.928.689-06' },
  { nome: 'Beatriz Carvalho', cpf: '429.337.807-39' },
  { nome: 'Eduardo Nunes', cpf: '980.447.394-16' },
  { nome: 'Larissa Mendes', cpf: '767.355.917-04' },
  { nome: 'Gustavo Moreira', cpf: '384.240.308-93' },
  { nome: 'Mariana Rocha', cpf: '003.683.159-08' },
  { nome: 'Felipe Araújo', cpf: '369.824.127-76' },
  { nome: 'Renata Teixeira', cpf: '292.649.202-26' },
  { nome: 'Bruno Cardoso', cpf: '948.958.154-20' },
  { nome: 'Isabela Freitas', cpf: '135.180.789-76' },
  { nome: 'Thiago Monteiro', cpf: '853.410.172-85' },
  { nome: 'Vanessa Castro', cpf: '652.435.950-04' },
  { nome: 'Diego Fernandes', cpf: '029.098.010-04' },
  { nome: 'Priscila Duarte', cpf: '092.883.073-03' },
  { nome: 'Rodrigo Batista', cpf: '271.905.776-29' },
  { nome: 'Natália Correia', cpf: '643.487.010-83' },
  { nome: 'Henrique Vieira', cpf: '709.741.497-99' }
];

test.describe.configure({ mode: 'serial' });

async function loginComoAdmin(page: Page) {
  await page.goto('/login');

  await page.getByLabel(/E-mail/i).fill('admin@uea.edu.br');
  await page.getByLabel(/^Senha$/i).fill('admin123');
  await page.getByRole('button', { name: /Entrar/i }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard/);
}

async function removerPessoaE2E(request: APIRequestContext) {
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      username: 'admin@uea.edu.br',
      password: 'admin123'
    }
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };
  const pessoasParaLimpar = [
    pessoaE2E,
    pessoaEditadaE2E,
    pessoaUsuarioE2E,
    { nome: usuarioNovoE2E.nome, cpf: usuarioNovoE2E.cpf },
    { nome: usuarioNovoEditadoE2E.nome, cpf: usuarioNovoEditadoE2E.cpf },
    ...pessoasCsvE2E
  ];

  for (const pessoaE2EAtual of pessoasParaLimpar) {
    const pessoasResponse = await request.get(`/api/pessoas?nome=${encodeURIComponent(pessoaE2EAtual.nome)}&page=0&size=20`, {
      headers
    });

    if (pessoasResponse.status() === 204) {
      continue;
    }

    expect(pessoasResponse.ok()).toBeTruthy();
    const pessoas = await pessoasResponse.json();
    const registros = pessoas.content ?? [];

    for (const pessoa of registros) {
      if (pessoa.cpf === pessoaE2EAtual.cpf) {
        const deleteResponse = await request.delete(`/api/pessoas/${pessoa.id}`, { headers });
        expect(deleteResponse.status()).toBe(204);
      }
    }
  }
}

async function removerUsuarioE2E(request: APIRequestContext) {
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      username: 'admin@uea.edu.br',
      password: 'admin123'
    }
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };
  const emailsParaLimpar = [usuarioPessoaE2E.email, usuarioNovoE2E.email, usuarioNovoEditadoE2E.email];

  for (const email of emailsParaLimpar) {
    const usuarioResponse = await request.get(`/api/usuarios/email?email=${encodeURIComponent(email)}`, {
      headers
    });

    if (!usuarioResponse.ok()) {
      continue;
    }

    const usuario = await usuarioResponse.json();
    const deleteResponse = await request.delete(`/api/usuarios/${usuario.id}`, { headers });
    expect(deleteResponse.ok()).toBeTruthy();
  }
}

async function removerUnidadeAcademicaE2E(request: APIRequestContext) {
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      username: 'admin@uea.edu.br',
      password: 'admin123'
    }
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };
  const nomesParaLimpar = [unidadeAcademicaE2E.nome, unidadeAcademicaE2E.nomeEditado];

  for (const nome of nomesParaLimpar) {
    const unidadesResponse = await request.get(`/api/unidades-academicas?nome=${encodeURIComponent(nome)}&page=0&size=20`, {
      headers
    });

    if (unidadesResponse.status() === 204) {
      continue;
    }

    expect(unidadesResponse.ok()).toBeTruthy();
    const unidades = await unidadesResponse.json();
    const registros = unidades.content ?? [];

    for (const unidade of registros) {
      if (unidade.nome === nome) {
        const deleteResponse = await request.delete(`/api/unidades-academicas/${unidade.id}`, { headers });
        expect(deleteResponse.ok()).toBeTruthy();
      }
    }
  }
}

async function removerTipoCursoE2E(request: APIRequestContext) {
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      username: 'admin@uea.edu.br',
      password: 'admin123'
    }
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };
  const nomesParaLimpar = [tipoCursoE2E.nome, tipoCursoE2E.nomeEditado];

  for (const nome of nomesParaLimpar) {
    const tiposResponse = await request.get(`/api/tipos-curso?nome=${encodeURIComponent(nome)}&page=0&size=20`, {
      headers
    });

    if (tiposResponse.status() === 204) {
      continue;
    }

    expect(tiposResponse.ok()).toBeTruthy();
    const tipos = await tiposResponse.json();
    const registros = tipos.content ?? [];

    for (const tipo of registros) {
      if (tipo.nome === nome) {
        const deleteResponse = await request.delete(`/api/tipos-curso/${tipo.id}`, { headers });
        expect(deleteResponse.ok()).toBeTruthy();
      }
    }
  }
}

async function removerTipoAtividadeE2E(request: APIRequestContext) {
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      username: 'admin@uea.edu.br',
      password: 'admin123'
    }
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };
  const nomesParaLimpar = [tipoAtividadeE2E.nome, tipoAtividadeE2E.nomeEditado];

  const categoriasResponse = await request.get('/api/categorias?page=0&size=100&sortBy=id&direction=ASC', {
    headers
  });

  if (categoriasResponse.status() === 204) {
    return;
  }

  expect(categoriasResponse.ok()).toBeTruthy();
  const categorias = await categoriasResponse.json();
  const registros = categorias.content ?? [];

  for (const categoria of registros) {
    if (nomesParaLimpar.includes(categoria.nome)) {
      const deleteResponse = await request.delete(`/api/categorias/${categoria.id}`, { headers });
      expect(deleteResponse.ok()).toBeTruthy();
    }
  }
}

async function criarDependenciasCursoE2E(request: APIRequestContext) {
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      username: 'admin@uea.edu.br',
      password: 'admin123'
    }
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };

  const tipoResponse = await request.post('/api/tipos-curso', {
    headers,
    data: { nome: cursoE2E.tipoNome }
  });
  expect(tipoResponse.status()).toBe(201);
  const tipo = await tipoResponse.json();

  const unidadeResponse = await request.post('/api/unidades-academicas', {
    headers,
    data: {
      nome: cursoE2E.unidadeNome,
      descricao: cursoE2E.unidadeDescricao
    }
  });
  expect(unidadeResponse.status()).toBe(201);
  const unidade = await unidadeResponse.json();

  return { tipo, unidade };
}

async function removerCursoE2E(request: APIRequestContext) {
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      username: 'admin@uea.edu.br',
      password: 'admin123'
    }
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };
  const nomesCursoParaLimpar = [cursoE2E.nome, cursoE2E.nomeEditado];

  for (const nome of nomesCursoParaLimpar) {
    const cursosResponse = await request.get(`/api/cursos?nome=${encodeURIComponent(nome)}&page=0&size=20`, {
      headers
    });

    if (cursosResponse.status() === 204) {
      continue;
    }

    expect(cursosResponse.ok()).toBeTruthy();
    const cursos = await cursosResponse.json();
    const registros = cursos.content ?? [];

    for (const curso of registros) {
      if (curso.nome === nome) {
        const deleteResponse = await request.delete(`/api/cursos/${curso.id}`, { headers });
        expect(deleteResponse.ok()).toBeTruthy();
      }
    }
  }

  const tiposResponse = await request.get(`/api/tipos-curso?nome=${encodeURIComponent(cursoE2E.tipoNome)}&page=0&size=20`, {
    headers
  });

  if (tiposResponse.ok() && tiposResponse.status() !== 204) {
    const tipos = await tiposResponse.json();
    const registros = tipos.content ?? [];

    for (const tipo of registros) {
      if (tipo.nome === cursoE2E.tipoNome) {
        const deleteResponse = await request.delete(`/api/tipos-curso/${tipo.id}`, { headers });
        expect(deleteResponse.ok()).toBeTruthy();
      }
    }
  }

  const unidadesResponse = await request.get(`/api/unidades-academicas?nome=${encodeURIComponent(cursoE2E.unidadeNome)}&page=0&size=20`, {
    headers
  });

  if (unidadesResponse.ok() && unidadesResponse.status() !== 204) {
    const unidades = await unidadesResponse.json();
    const registros = unidades.content ?? [];

    for (const unidade of registros) {
      if (unidade.nome === cursoE2E.unidadeNome) {
        const deleteResponse = await request.delete(`/api/unidades-academicas/${unidade.id}`, { headers });
        expect(deleteResponse.ok()).toBeTruthy();
      }
    }
  }
}

async function buscarPessoaPorNome(page: Page, nome: string) {
  const filtroResponse = page.waitForResponse(response =>
    response.url().includes('/api/pessoas') &&
    response.request().method() === 'GET'
  );
  await page.getByLabel(/Buscar por nome/i).fill(nome);
  await filtroResponse;
}

async function buscarUnidadeAcademicaPorNome(page: Page, nome: string) {
  const filtroResponse = page.waitForResponse(response =>
    response.url().includes('/api/unidades-academicas') &&
    response.request().method() === 'GET'
  );
  await page.getByLabel(/Buscar por nome/i).fill(nome);
  await filtroResponse;
}

async function buscarTipoCursoPorNome(page: Page, nome: string) {
  const filtroResponse = page.waitForResponse(response =>
    response.url().includes('/api/tipos-curso') &&
    response.request().method() === 'GET'
  );
  await page.getByLabel(/Buscar tipos de curso/i).fill(nome);
  await filtroResponse;
}

async function buscarTipoAtividadePorNome(page: Page, nome: string) {
  await page.getByLabel(/Buscar tipos de atividades/i).fill(nome);
}

async function buscarCursoPorNome(page: Page, nome: string) {
  const filtroResponse = page.waitForResponse(response =>
    response.url().includes('/api/cursos/usuarios') &&
    response.request().method() === 'GET'
  );
  await page.getByLabel(/Buscar por nome/i).fill(nome);
  await filtroResponse;
}

async function excluirPessoaVisivel(page: Page, pessoa: { nome: string; cpf: string }) {
  await buscarPessoaPorNome(page, pessoa.nome);

  const linhaPessoa = page.getByRole('row').filter({ hasText: pessoa.nome });
  await expect(linhaPessoa).toBeVisible();
  await expect(linhaPessoa.getByRole('cell', { name: pessoa.cpf })).toBeVisible();
  await linhaPessoa.locator('button.app-icon-danger').click();

  await expect(page.getByRole('heading', { name: /Excluir Pessoa/i })).toBeVisible();

  const exclusaoResponse = page.waitForResponse(response =>
    /\/api\/pessoas\/\d+$/.test(response.url()) &&
    response.request().method() === 'DELETE'
  );

  await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Excluir$/i }).click();
  expect((await exclusaoResponse).status()).toBe(204);

  await expect(page.getByRole('cell', { name: pessoa.nome })).toHaveCount(0);
  await expect(page.getByRole('cell', { name: pessoa.cpf })).toHaveCount(0);
}

async function sair(page: Page) {
  await page.locator('.user-menu-button').click();
  await page.getByRole('menuitem', { name: /Sair/i }).click();
  await expect(page).toHaveURL(/\/cursos-publicos/);
}

test('carrega a area publica usando a API real pelo proxy do frontend', async ({ page, request }) => {
  const cursos = await request.get('/api/cursos?page=0&size=1&ativo=true');
  expect(cursos.ok()).toBeTruthy();

  await page.goto('/cursos-publicos');

  await expect(page.getByRole('heading', { name: /Nossos Cursos/i })).toBeVisible();
  await expect(page.getByLabel(/Buscar cursos/i)).toBeVisible();
});

test('permite importar pessoas em lote por CSV e remover os cadastros', async ({ page, request }) => {
  test.setTimeout(120_000);

  await removerPessoaE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/pessoas');

    await expect(page.getByRole('heading', { name: /Pessoas/i })).toBeVisible();

    const importacaoResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas/import') &&
      response.request().method() === 'POST'
    );
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /Importar CSV/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(pessoasCsvPath);
    expect((await importacaoResponse).status()).toBe(201);

    await expect(page.getByText('Importação concluída', { exact: true })).toBeVisible();

    await buscarPessoaPorNome(page, pessoasCsvE2E[0].nome);
    await expect(page.getByRole('cell', { name: pessoasCsvE2E[0].nome })).toBeVisible();
    await expect(page.getByRole('cell', { name: pessoasCsvE2E[0].cpf })).toBeVisible();

    for (const pessoa of pessoasCsvE2E) {
      await excluirPessoaVisivel(page, pessoa);
    }
  } finally {
    await removerPessoaE2E(request);
  }
});

test('permite login com usuario seed da API real', async ({ page }) => {
  await loginComoAdmin(page);
  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
});

test('permite cadastrar pessoa como administrador', async ({ page, request }) => {
  await removerPessoaE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/pessoas/novo');

    await expect(page.getByText('Cadastrar Pessoa')).toBeVisible();

    await page.getByLabel(/Nome completo/i).fill(pessoaE2E.nome);
    await page.getByLabel(/^CPF$/i).fill(pessoaE2E.cpf);

    const cadastroResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroResponse).status()).toBe(201);

    await expect(page).toHaveURL(/\/admin\/pessoas$/);

    const filtroResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'GET'
    );
    await page.getByLabel(/Buscar por nome/i).fill(pessoaE2E.nome);
    await filtroResponse;

    await expect(page.getByRole('cell', { name: pessoaE2E.nome })).toBeVisible();
    await expect(page.getByRole('cell', { name: pessoaE2E.cpf })).toBeVisible();
  } finally {
    await removerPessoaE2E(request);
  }
});

test('permite editar pessoa cadastrada como administrador', async ({ page, request }) => {
  await removerPessoaE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/pessoas/novo');

    await expect(page.getByText('Cadastrar Pessoa')).toBeVisible();

    await page.getByLabel(/Nome completo/i).fill(pessoaE2E.nome);
    await page.getByLabel(/^CPF$/i).fill(pessoaE2E.cpf);

    const cadastroResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/pessoas$/);

    const filtroCadastroResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'GET'
    );
    await page.getByLabel(/Buscar por nome/i).fill(pessoaE2E.nome);
    await filtroCadastroResponse;

    const linhaPessoa = page.getByRole('row').filter({ hasText: pessoaE2E.nome });
    await expect(linhaPessoa).toBeVisible();
    await linhaPessoa.locator('button.app-icon-edit').click();

    await expect(page).toHaveURL(/\/admin\/pessoas\/editar\/\d+$/);
    await expect(page.getByText('Editar Pessoa')).toBeVisible();

    await page.getByLabel(/Nome completo/i).fill(pessoaEditadaE2E.nome);
    await page.getByLabel(/^CPF$/i).fill(pessoaEditadaE2E.cpf);

    const atualizacaoResponse = page.waitForResponse(response =>
      /\/api\/pessoas\/\d+$/.test(response.url()) &&
      response.request().method() === 'PUT'
    );

    await page.getByRole('button', { name: /^Atualizar$/i }).click();
    expect((await atualizacaoResponse).status()).toBe(200);
    await expect(page).toHaveURL(/\/admin\/pessoas$/);

    const filtroEdicaoResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'GET'
    );
    await page.getByLabel(/Buscar por nome/i).fill(pessoaEditadaE2E.nome);
    await filtroEdicaoResponse;

    await expect(page.getByRole('cell', { name: pessoaEditadaE2E.nome })).toBeVisible();
    await expect(page.getByRole('cell', { name: pessoaEditadaE2E.cpf })).toBeVisible();
  } finally {
    await removerPessoaE2E(request);
  }
});

test('permite excluir pessoa cadastrada como administrador', async ({ page, request }) => {
  await removerPessoaE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/pessoas/novo');

    await expect(page.getByText('Cadastrar Pessoa')).toBeVisible();

    await page.getByLabel(/Nome completo/i).fill(pessoaE2E.nome);
    await page.getByLabel(/^CPF$/i).fill(pessoaE2E.cpf);

    const cadastroResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/pessoas$/);

    const filtroCadastroResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'GET'
    );
    await page.getByLabel(/Buscar por nome/i).fill(pessoaE2E.nome);
    await filtroCadastroResponse;

    const linhaPessoa = page.getByRole('row').filter({ hasText: pessoaE2E.nome });
    await expect(linhaPessoa).toBeVisible();
    await linhaPessoa.locator('button.app-icon-danger').click();

    await expect(page.getByRole('heading', { name: /Excluir Pessoa/i })).toBeVisible();

    const exclusaoResponse = page.waitForResponse(response =>
      /\/api\/pessoas\/\d+$/.test(response.url()) &&
      response.request().method() === 'DELETE'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Excluir$/i }).click();
    expect((await exclusaoResponse).status()).toBe(204);

    await expect(page.getByRole('cell', { name: pessoaE2E.nome })).toHaveCount(0);
    await expect(page.getByRole('cell', { name: pessoaE2E.cpf })).toHaveCount(0);
  } finally {
    await removerPessoaE2E(request);
  }
});

test('permite criar usuario para pessoa, logar com ele e remover o usuario como administrador', async ({ page, request }) => {
  test.setTimeout(120_000);

  await removerUsuarioE2E(request);
  await removerPessoaE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/pessoas/novo');

    await expect(page.getByText('Cadastrar Pessoa')).toBeVisible();

    await page.getByLabel(/Nome completo/i).fill(pessoaUsuarioE2E.nome);
    await page.getByLabel(/^CPF$/i).fill(pessoaUsuarioE2E.cpf);

    const cadastroPessoaResponse = page.waitForResponse(response =>
      response.url().includes('/api/pessoas') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroPessoaResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/pessoas$/);

    await buscarPessoaPorNome(page, pessoaUsuarioE2E.nome);

    const linhaPessoa = page.getByRole('row').filter({ hasText: pessoaUsuarioE2E.nome });
    await expect(linhaPessoa).toBeVisible();
    await linhaPessoa.locator('button.app-icon-action').click();

    await expect(page.getByRole('heading', { name: new RegExp(`Criar usuário para ${pessoaUsuarioE2E.nome}`, 'i') })).toBeVisible();
    await page.getByLabel(/E-mail/i).fill(usuarioPessoaE2E.email);
    await page.getByLabel(/Senha provisória/i).fill(usuarioPessoaE2E.senha);

    const cadastroUsuarioResponse = page.waitForResponse(response =>
      response.url().includes('/api/usuarios/pessoa') &&
      response.request().method() === 'POST'
    );
    await page.getByRole('button', { name: /^Criar usuário$/i }).click();
    expect((await cadastroUsuarioResponse).status()).toBe(201);

    await expect(linhaPessoa.locator('mat-icon').filter({ hasText: 'verified_user' })).toBeVisible();

    await sair(page);

    await page.goto('/login');
    await page.getByLabel(/E-mail/i).fill(usuarioPessoaE2E.email);
    await page.getByLabel(/^Senha$/i).fill(usuarioPessoaE2E.senha);
    await page.getByRole('button', { name: /Entrar/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByText(pessoaUsuarioE2E.nome).first()).toBeVisible();

    await sair(page);

    await loginComoAdmin(page);
    await page.goto('/admin/usuarios');

    await expect(page.getByRole('heading', { name: /Gerenciar Usuários/i })).toBeVisible();
    await page.getByLabel(/Buscar usuários/i).fill(usuarioPessoaE2E.email);

    const linhaUsuario = page.getByRole('row').filter({ hasText: usuarioPessoaE2E.email });
    await expect(linhaUsuario).toBeVisible();
    await linhaUsuario.locator('button.app-icon-danger').click();

    await expect(page.getByRole('heading', { name: /Excluir Usuário/i })).toBeVisible();

    const deleteUsuarioResponse = page.waitForResponse(response =>
      /\/api\/usuarios\/\d+$/.test(response.url()) &&
      response.request().method() === 'DELETE'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Sim, Excluir$/i }).click();
    expect((await deleteUsuarioResponse).ok()).toBeTruthy();

    await expect(page.getByRole('cell', { name: usuarioPessoaE2E.email })).toHaveCount(0);
  } finally {
    await removerUsuarioE2E(request);
    await removerPessoaE2E(request);
  }
});

test('permite cadastrar, editar, alterar senha e excluir usuario pelo frontend', async ({ page, request }) => {
  test.setTimeout(120_000);

  await removerUsuarioE2E(request);
  await removerPessoaE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/usuarios');

    await expect(page.getByRole('heading', { name: /Gerenciar Usu/i })).toBeVisible();
    await page.getByRole('button', { name: /Novo Usu/i }).click();

    await expect(page).toHaveURL(/\/admin\/usuarios\/novo$/);
    await expect(page.getByText(/Cadastrar Novo Usu/i)).toBeVisible();

    await page.getByLabel(/Nome Completo/i).fill(usuarioNovoE2E.nome);
    await page.getByLabel(/^Email$/i).fill(usuarioNovoE2E.email);
    await page.getByLabel(/^CPF$/i).fill(usuarioNovoE2E.cpf);
    await page.getByLabel(/^Senha$/i).fill(usuarioNovoE2E.senha);
    await page.getByLabel(/Fun/i).click();
    await page.getByRole('option', { name: new RegExp(`^${usuarioNovoE2E.funcao}$`, 'i') }).click();

    const cadastroUsuarioResponse = page.waitForResponse(response =>
      response.url().includes('/api/usuarios') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroUsuarioResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/usuarios$/);

    await page.getByLabel(/Buscar usu/i).fill(usuarioNovoE2E.email);

    const linhaUsuario = page.getByRole('row').filter({ hasText: usuarioNovoE2E.email });
    await expect(linhaUsuario).toBeVisible();
    await expect(linhaUsuario.getByRole('cell', { name: usuarioNovoE2E.nome })).toBeVisible();
    await linhaUsuario.locator('button.app-icon-edit').click();

    await expect(page).toHaveURL(/\/admin\/usuarios\/editar\/\d+$/);
    await expect(page.getByText(/Editar Usu/i)).toBeVisible();

    await page.getByLabel(/Nome Completo/i).fill(usuarioNovoEditadoE2E.nome);
    await page.getByLabel(/^Email$/i).fill(usuarioNovoEditadoE2E.email);

    const atualizacaoUsuarioResponse = page.waitForResponse(response =>
      /\/api\/usuarios\/\d+$/.test(response.url()) &&
      response.request().method() === 'PUT'
    );

    await page.getByRole('button', { name: /^Atualizar$/i }).click();
    expect((await atualizacaoUsuarioResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/admin\/usuarios$/);

    await page.getByLabel(/Buscar usu/i).fill(usuarioNovoEditadoE2E.email);

    const linhaUsuarioEditado = page.getByRole('row').filter({ hasText: usuarioNovoEditadoE2E.email });
    await expect(linhaUsuarioEditado).toBeVisible();
    await expect(linhaUsuarioEditado.getByRole('cell', { name: usuarioNovoEditadoE2E.nome })).toBeVisible();
    await linhaUsuarioEditado.locator('button.app-icon-password').click();

    await expect(page.getByRole('heading', { name: /Alterar Senha/i })).toBeVisible();
    await page.getByLabel(/Senha Atual/i).fill(usuarioNovoE2E.senha);
    await page.getByRole('textbox', { name: 'Nova Senha', exact: true }).fill(usuarioNovoEditadoE2E.senha);
    await page.getByLabel(/Confirmar Nova Senha/i).fill(usuarioNovoEditadoE2E.senha);

    const trocaSenhaResponse = page.waitForResponse(response =>
      /\/api\/usuarios\/\d+\/change-password$/.test(response.url()) &&
      response.request().method() === 'PUT'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Alterar Senha$/i }).click();
    expect((await trocaSenhaResponse).ok()).toBeTruthy();

    await page.getByLabel(/Buscar usu/i).fill(usuarioNovoEditadoE2E.email);

    const linhaUsuarioParaExcluir = page.getByRole('row').filter({ hasText: usuarioNovoEditadoE2E.email });
    await expect(linhaUsuarioParaExcluir).toBeVisible();
    await linhaUsuarioParaExcluir.locator('button.app-icon-danger').click();

    await expect(page.getByRole('heading', { name: /Excluir Usu/i })).toBeVisible();

    const deleteUsuarioResponse = page.waitForResponse(response =>
      /\/api\/usuarios\/\d+$/.test(response.url()) &&
      response.request().method() === 'DELETE'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Sim, Excluir$/i }).click();
    expect((await deleteUsuarioResponse).ok()).toBeTruthy();

    await expect(page.getByRole('cell', { name: usuarioNovoEditadoE2E.email })).toHaveCount(0);
  } finally {
    await removerUsuarioE2E(request);
    await removerPessoaE2E(request);
  }
});

test('permite cadastrar, editar e excluir unidade academica pelo frontend', async ({ page, request }) => {
  await removerUnidadeAcademicaE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/unidades-academicas');

    await expect(page.getByRole('heading', { name: /Unidades Acad/i })).toBeVisible();
    await page.getByRole('button', { name: /Nova Unidade/i }).click();

    await expect(page).toHaveURL(/\/admin\/unidades-academicas\/novo$/);
    await expect(page.getByText(/Cadastrar Unidade Acad/i)).toBeVisible();

    await page.getByLabel(/Nome da Unidade/i).fill(unidadeAcademicaE2E.nome);
    await page.getByLabel(/Descri/i).fill(unidadeAcademicaE2E.descricao);

    const cadastroUnidadeResponse = page.waitForResponse(response =>
      response.url().includes('/api/unidades-academicas') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroUnidadeResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/unidades-academicas$/);

    await buscarUnidadeAcademicaPorNome(page, unidadeAcademicaE2E.nome);

    const linhaUnidade = page.getByRole('row').filter({ hasText: unidadeAcademicaE2E.nome });
    await expect(linhaUnidade).toBeVisible();
    await linhaUnidade.locator('button.app-icon-edit').click();

    await expect(page).toHaveURL(/\/admin\/unidades-academicas\/editar\/\d+$/);
    await expect(page.getByText(/Editar Unidade Acad/i)).toBeVisible();

    await page.getByLabel(/Nome da Unidade/i).fill(unidadeAcademicaE2E.nomeEditado);

    const atualizacaoUnidadeResponse = page.waitForResponse(response =>
      /\/api\/unidades-academicas\/\d+$/.test(response.url()) &&
      response.request().method() === 'PUT'
    );

    await page.getByRole('button', { name: /^Atualizar$/i }).click();
    expect((await atualizacaoUnidadeResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/admin\/unidades-academicas$/);

    await buscarUnidadeAcademicaPorNome(page, unidadeAcademicaE2E.nomeEditado);

    const linhaUnidadeEditada = page.getByRole('row').filter({ hasText: unidadeAcademicaE2E.nomeEditado });
    await expect(linhaUnidadeEditada).toBeVisible();
    await expect(linhaUnidadeEditada.getByRole('cell', { name: unidadeAcademicaE2E.nomeEditado })).toBeVisible();
    await linhaUnidadeEditada.locator('button.app-icon-danger').click();

    await expect(page.getByRole('heading', { name: /Excluir Unidade Acad/i })).toBeVisible();

    const deleteUnidadeResponse = page.waitForResponse(response =>
      /\/api\/unidades-academicas\/\d+$/.test(response.url()) &&
      response.request().method() === 'DELETE'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Sim, excluir$/i }).click();
    expect((await deleteUnidadeResponse).ok()).toBeTruthy();

    await expect(page.getByRole('cell', { name: unidadeAcademicaE2E.nomeEditado })).toHaveCount(0);
  } finally {
    await removerUnidadeAcademicaE2E(request);
  }
});

test('permite cadastrar, editar e excluir tipo de curso pelo frontend', async ({ page, request }) => {
  await removerTipoCursoE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/tipos-curso');

    await expect(page.locator('acadmanage-lista-tipos-curso').getByText('Tipos de Cursos', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Novo Tipo/i }).click();

    await expect(page).toHaveURL(/\/admin\/tipos-curso\/novo$/);
    await expect(page.getByText(/Cadastrar Tipo de Curso/i)).toBeVisible();

    await page.getByLabel(/^Nome$/i).fill(tipoCursoE2E.nome);

    const cadastroTipoResponse = page.waitForResponse(response =>
      response.url().includes('/api/tipos-curso') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroTipoResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/tipos-curso$/);

    await buscarTipoCursoPorNome(page, tipoCursoE2E.nome);

    const linhaTipo = page.getByRole('row').filter({ hasText: tipoCursoE2E.nome });
    await expect(linhaTipo).toBeVisible();
    await linhaTipo.locator('button.app-icon-edit').click();

    await expect(page).toHaveURL(/\/admin\/tipos-curso\/editar\/\d+$/);
    await expect(page.getByText(/Editar Tipo de Curso/i)).toBeVisible();

    await page.getByLabel(/^Nome$/i).fill(tipoCursoE2E.nomeEditado);

    const atualizacaoTipoResponse = page.waitForResponse(response =>
      /\/api\/tipos-curso\/\d+$/.test(response.url()) &&
      response.request().method() === 'PUT'
    );

    await page.getByRole('button', { name: /^Atualizar$/i }).click();
    expect((await atualizacaoTipoResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/admin\/tipos-curso$/);

    await buscarTipoCursoPorNome(page, tipoCursoE2E.nomeEditado);

    const linhaTipoEditado = page.getByRole('row').filter({ hasText: tipoCursoE2E.nomeEditado });
    await expect(linhaTipoEditado).toBeVisible();
    await expect(linhaTipoEditado.getByRole('cell', { name: tipoCursoE2E.nomeEditado })).toBeVisible();
    await linhaTipoEditado.locator('button.app-icon-danger').click();

    await expect(page.getByRole('heading', { name: /Excluir Tipo de Curso/i })).toBeVisible();

    const deleteTipoResponse = page.waitForResponse(response =>
      /\/api\/tipos-curso\/\d+$/.test(response.url()) &&
      response.request().method() === 'DELETE'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Excluir$/i }).click();
    expect((await deleteTipoResponse).ok()).toBeTruthy();

    await expect(page.getByRole('cell', { name: tipoCursoE2E.nomeEditado })).toHaveCount(0);
  } finally {
    await removerTipoCursoE2E(request);
  }
});

test('permite cadastrar, editar e excluir tipo de atividade pelo frontend', async ({ page, request }) => {
  await removerTipoAtividadeE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/categorias');

    await expect(page.getByRole('heading', { name: /Tipos de Atividades/i })).toBeVisible();
    await page.getByRole('button', { name: /Novo Tipo/i }).click();

    await expect(page).toHaveURL(/\/admin\/categorias\/novo$/);
    await expect(page.getByText(/Novo Tipo de Atividade/i)).toBeVisible();

    await page.getByLabel(/Nome do Tipo de Atividade/i).fill(tipoAtividadeE2E.nome);

    const cadastroTipoAtividadeResponse = page.waitForResponse(response =>
      response.url().includes('/api/categorias') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroTipoAtividadeResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/categorias$/);

    await buscarTipoAtividadePorNome(page, tipoAtividadeE2E.nome);

    const linhaTipoAtividade = page.getByRole('row').filter({ hasText: tipoAtividadeE2E.nome });
    await expect(linhaTipoAtividade).toBeVisible();
    await linhaTipoAtividade.locator('button.app-icon-edit').click();

    await expect(page).toHaveURL(/\/admin\/categorias\/editar\/\d+$/);
    await expect(page.getByText(/Editar Tipo de Atividade/i)).toBeVisible();

    await page.getByLabel(/Nome do Tipo de Atividade/i).fill(tipoAtividadeE2E.nomeEditado);

    const atualizacaoTipoAtividadeResponse = page.waitForResponse(response =>
      /\/api\/categorias\/\d+$/.test(response.url()) &&
      response.request().method() === 'PUT'
    );

    await page.getByRole('button', { name: /^Atualizar$/i }).click();
    expect((await atualizacaoTipoAtividadeResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/admin\/categorias$/);

    await buscarTipoAtividadePorNome(page, tipoAtividadeE2E.nomeEditado);

    const linhaTipoAtividadeEditado = page.getByRole('row').filter({ hasText: tipoAtividadeE2E.nomeEditado });
    await expect(linhaTipoAtividadeEditado).toBeVisible();
    await expect(linhaTipoAtividadeEditado.getByRole('cell', { name: tipoAtividadeE2E.nomeEditado })).toBeVisible();
    await linhaTipoAtividadeEditado.locator('button.app-icon-danger').click();

    await expect(page.getByRole('heading', { name: /Confirmar Exclus/i })).toBeVisible();

    const deleteTipoAtividadeResponse = page.waitForResponse(response =>
      /\/api\/categorias\/\d+$/.test(response.url()) &&
      response.request().method() === 'DELETE'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Excluir$/i }).click();
    expect((await deleteTipoAtividadeResponse).ok()).toBeTruthy();

    await expect(page.getByRole('cell', { name: tipoAtividadeE2E.nomeEditado })).toHaveCount(0);
  } finally {
    await removerTipoAtividadeE2E(request);
  }
});

test('permite cadastrar, editar e excluir curso pelo frontend', async ({ page, request }) => {
  test.setTimeout(120_000);

  await removerCursoE2E(request);
  await criarDependenciasCursoE2E(request);

  try {
    await loginComoAdmin(page);
    await page.goto('/admin/cursos');

    await expect(page.getByText(/Meus Cursos/i)).toBeVisible();
    await page.getByRole('button', { name: /Novo Curso/i }).click();

    await expect(page).toHaveURL(/\/admin\/cursos\/novo$/);
    await expect(page.getByText(/Cadastrar Novo Curso/i)).toBeVisible();

    await page.getByLabel(/Nome do Curso/i).fill(cursoE2E.nome);
    await page.getByLabel(/Tipo de Curso/i).click();
    await page.getByRole('option', { name: cursoE2E.tipoNome }).click();

    const buscaUnidadeResponse = page.waitForResponse(response =>
      response.url().includes('/api/unidades-academicas') &&
      response.request().method() === 'GET'
    );
    await page.getByLabel(/Unidade Acad/i).fill(cursoE2E.unidadeNome);
    await buscaUnidadeResponse;
    await page.getByRole('option', { name: cursoE2E.unidadeNome }).click();

    await page.getByLabel(/Descri/i).fill(cursoE2E.descricao);

    const cadastroCursoResponse = page.waitForResponse(response =>
      response.url().includes('/api/cursos') &&
      response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: /^Cadastrar$/i }).click();
    expect((await cadastroCursoResponse).status()).toBe(201);
    await expect(page).toHaveURL(/\/admin\/cursos$/);

    await buscarCursoPorNome(page, cursoE2E.nome);

    const cardCurso = page.locator('mat-card.card').filter({ hasText: cursoE2E.nome });
    await expect(cardCurso).toBeVisible();
    await expect(cardCurso.getByText(cursoE2E.tipoNome)).toBeVisible();
    await cardCurso.locator('button.app-icon-edit').click();

    await expect(page).toHaveURL(/\/admin\/cursos\/editar\/\d+$/);
    await expect(page.getByText(/Editar Curso/i)).toBeVisible();

    await page.getByLabel(/Nome do Curso/i).fill(cursoE2E.nomeEditado);
    await page.getByLabel(/Descri/i).fill(cursoE2E.descricaoEditada);

    const atualizacaoCursoResponse = page.waitForResponse(response =>
      /\/api\/cursos\/\d+$/.test(response.url()) &&
      response.request().method() === 'PUT'
    );

    await page.getByRole('button', { name: /^Atualizar$/i }).click();
    expect((await atualizacaoCursoResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/admin\/cursos$/);

    await buscarCursoPorNome(page, cursoE2E.nomeEditado);

    const cardCursoEditado = page.locator('mat-card.card').filter({ hasText: cursoE2E.nomeEditado });
    await expect(cardCursoEditado).toBeVisible();
    await expect(cardCursoEditado.getByText(cursoE2E.tipoNome)).toBeVisible();
    await cardCursoEditado.locator('button.app-icon-danger').click();

    await expect(page.getByRole('heading', { name: /Excluir Curso/i })).toBeVisible();

    const deleteCursoResponse = page.waitForResponse(response =>
      /\/api\/cursos\/\d+$/.test(response.url()) &&
      response.request().method() === 'DELETE'
    );

    await page.locator('.cdk-overlay-pane').getByRole('button', { name: /^Sim, Excluir$/i }).click();
    expect((await deleteCursoResponse).status()).toBe(204);

    await expect(page.locator('mat-card.card').filter({ hasText: cursoE2E.nomeEditado })).toHaveCount(0);
  } finally {
    await removerCursoE2E(request);
  }
});
