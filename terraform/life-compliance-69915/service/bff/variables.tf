variable "location" {
  type = string
}

variable "env_vars" {
  type = list(object({
    key = string
    value  = string
  }))
}

variable "repo_owner" {
  type = string
}

variable "repo_name" {
  type = string
}
