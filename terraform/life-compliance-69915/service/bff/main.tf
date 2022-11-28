locals {
  service_name = "bff"
}

resource "google_cloudbuild_trigger" "deploy" {
  name           = "${local.service_name}-deploy"
  included_files = ["${local.service_name}/**"]
  ignored_files  = []
  github {
    owner = var.repo_owner
    name  = var.repo_name
    push {
      branch = "^main$"
    }
  }
  filename = "${local.service_name}/.google/cloudbuild.yaml"
}

# Create cloud build trigger & Push service to git hub
resource "google_cloudbuild_trigger" "pr" {
  name           = "${local.service_name}-pr"
  included_files = ["${local.service_name}/**"]
  ignored_files  = []
  github {
    owner = var.repo_owner
    name  = var.repo_name
    pull_request {
      branch       = "^main$"
      invert_regex = true
    }
  }
  filename = "${local.service_name}/.google/cloudbuild-pr.yaml"
}

resource "google_cloud_run_service" "bff" {
  name     = local.service_name
  location = var.location
  autogenerate_revision_name = true

  template {
    spec {
      containers {
        resources {
          limits = {
            memory = "512Mi"
          }
        }
        image = "europe-west1-docker.pkg.dev/life-compliance-69915/docker/${local.service_name}:dev"
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "0"
        "autoscaling.knative.dev/maxScale" = "1"
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role    = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.bff.location
  project  = google_cloud_run_service.bff.project
  service  = google_cloud_run_service.bff.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
