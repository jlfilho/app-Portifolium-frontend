import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(frontendRoot, '..');
const backendRoot = path.join(workspaceRoot, 'app-Portifolium-api-restfull');
const composeFile = path.join(backendRoot, 'docker-compose.yml');

const frontendPort = process.env.FRONTEND_PORT ?? '4300';
const appPort = process.env.APP_PORT ?? '18080';
const postgresPort = process.env.POSTGRES_PORT ?? '15432';

const env = {
  ...process.env,
  FRONTEND_PORT: frontendPort,
  APP_PORT: appPort,
  POSTGRES_PORT: postgresPort,
  JWT_SECRET_KEY:
    process.env.JWT_SECRET_KEY ??
    'MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=',
  APP_CORS_ALLOWED_ORIGINS:
    process.env.APP_CORS_ALLOWED_ORIGINS ?? `http://localhost:${frontendPort},http://127.0.0.1:${frontendPort}`,
  FRONTEND_URL: process.env.FRONTEND_URL ?? `http://localhost:${frontendPort}`,
  SPRING_JPA_HIBERNATE_DDL_AUTO: process.env.SPRING_JPA_HIBERNATE_DDL_AUTO ?? 'create-drop',
  SPRING_SQL_INIT_MODE: process.env.SPRING_SQL_INIT_MODE ?? 'always'
};

const dockerCompose = ['compose', '-f', composeFile];
const resetContainers = process.env.E2E_RESET_CONTAINERS !== 'false';

function runDockerCompose(args) {
  const result = spawnSync('docker', [...dockerCompose, ...args], {
    cwd: backendRoot,
    env,
    stdio: 'inherit',
    shell: false
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (resetContainers) {
  runDockerCompose(['down', '-v', '--remove-orphans']);
}

const result = spawnSync(
  'docker',
  [
    ...dockerCompose,
    '--profile',
    'e2e',
    'up',
    '--build',
    '--abort-on-container-exit',
    '--exit-code-from',
    'e2e',
    '--remove-orphans'
  ],
  {
    cwd: backendRoot,
    env,
    stdio: 'inherit',
    shell: false
  }
);

if (resetContainers) {
  spawnSync('docker', [...dockerCompose, 'down', '-v', '--remove-orphans'], {
    cwd: backendRoot,
    env,
    stdio: 'inherit',
    shell: false
  });
}

process.exit(result.status ?? 1);
