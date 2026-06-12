# Multi-App Firebase Functions Playbook

## Scope

Current known mapping:

- `appId: ionic_setup` -> `collection: ZC_ionic_setup`
- `appId: translator` -> `collection: MLT_translations_statistics`

Primary goal:

- Reuse one backend pattern for multiple apps
- Keep contingent statistics structure consistent
- Keep one clear owner for Firebase Functions deployments

Current runtime status:

- `appId` is required by backend callables (strict mode).
- z-control Backend Functions repository is the deployment owner for shared functions.

## Current Source Of Truth

Frontend constants:

- `src/app/shared/app.constants.ts`
  - `FireStoreConstants.COLLECTION_NAME = 'ZC_ionic_setup'`
  - `FireStoreConstants.APP_ID = 'ionic_setup'`

Backend constants:

- `functions/src/shared/app.constants.ts`
  - `FireStoreConstants.COLLECTION_NAME = 'ZC_ionic_setup'`
  - `APP_TO_COLLECTION` map includes `ionic_setup` and `translator`

## Firestore Structure Per App

Use the same subtree for each app root collection.

```text
<collection>/
  userMapping/
    users/
    programmerDevices/
  <YYYY-MM>/
    users/
    meta/
      totalChars
      contingentData
```

Concrete examples:

```text
ZC_ionic_setup/
MLT_translations_statistics/
```

## Contract Rules (Required)

1. FE sends `appId` in callable payloads.
2. BE reads `appId` from `request.data`.
3. BE converts `appId` to collection via `getCollectionByAppId(...)`.
4. BE never accepts a raw collection path from FE.

## Required Callable Payload Pattern

For callables that read/write contingent or user-mapping data, payload must include:

```ts
{
  appId: FireStoreConstants.APP_ID,
  // function-specific fields
}
```

## Backward Compatibility Policy

Migration is complete for current active apps.

- `appId` is mandatory for all relevant callables.
- Requests without valid `appId` should fail with `invalid-argument`.
- No translator fallback is required in the current setup.

## Deployment Ownership Policy (Required)

Only one repository is allowed to deploy shared Firebase Functions:

- Deployment owner: z-control Backend Functions repository
- Non-owner app repositories may include `firebase.json` / `functions` for reference or local testing
- Non-owner app repositories must not deploy shared functions to production

Rationale:

- Prevent accidental overwrite or deletion of functions
- Keep one source of truth for backend behavior
- Reduce drift across copied function folders

## Code Handling Model (Required)

If a new function is added for the translator app, keep the backend implementation in the z-control Backend Functions repository.

- z-control Backend Functions repository is the canonical backend source of truth.
- Translator app repository may stay FE-only for runtime and deployment purposes.
- The translator app does not need a second deployed copy of the backend code.
- If you need shared compile-time types or request shapes, keep them aligned intentionally across repos or extract them into a shared package.
- During local integration testing, run the backend emulator from the z-control Backend Functions repository and point the translator FE at that backend while using `ionic serve`.

In practice:

- Edit BE logic in z-control Backend Functions repository
- Test translator FE against z-control Backend Functions backend/emulator
- Deploy functions only from z-control Backend Functions repository
- Deploy translator FE separately when the UI change is ready

## GitHub Actions Policy Snippet

Copy-paste guardrail for the z-control Backend Functions CI. It blocks shared-functions changes in any repo other than the z-control Backend Functions repository.

```yaml
name: guard-shared-functions
on:
  pull_request:
    paths:
      - "functions/**"
jobs:
  block-non-owner-repos:
    runs-on: ubuntu-latest
    steps:
      - name: Ensure this repo is the z-control Backend Functions repository
        run: |
          if [ "${{ github.repository }}" != "your-org/z-control-ionic-setup" ]; then
            echo "Shared Firebase Functions may only be changed in the setup repository."
            exit 1
          fi
```

## Deployment Safety (Critical)

If multiple apps deploy to the same Firebase project:

- Deploying one repo can replace function implementations with same function names
- Removing a function file can trigger function deletion in deploy flow

To avoid accidental cross-app breakage, prefer one of these:

1. Separate Firebase project per app (safest)
2. Same project with multiple Functions codebases (good compromise)

Single shared codebase in one project requires strict release discipline.

## Setup And Deploy Steps

Run these steps from the setup app repository (deployment owner) only.

1. Build and type-check functions.

```bash
npm --prefix functions run build
```

2. Run tests.

```bash
npm --prefix functions run test
```

3. Validate emulator behavior.

```bash
firebase emulators:start --only functions,firestore
```

4. Deploy functions.

```bash
firebase deploy --only functions
```

## No-Downtime Rollout Sequence

1. Backend update in z-control Backend Functions repository.
2. Deploy functions from z-control Backend Functions repository only.
3. Frontend release(s) for affected app(s).
4. Monitor logs/errors after rollout.

## Checklist Before Every Deploy

- [ ] `request.data.appId` is used (not `request.appId`)
- [ ] `getCollectionByAppId(...)` contains all active apps
- [ ] Unknown appIds return `invalid-argument`
- [ ] No accidental deletion of still-used functions
- [ ] Deploy is executed from z-control Backend Functions repository only
- [ ] CI/CD credentials for non-owner repos cannot deploy functions

## CI/CD Guardrails (Recommended)

- Use a dedicated service account for functions deploy in z-control Backend Functions CI only.
- Do not store deploy-capable Firebase tokens/secrets in non-owner repositories.
- Protect production deploy workflow with branch protection and required reviews.
- Require build and test success before `firebase deploy --only functions`.

## Suggested Next App Onboarding (Example: image-to-text)

When adding a new app:

1. FE app constants:

- `APP_ID = 'image_to_text'`
- app-local `COLLECTION_NAME` for paths

2. BE mapping:

- Add `image_to_text` entry in `APP_TO_COLLECTION`

3. Reuse same contingent/user-mapping callable contract.

4. Release with same compatibility policy if legacy clients exist.

5. Do not deploy shared functions from the new app repository.
   Deploy backend changes from setup app repository after merge.

## Notes On Interfaces

Interfaces in `functions/src/shared/firebase-firestore.interfaces.ts` are compile-time only.

- Deleting interfaces does not directly change deployed runtime behavior.
- Runtime behavior changes only through callable/service implementation changes and deployments.

Keep interfaces aligned with active callable payloads to preserve type safety and readable code.
