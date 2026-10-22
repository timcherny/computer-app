const { execFileSync } = require('node:child_process');
const path = require('node:path');

module.exports = async function verifyMacSignature(context) {
  if (context.electronPlatformName !== 'darwin') return;
  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  // A successful local launch does not catch invalid resource seals after packaging.
  // Verify all nested code before any DMG/ZIP is created. This is integrity validation,
  // not Apple Developer ID trust or notarization.
  execFileSync('/usr/bin/codesign', ['--verify', '--deep', '--strict', '--verbose=2', appPath], { stdio: 'inherit' });
};
