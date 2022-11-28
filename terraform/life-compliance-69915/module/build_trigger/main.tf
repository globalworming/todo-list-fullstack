
resource "google_cloudbuild_trigger" "deploy" {
  name           = "${var.service_name}-deploy"
  included_files = ["${var.service_name}/**"]
  ignored_files  = []
  github {
    owner = var.repo_owner
    name  = var.repo_name
    push {
      branch = "^main$"
    }
  }
  filename = "${var.service_name}/.google/cloudbuild.yaml"
}

# Create cloud build trigger & Push service to git hub
resource "google_cloudbuild_trigger" "pr" {
  name           = "${var.service_name}-pr"
  included_files = ["${var.service_name}/**"]
  ignored_files  = []
  github {
    owner = var.repo_owner
    name  = var.repo_name
    pull_request {
      branch       = "^main$"
      invert_regex = true
    }
  }
  filename = "${var.service_name}/.google/cloudbuild-pr.yaml"
}