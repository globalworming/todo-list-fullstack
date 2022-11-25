provider "google" {
  project = var.project_id
  region  = var.location
  zone    = var.zone
}

module "enable_apis" {
  source = "./module/enable_apis"
}

data "google_project" "project" {}

locals {
  cloud_build_service_account = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}

resource "google_project_iam_member" "cloud_run_admin" {
  project = var.project_id
  role    = "roles/run.developer"
  member  = local.cloud_build_service_account
}

module "single_page_application" {
  source = "./service/single_page_application"
  location = var.location
  env_vars = []
  depends_on = []
  repo_name = var.repo_name
  repo_owner = var.repo_owner
}