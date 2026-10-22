import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const desktopRoot = path.join(root, 'apps/desktop');
const requireDesktop = createRequire(path.join(desktopRoot, 'package.json'));
const electron = requireDesktop('electron');
let server;
let desktop;
let stopping = false;

async function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  if (desktop && desktop.exitCode === null && desktop.signalCode === null) {
    desktop.kill('SIGTERM');
  }
  await server?.close();
  process.exitCode = exitCode;
}

process.once('SIGINT', () => void stop());
process.once('SIGTERM', () => void stop());

try {
  server = await createServer({
    root: path.join(root, 'apps/web'),
    configFile: path.join(root, 'apps/web/vite.config.js'),
    clearScreen: false,
  });
  await server.listen();
  server.printUrls();

  const env = { ...process.env, COMPUTER_RENDERER_URL: 'http://127.0.0.1:5175' };
  // Some editor terminals inherit this flag; the desktop needs Electron's GUI mode.
  delete env.ELECTRON_RUN_AS_NODE;
  desktop = spawn(electron, [desktopRoot], { cwd: root, env, stdio: 'inherit' });
  desktop.once('error', (error) => {
    console.error('Could not launch Computer:', error);
    void stop(1);
  });
  desktop.once('exit', (code, signal) => {
    void stop(code ?? (signal === 'SIGTERM' ? 0 : 1));
  });
} catch (error) {
  console.error('Could not start Computer:', error);
  await stop(1);
}
