variable "aws_region" {
  description = "AWS region for the security lab"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "security-lab"
}

variable "vpc_cidr" {
  description = "CIDR for the isolated lab VPC"
  type        = string
  default     = "10.40.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones used by the lab"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "allowed_admin_cidr" {
  description = "Administrator source CIDR. Must be explicitly supplied; never use 0.0.0.0/0."
  type        = string

  validation {
    condition     = var.allowed_admin_cidr != "0.0.0.0/0"
    error_message = "allowed_admin_cidr must not be 0.0.0.0/0."
  }
}
