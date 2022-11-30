output "service_url" {
  value       = google_cloud_run_service.service.status.0.url
  description = "The URL on which the deployed service is available"
}