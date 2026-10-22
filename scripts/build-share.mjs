import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

if (process.platform !== 'darwin' || process.arch !== 'arm64') {
  throw new Error('Trusted share builds require an Apple Silicon Mac.');
}
const root = fileURLToPath(new URL('../', import.meta.url));
const profile = process.env.APPLE_KEYCHAIN_PROFILE || 'Computer-notary';
const output = 'release/signed-apple-silicon';
const env = { ...process.env, APPLE_KEYCHAIN_PROFILE: profile, COMPUTER_SHARE_OUTPUT: output, COMPUTER_TRUSTED_RELEASE: '1' };
const run = (command, args, options = {}) => execFileSync(command, args, { cwd: root, env, stdio: 'inherit', ...options });
const identities = run('/usr/bin/security', ['find-identity', '-v', '-p', 'codesigning'], { encoding: 'utf8', stdio: 'pipe' });
const matches = [...identities.matchAll(/([A-F0-9]{40}) "(Developer ID Application:[^"]+)"/g)];
const identity = process.env.COMPUTER_SIGNING_IDENTITY || (matches.length === 1 ? matches[0][1] : null);
if (!identity || !matches.some(match => match[1] === identity || match[2] === identity)) {
  throw new Error('One valid Developer ID Application identity is required. If multiple exist, set COMPUTER_SIGNING_IDENTITY to its hash.');
}
// Fail before building if credentials are missing or revoked; never silently skip notarization.
run('xcrun', ['notarytool', 'history', '--keychain-profile', profile], { stdio: 'pipe' });
run('npm', ['run', 'build']);
run('npm', ['run', 'package:share', '--workspace', '@computer/desktop', '--',
  `-c.directories.output=../../${output}`, `-c.mac.identity=${identity}`,
  '-c.mac.notarize=true', '-c.forceCodeSigning=true', '-c.dmg.sign=true']);

const { version } = JSON.parse(await readFile(path.join(root, 'apps/desktop/package.json'), 'utf8'));
const dmg = path.join(root, output, `Computer-${version}-mac-arm64.dmg`);
// The app is notarized/stapled by electron-builder before ZIP creation. Also
// notarize/staple the signed DMG so its ticket travels with the installer.
run('xcrun', ['notarytool', 'submit', dmg, '--keychain-profile', profile, '--wait', '--timeout', '30m']);
run('xcrun', ['stapler', 'staple', dmg]);
run('xcrun', ['stapler', 'validate', dmg]);
run('/usr/sbin/spctl', ['--assess', '--type', 'open', '--context', 'context:primary-signature', '--verbose=2', dmg]);
run(process.execPath, ['scripts/prepare-share.mjs']);
