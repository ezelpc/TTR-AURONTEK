# CI/CD Security Gate

AURONTEK treats the CI pipeline as a security control, not only as a build mechanism.

## Pipeline objective

Every change should pass automated quality and security checks before container images are published or an AWS deployment is promoted.

```text
Pull Request / Push
        |
        +--> Tests / Lint / Type Check
        |
        +--> SAST ............. Semgrep
        +--> Secrets .......... Gitleaks
        +--> Dependencies ..... npm audit
        +--> Filesystem ........ Trivy
        |
        +--> Docker Build
        +--> Container Scan ... Trivy
        |
        v
   SECURITY GATE
        |
        +--> Registry Push
        +--> AWS Deployment
        v
   Post-deploy verification
```

## Required controls

| Control | Tool | Policy |
|---|---|---|
| SAST | Semgrep | Block on actionable findings configured by policy |
| Secrets | Gitleaks | Block detected credentials and tokens |
| SCA | npm audit | Block high-severity dependency vulnerabilities |
| Filesystem | Trivy | Block HIGH/CRITICAL findings according to policy |
| Container | Trivy | Scan images before publication |
| Tests | npm test | Required |
| Type safety | TypeScript | Required |
| Lint | ESLint | Required |

## Deployment principle

Security checks must execute **before** `build-and-push` and before either AWS deployment job. A failed security gate must prevent registry publication and deployment.

## Secrets

Runtime credentials must come from GitHub Actions secrets or an external secret manager. Never commit `.env` files, access keys, JWT signing keys, service tokens, database credentials, or provider API keys.

For AWS production environments, the target architecture is:

```text
GitHub Actions
      |
      +--> OIDC / short-lived AWS credentials
      |
      +--> AWS Secrets Manager / SSM Parameter Store
      |
      v
EDGE / CORE EC2
```

Long-lived cloud credentials should not be stored in the repository.

## SSH hardening

Deployments should verify the target host key instead of disabling SSH host verification. `StrictHostKeyChecking=no` is intentionally considered a security debt item and should be removed once the deployment environment manages a trusted `known_hosts` entry.

## Current status

Implemented in the repository:

- Reproducible Node dependency installation with `npm ci` in the main Node service images.
- Fail-closed RabbitMQ credentials in the CORE Compose configuration.
- Secret cleanup from current source files.
- Dedicated threat model and security documentation.

Next hardening steps:

1. Enforce the complete Security Gate in GitHub Actions.
2. Replace SSH host-key bypasses with managed host keys.
3. Move runtime secrets toward AWS Secrets Manager / SSM.
4. Add Terraform + Checkov security validation.
5. Add image signing and provenance/SBOM generation.
6. Add post-deployment security smoke tests.

## Portfolio note

This document describes security engineering practices for a portfolio/lab environment. It is not a claim of PCI DSS, GDPR, SOC 2, or other regulatory certification.
