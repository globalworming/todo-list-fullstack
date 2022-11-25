provider "google" {
  project = var.project_id
  region  = var.location
  zone    = var.zone
}

module "enable_apis" {
  source = "./module/enable_apis"
}


module "single_page_application" {
  source = "./service/single_page_application"
  location = var.location
  env_vars = []
  depends_on = []
  repo_name = var.repo_name
  repo_owner = var.repo_owner
}