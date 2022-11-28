locals {
  service_name = "single-page-application"
}

resource "google_cloudbuild_trigger" "deploy" {
  name    = "${local.service_name}-deploy"
  included_files = ["${local.service_name}/**"]
  ignored_files = []
  github {
    owner = var.repo_owner
    name  = var.repo_name
    push {
      branch = "^main$"
    }
  }
  filename   = "${local.service_name}/.google/cloudbuild.yaml"
}

# Create cloud build trigger & Push service to git hub
resource "google_cloudbuild_trigger" "pr" {
  name    = "${local.service_name}-pr"
  included_files = ["${local.service_name}/**"]
  ignored_files = []
  github {
    owner = var.repo_owner
    name  = var.repo_name
    pull_request {
      branch = "^main$"
      invert_regex = true
    }
  }
  filename   = "${local.service_name}/.google/cloudbuild-pr.yaml"
}

resource "google_cloud_run_service" "single_page_application" {
  name     = "single-page-application"
  location = var.location

  template {
    spec {
      containers {
        image = "europe-west1-docker.pkg.dev/life-compliance-69915/docker/single-page-application:dev"
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
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.single_page_application.location
  project     = google_cloud_run_service.single_page_application.project
  service     = google_cloud_run_service.single_page_application.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_artifact_registry_repository" "docker" {
  location      = var.location
  repository_id = "docker"
  format        = "DOCKER"
}
