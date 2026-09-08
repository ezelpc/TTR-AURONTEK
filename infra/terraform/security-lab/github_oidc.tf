data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:ezelpc/AURONTEK:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1"
  ]
}

resource "aws_iam_role" "github_actions_deploy" {
  name               = "aurontek-github-actions-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json
}

data "aws_iam_policy_document" "github_actions_deploy" {
  statement {
    sid    = "ReadManagedInstanceState"
    effect = "Allow"
    actions = [
      "ssm:DescribeInstanceInformation",
      "ssm:DescribeInstanceProperties",
      "ssm:DescribeDocument",
      "ssm:GetDocument",
      "ssm:ListCommandInvocations",
      "ssm:GetCommandInvocation"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "RunDeploymentCommandsOnAurontekInstances"
    effect = "Allow"
    actions = ["ssm:SendCommand"]

    resources = [
      "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:document/AWS-RunShellScript",
      "arn:aws:ec2:${var.aws_region}:${data.aws_caller_identity.current.account_id}:instance/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "ssm:resourceTag/AurontekRole"
      values   = ["edge", "core"]
    }
  }
}

resource "aws_iam_role_policy" "github_actions_deploy" {
  name   = "aurontek-ssm-deploy"
  role   = aws_iam_role.github_actions_deploy.id
  policy = data.aws_iam_policy_document.github_actions_deploy.json
}

resource "aws_iam_policy" "instance_secret_access" {
  name        = "aurontek-instance-secret-read"
  description = "Read the deployment .env payload from the Aurontek deployment secret. Attach to the EC2 instance role used by SSM-managed nodes."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["secretsmanager:GetSecretValue"]
      Resource = [
        aws_secretsmanager_secret.application.arn
      ]
    }]
  })
}
