# GitHub Actions

GitHub's API requires a token with the `workflow` scope to push files under
`.github/workflows/`. The provisioning token used for this repository did not
have that scope, so the pipeline lives here.

**To activate CI:** copy (or `git mv`) these files to the repo root:

```bash
mkdir -p .github/workflows
cp infrastructure/github-actions/ci.yml .github/workflows/ci.yml
git add .github && git commit -m "ci: activate workflow"
```

Pipeline (web): lint · typecheck · prisma generate/push (ephemeral sqlite) · seed · build.
Production API/Worker pipelines (lint · typecheck · test · docker-build) are specified in
`docs/architecture.md` for the `apps/api` / `apps/worker` monorepo extraction.
