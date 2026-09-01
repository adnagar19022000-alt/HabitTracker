# 🏋️ HabitTracker — Full Stack AWS Deployment

A full-stack habit tracking MERN application deployed on AWS using Infrastructure as Code (Terraform) and automated CI/CD pipelines (GitHub Actions).

---

## 🏗️ Architecture Overview

`
User (Browser)
    ↓
Nginx (EC2 - Port 80)
    ├── / → React Frontend (served from /var/www/habittracker)
    └── /api/* → Node.js Backend (localhost:5000)
                      ↓
                 MongoDB Atlas
`

The Nginx reverse proxy ensures the frontend and backend share the same origin, which is critical for cookie-based authentication to work correctly in the browser.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), TypeScript |
| Backend | Node.js, Express, Better Auth |
| Database | MongoDB Atlas |
| Web Server | Nginx (Reverse Proxy) |
| Process Manager | PM2 |
| Infrastructure | AWS EC2 (t3.micro), AWS S3 |
| IaC | Terraform |
| CI/CD | GitHub Actions |

---

## 🚀 Assignment Breakdown

### Assignment 1: Manual Deployment
- Manually provisioned an AWS EC2 instance (Ubuntu 22.04, t3.micro).
- Configured Nginx as a reverse proxy to route /api/* traffic to the Node.js backend (Port 5000).
- This solved the cross-origin cookie problem.

### Assignment 2: Infrastructure as Code (Terraform)
- Replaced all manual AWS setup with a fully automated Terraform configuration.
- Resources created: SSH Key Pair, Security Group, S3 Bucket, EC2 Instance.
- Used user_data to bootstrap the server automatically on first boot.

### Assignment 3: CI/CD Pipeline (GitHub Actions)
- GitHub Actions workflow triggers on every push to main branch.
- Automatically builds React and deploys to S3 bucket.

---

## ⚙️ Deployment

`ash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
`

### GitHub Secrets Required
| Secret Name | Description |
|---|---|
| AWS_ACCESS_KEY_ID | IAM user access key |
| AWS_SECRET_ACCESS_KEY | IAM user secret key |

---

## 🌐 Live URLs
- **Full Stack App (EC2):** http://98.93.99.253
- **Frontend Only (S3):** http://habit-tracker-frontend-aditya-123.s3-website-us-east-1.amazonaws.com
