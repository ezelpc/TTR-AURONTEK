output "vpc_id" {
  description = "Security lab VPC ID"
  value       = aws_vpc.lab.id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "audit_bucket_name" {
  description = "CloudTrail audit bucket name"
  value       = aws_s3_bucket.audit.id
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID"
  value       = aws_guardduty_detector.lab.id
}

output "account_id" {
  description = "AWS account ID used for deployment"
  value       = data.aws_caller_identity.current.account_id
}

output "github_actions_deploy_role_arn" {
  description = "IAM role ARN assumed by GitHub Actions through OIDC for SSM deployments"
  value       = aws_iam_role.github_actions_deploy.arn
}

output "instance_secret_access_policy_arn" {
  description = "IAM policy ARN to attach to the EC2 instance role used by SSM-managed Aurontek nodes"
  value       = aws_iam_policy.instance_secret_access.arn
}

output "application_secret_arn" {
  description = "Secrets Manager ARN used for deployment environment payloads"
  value       = aws_secretsmanager_secret.application.arn
}
