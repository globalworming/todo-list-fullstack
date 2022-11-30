locals {
  service_name = "single-page-application"
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
        image = "${var.location}-docker.pkg.dev/life-compliance-69915/docker/${local.service_name}:prod"
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