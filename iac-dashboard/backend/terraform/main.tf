terraform {
  required_providers {
    null = {
      source = "hashicorp/null"
    }
  }
}

resource "null_resource" "mock_ec2" {
  triggers = {
    instance_name = "iac-demo-ec2"
    instance_type = "t2.micro"
    region        = "us-east-1"
  }
}

output "mock_instance_name" {
  value = "iac-demo-ec2"
}

