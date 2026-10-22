import { cp, copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const staging = await mkdtemp(path.join(tmpdir(), 'computer-web-deploy-'));
try {
  // Upload only the built public renderer, not source, desktop builds or local profiles.
  await cp(new URL('apps/web/dist/', root), staging, { recursive: true });
  await copyFile(new URL('vercel.static.json', root), path.join(staging, 'vercel.json'));
  const args = ['--yes', 'vercel@65.0.0', 'deploy', staging, '--prod', '--yes',
    '--project', process.env.COMPUTER_VERCEL_PROJECT || 'computer-prototype', '--create-if-missing'];
  if (process.env.COMPUTER_VERCEL_SCOPE) args.push('--scope', process.env.COMPUTER_VERCEL_SCOPE);
  const code = await new Promise((resolve, reject) => {
    const child = spawn('npx', args, { cwd: fileURLToPath(root), stdio: 'inherit', env: process.env });
    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });
  process.exitCode = code;
} finally {
  await rm(staging, { recursive: true, force: true });
}
