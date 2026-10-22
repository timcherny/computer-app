import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL(`${process.env.COMPUTER_SHARE_OUTPUT || 'release/share-apple-silicon'}/`, root);
const { version } = JSON.parse(await readFile(new URL('apps/desktop/package.json', root), 'utf8'));
const verificationDirectory = await mkdtemp(path.join(tmpdir(), 'computer-share-check-'));
try {
  const zip = fileURLToPath(new URL(`Computer-${version}-mac-arm64.zip`, output));
  execFileSync('/usr/bin/ditto', ['-x', '-k', zip, verificationDirectory], { stdio: 'inherit' });
  execFileSync('/usr/bin/codesign', ['--verify', '--deep', '--strict', '--verbose=2', path.join(verificationDirectory, 'Computer.app')], { stdio: 'inherit' });
  if (process.env.COMPUTER_TRUSTED_RELEASE === '1') {
    execFileSync('/usr/bin/xcrun', ['stapler', 'validate', path.join(verificationDirectory, 'Computer.app')], { stdio: 'inherit' });
    execFileSync('/usr/sbin/spctl', ['--assess', '--type', 'execute', '--verbose=2', path.join(verificationDirectory, 'Computer.app')], { stdio: 'inherit' });
  }
} finally {
  await rm(verificationDirectory, { recursive: true, force: true });
}
for (const [source, target] of [
  ['docs/share-prototype.md', 'READ-ME-FIRST.md'],
  ['docs/electron-handoff.md', 'AI-HANDOFF.md'],
]) await copyFile(new URL(source, root), new URL(target, output));

const checksums = [];
for (const extension of ['dmg', 'zip']) {
  const filename = `Computer-${version}-mac-arm64.${extension}`;
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(new URL(filename, output))) hash.update(chunk);
  checksums.push(`${hash.digest('hex')}  ${filename}`);
}
await writeFile(new URL('SHA256SUMS.txt', output), `${checksums.join('\n')}\n`);
console.log(`Share the DMG or ZIP and READ-ME-FIRST.md from ${fileURLToPath(output)}`);
