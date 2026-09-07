# Security Policy

## Scope
AURONTEK is a portfolio and security engineering lab. It is not represented as PCI DSS, GDPR, SOC 2, or any other compliance certification.

## Reporting
Please report suspected vulnerabilities privately to the repository owner before opening a public issue. Do not include credentials, personal data, tokens, or other sensitive information in public issues.

## Security controls
The project demonstrates automated SAST, secret scanning, dependency auditing, filesystem vulnerability scanning, Docker build validation, non-root containers, dropped Linux capabilities, no-new-privileges, fail-closed secret configuration, dependency update automation, and threat modeling.

## Secret handling
Never commit production credentials. Use GitHub Actions secrets or an external secret manager. If a credential has been exposed, revoke or rotate it immediately and investigate repository history.

## Out of scope
Do not attack infrastructure, cloud accounts, third-party services, or production systems without explicit authorization. Security experiments must remain inside environments owned or explicitly authorized by the operator.
