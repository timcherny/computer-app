import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const build = fileURLToPath(new URL('../apps/desktop/build/', import.meta.url));
const temporary = await mkdtemp(path.join(tmpdir(), 'computer-icon-'));
try {
  const iconset = path.join(temporary, 'Computer.iconset');
  await mkdir(iconset);
  execFileSync('/usr/bin/swift', [fileURLToPath(new URL('./render-mac-icon.swift', import.meta.url)), path.join(build, 'icon-source.png'), path.join(build, 'icon.png')], { stdio: 'inherit' });
  for (const size of [16, 32, 128, 256, 512]) {
    for (const scale of [1, 2]) {
      execFileSync('/usr/bin/sips', ['-z', String(size * scale), String(size * scale), path.join(build, 'icon.png'), '--out', path.join(iconset, `icon_${size}x${size}${scale === 2 ? '@2x' : ''}.png`)], { stdio: 'ignore' });
    }
  }
  execFileSync('/usr/bin/iconutil', ['-c', 'icns', iconset, '-o', path.join(build, 'icon.icns')], { stdio: 'inherit' });
  console.log('Created icon.icns (16–1024px) and icon.png from icon-source.png.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
