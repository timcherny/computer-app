# Computer web prototype

Public prototype: https://computer-prototype-hazel.vercel.app

Vercel project: `tim-8121s-projects/computer-prototype`.

This is the same React renderer used by Electron, deployed as static production files. It opens in a browser without installing Electron or signing into Vercel. The fictional examples are bundled; each browser stores its own drafts, messages, canvas state, and preferences locally. There is no shared backend or live AI service. Chip fonts use installed local faces where available, otherwise the configured system fallbacks.

## Publish changes

With Node 24/npm and a Vercel CLI login that has access to the project, run from the project root:

```sh
COMPUTER_VERCEL_SCOPE=tim-8121s-projects npm run deploy:web
```

The script builds `packages/ui` and `apps/web`, stages only `apps/web/dist` plus `vercel.static.json`, deploys to production, and removes its temporary staging directory. Source files, Electron installers, local profiles, and credentials are not uploaded. The production alias stays the same when this project is redeployed. The CLI is pinned to 65.0.0. No Git remote or automatic deployment was configured.

`COMPUTER_VERCEL_PROJECT` can override the default project name `computer-prototype`; use this deliberately, since the deployment command can create a missing project. `COMPUTER_VERCEL_SCOPE` chooses the Vercel team.

## Verification

The initial deployment was published October 21, 2026. An unauthenticated HTTP request returned 200, and the production page rendered its default conversation. Check the production alias after a deploy, including navigation, properties, canvas, message input, and theme behavior. Do not rely only on the CLI's protected preview URL.

The web deployment is independent of the Apple Developer ID certificate/notarization work for the Mac download.
