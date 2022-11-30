locals {
  service_name = "single-page-application"
}

module "build_triggers" {
  source       = "../../module/build_trigger"
  location     = var.location
  repo_name    = var.repo_name
  repo_owner   = var.repo_owner
  service_name = local.service_name
}

resource "google_cloud_run_service" "service" {
  name                       = local.service_name
  location                   = var.location
  autogenerate_revision_name = true

  template {
    spec {
      containers {
        resources {
          limits = {
            memory = "128Mi"
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
  location = google_cloud_run_service.service.location
  project  = google_cloud_run_service.service.project
  service  = google_cloud_run_service.service.name

  policy_data = data.google_iam_policy.noauth.policy_data
}