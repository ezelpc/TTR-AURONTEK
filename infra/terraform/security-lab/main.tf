data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "lab" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "aurontek-${var.environment}"
  }
}

resource "aws_internet_gateway" "lab" {
  vpc_id = aws_vpc.lab.id
}

resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.lab.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name = "aurontek-public-${count.index + 1}"
    Tier = "public"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.lab.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "aurontek-private-${count.index + 1}"
    Tier = "private"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.lab.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lab.id
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "admin" {
  name        = "aurontek-admin"
  description = "Restricted administrative access"
  vpc_id      = aws_vpc.lab.id

  ingress {
    description = "SSH administration from approved network"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_admin_cidr]
  }

  egress {
    description = "Controlled outbound traffic for lab administration"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_s3_bucket" "audit" {
  bucket_prefix = "aurontek-cloudtrail-"
  force_destroy = false
}

resource "aws_s3_bucket_public_access_block" "audit" {
  bucket = aws_s3_bucket.audit.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "audit" {
  bucket = aws_s3_bucket.audit.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "audit" {
  bucket = aws_s3_bucket.audit.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_cloudtrail" "audit" {
  name                          = "aurontek-security-audit"
  s3_bucket_name                = aws_s3_bucket.audit.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true
  enable_logging                = true

  depends_on = [aws_s3_bucket_policy.audit]
}

resource "aws_s3_bucket_policy" "audit" {
  bucket = aws_s3_bucket.audit.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSCloudTrailAclCheck"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.audit.arn
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.audit.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      }
    ]
  })
}

resource "aws_guardduty_detector" "lab" {
  enable = true
}

resource "aws_secretsmanager_secret" "application" {
  name                    = "aurontek/${var.environment}/application"
  description             = "Application secret container; secret value is managed outside source control."
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret" "edge_deploy" {
  name                    = "aurontek/${var.environment}/edge-deploy"
  description             = "EDGE deployment environment payload; value is managed outside source control."
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret" "core_deploy" {
  name                    = "aurontek/${var.environment}/core-deploy"
  description             = "CORE deployment environment payload; value is managed outside source control."
  recovery_window_in_days = 7
}
