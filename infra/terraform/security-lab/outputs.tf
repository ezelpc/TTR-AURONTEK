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
