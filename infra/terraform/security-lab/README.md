# AURONTEK Cloud Security Lab

Terraform-based AWS security baseline for the AURONTEK portfolio.

## Objectives

- Build a least-privilege AWS foundation.
- Separate public and private network zones.
- Centralize audit logging with CloudTrail.
- Protect secrets with AWS Secrets Manager.
- Enable threat detection with GuardDuty.
- Add security-focused IaC validation with Checkov and Trivy.
- Keep credentials outside source control.

## Architecture

```text
                         Internet
                            |
                     +------+------+
                     |  Public ALB |
                     +------+------+
                            |
                 +----------+----------+
                 |                     |
           Public Subnet          Public Subnet
                 |                     |
              NAT GW                NAT GW
                 |                     |
        +--------+---------------------+--------+
        |          Private Subnets              |
        |                                       |
        |   Application / Workload instances    |
        +-------------------+-------------------+
                            |
                    Secrets Manager
                            |
                  CloudTrail / S3 Logs
                            |
                       GuardDuty
```

## Security controls

| Control | Implementation |
|---|---|
| IAM | Explicitly scoped policies; no access keys in Git |
| Network | Public/private subnet separation |
| Ingress | Security groups restricted to required ports |
| Secrets | AWS Secrets Manager instead of Terraform literals |
| Audit | CloudTrail with centralized S3 storage |
| Detection | GuardDuty enabled |
| IaC | Checkov + Trivy configuration scanning |
| State | Remote-state design documented; never commit `terraform.tfstate` |
| CI/CD | Terraform fmt/validate + security gates |

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
