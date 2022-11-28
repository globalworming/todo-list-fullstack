resource "google_project_service" "cloudbuild_api" {
  service            = "cloudbuild.googleapis.com"
}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
}

resource "google_project_service" "artifactregistry_api" {
  service = "artifactregistry.googleapis.com"
}
