# AURONTEK Cloud Security Lab

Terraform-based AWS security baseline for the AURONTEK portfolio.

## Objectives

- Build a least-privilege AWS foundation.
- Separate public and private network zones.
- Centralize audit logging with CloudTrail.
- Protect deployment secrets with AWS Secrets Manager.
- Enable threat detection with GuardDuty.
- Authenticate GitHub Actions to AWS with OIDC instead of long-lived AWS keys.
- Deploy to SSM-managed EC2 instances through AWS Systems Manager Run Command instead of SSH from GitHub Actions.
- Add security-focused IaC validation with Checkov and Trivy.
- Keep credentials outside source control.

## Architecture

```text
GitHub Actions
     |
     | OIDC / short-lived AWS credentials
     v
IAM deploy role
     |
     | ssm:SendCommand (restricted to tagged instances)
     v
AWS Systems Manager
     |
     +----------------------+----------------------+
     |                                             |
Aurontek EDGE EC2                         Aurontek CORE EC2
     |                                             |
     +----------------------+----------------------+
                            |
                    Secrets Manager
                            |
                  CloudTrail / S3 Logs
                            |
                       GuardDuty
```

The current Terraform module establishes the security baseline and IAM resources for this deployment model. The ALB/NAT topology shown in older diagrams is intentionally not presented as provisioned infrastructure until those resources are added to Terraform.

## Security controls

| Control | Implementation |
|---|---|
| IAM | Explicitly scoped OIDC and SSM policies |
| GitHub authentication | OIDC with a short-lived role restricted to `main` |
| Remote administration | AWS Systems Manager Run Command; no GitHub-hosted SSH keys |
| Network | Public/private subnet separation |
| Ingress | Security groups restricted to required ports |
| Secrets | Separate EDGE/CORE Secrets Manager containers |
| EC2 secret access | Read-only `secretsmanager:GetSecretValue` policy |
| Audit | CloudTrail with centralized S3 storage |
| Detection | GuardDuty enabled |
| IaC | Checkov + Trivy configuration scanning |
| CI/CD | Terraform fmt/validate + security gates |

## Deployment secret format

The CI/CD workflow expects two Secrets Manager secrets:

- `edge_deploy`
- `core_deploy`

Each secret stores a JSON object containing an `.env` payload:

```json
{
  "env": "FRONTEND_URL=https://example.com\nJWT_SECRET=<managed-secret>\nREDIS_PASSWORD=<managed-secret>"
}
```

Populate secret values outside source control. The EC2 instance role must have the generated `instance_secret_access_policy_arn` attached, while the instances must be registered with SSM and tagged with `AurontekRole=edge` or `AurontekRole=core`.

## GitHub configuration

The production environment needs these secrets:

- `AWS_AURONTEK_DEPLOY_ROLE_ARN`
- `AURONTEK_EDGE_INSTANCE_ID`
- `AURONTEK_CORE_INSTANCE_ID`
- `AURONTEK_EDGE_SECRET_ARN`
- `AURONTEK_CORE_SECRET_ARN`
- existing Docker Hub credentials used by the image build/push stage

The AWS role ARN and secret ARNs are exposed as Terraform outputs. No AWS access key or SSH private key is required by the deployment workflow.

## Usage

```bash
terraform init
terraform fmt -check -recursive
terraform validate
terraform plan
```

For local portfolio validation, run Checkov and Trivy against this directory before applying changes.

## Safety

This lab is designed for an AWS account owned or explicitly authorized by the operator. Review estimated costs before applying resources. Do not commit cloud credentials, state files, private keys, or production secrets.
