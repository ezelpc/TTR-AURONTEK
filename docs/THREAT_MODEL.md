# AURONTEK Threat Model

> Lightweight threat model for the portfolio/lab deployment of AURONTEK.

## 1. Scope

The model covers the public application edge, API Gateway, internal microservices, authentication, asynchronous services, containers and the AWS EC2 deployment model.

## 2. Assets

| Asset | Security objective |
|---|---|
| User credentials | Confidentiality / integrity |
| JWT signing secret | Confidentiality |
| Service credentials | Confidentiality |
| Ticket/customer data | Confidentiality / integrity |
| RabbitMQ messages | Integrity / confidentiality |
| Redis data | Integrity / availability |
| Container images | Integrity / provenance |
| CI/CD credentials | Confidentiality / integrity |
| AWS infrastructure | Availability / integrity |
| Application logs | Integrity / controlled disclosure |

## 3. Trust boundaries

```text
Internet
   │
   │ Untrusted
   ▼
Nginx / EDGE
   │
   │ Application trust boundary
   ▼
API Gateway
   │
   ├── Usuarios
   ├── Tickets
   ├── Chat
   ├── Notificaciones
   └── IA
        │
        ├── Redis
        └── RabbitMQ / external services

CI/CD ───────────────► Container Registry ─────► AWS
```

## 4. Threats and mitigations

| Threat | Example | Primary mitigation |
|---|---|---|
| Credential theft | Exposed JWT/service secret | Secret scanning, environment secrets, rotation |
| Broken authentication | Token abuse | Strong secret, expiry, validation, rate limiting |
| Authorization bypass | Cross-tenant ticket access | RBAC + object-level authorization tests |
| Injection | Malicious API input | Validation/sanitization + secure queries |
| API abuse | Brute force / enumeration | Rate limiting + monitoring |
| Supply-chain attack | Compromised dependency/image | SCA, lockfiles, image scanning, provenance |
| Container compromise | Vulnerable runtime | Minimal images, non-root, read-only FS where possible |
| CI compromise | Malicious workflow change | Least-privilege permissions + protected branches |
| AWS exposure | Public internal service | Network segmentation + restricted security groups |
| Data exfiltration | Compromised service | Least privilege + egress controls + monitoring |
| Log leakage | Secrets in debug output | Structured logging + secret redaction |
| Availability attack | Resource exhaustion | Rate limiting + health checks + resource limits |

## 5. Abuse cases

### A. Brute-force authentication

Attacker repeatedly submits login attempts.

**Controls:** rate limiting, authentication monitoring, alerting and account-protection controls.

### B. Stolen JWT

An attacker obtains a valid token.

**Controls:** short token lifetime, secret protection, authorization checks and token invalidation strategy.

### C. Malicious dependency

A compromised package enters the build.

**Controls:** lockfiles, SCA, dependency review and CI security gates.

### D. Compromised container

An exposed service is exploited.

**Controls:** image scanning, least privilege, reduced Linux capabilities, filesystem restrictions and network segmentation.

### E. CI/CD credential compromise

An attacker attempts to use deployment credentials.

**Controls:** GitHub Secrets, minimal token permissions, protected environments and short-lived cloud credentials where supported.

## 6. Security priorities

### P0 — Critical

- No hardcoded production credentials.
- Protect CI/CD deployment credentials.
- Keep internal services inaccessible from the public internet.
- Fail closed when security-critical configuration is missing.

### P1 — High

- Enforce SAST/SCA/secret/container gates.
- Add IaC scanning with Checkov when Terraform is introduced.
- Review IAM permissions.
- Centralize security logging.

### P2 — Medium

- Add SBOM generation.
- Add threat-detection dashboards.
- Add automated incident-response exercises.
- Add dependency update automation.

## 7. Residual risk

This project is a portfolio/lab environment. Passing automated security checks does not prove absence of vulnerabilities or compliance with PCI DSS, GDPR, SOC 2 or another regulatory framework.

Security claims should always be validated against the deployed configuration, dependency versions and operational environment.
