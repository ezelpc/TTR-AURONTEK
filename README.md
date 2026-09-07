# AURONTEK

> **Enterprise Ticketing Platform · Microservices · AWS · DevSecOps**

AURONTEK is a containerized enterprise ticketing platform built as a practical **DevSecOps and Cloud Security case study**. The project combines microservices, API security, CI/CD, Docker, Nginx and an AWS deployment model with an explicit security-first engineering approach.

## 🎯 Portfolio objective

Demonstrate how an application moves from source code to a cloud deployment while applying security controls throughout the lifecycle:

```text
Developer
   ↓
GitHub / Pull Request
   ↓
Code Quality + Security Checks
   ├── SAST
   ├── SCA
   ├── Secret Detection
   └── Container Security
   ↓
Docker Build
   ↓
Container Registry
   ↓
AWS Deployment
   ├── EDGE EC2
   └── CORE EC2
   ↓
Monitoring / Operations
```

## 🏗️ Architecture

```text
                         INTERNET
                             │
                         HTTPS / TLS
                             │
                    ┌────────▼────────┐
                    │    NGINX EDGE   │
                    │ Reverse Proxy   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API GATEWAY   │
                    │ CORS / Helmet   │
                    │ Rate Limiting  │
                    └────────┬────────┘
                             │
                 ┌───────────┼───────────┐
                 │           │           │
          ┌──────▼─────┐ ┌──▼────────┐ ┌▼───────────┐
          │  Usuarios  │ │  Tickets  │ │    Chat    │
          │ Auth / RBAC│ │   CRUD    │ │ WebSockets │
          └──────┬─────┘ └────┬──────┘ └────┬───────┘
                 │            │             │
                 └────────────┼─────────────┘
                              │
                 ┌────────────▼────────────┐
                 │ Notifications / AI      │
                 └──────────────────────────┘

             AWS deployment model
        ┌───────────────────────────────┐
        │ EDGE EC2                      │
        │ Nginx + Gateway + Redis       │
        └──────────────┬────────────────┘
                       │ private path
        ┌──────────────▼────────────────┐
        │ CORE EC2                      │
        │ Internal microservices        │
        └───────────────────────────────┘
```

## 🔐 Security controls

| Layer | Controls |
|---|---|
| Edge | HTTPS/TLS, Nginx, restricted exposure |
| API | Helmet, CORS policy, rate limiting |
| Identity | JWT, bcrypt, RBAC |
| Application | Input validation/sanitization |
| Runtime | Docker isolation and environment-based secrets |
| CI/CD | Automated testing and security scanning |
| Operations | Logs, health checks and deployment procedures |

> Security documentation is intentionally separated from implementation claims. Controls listed here are validated against the current project configuration and roadmap rather than treated as compliance certification.

## 🧩 Microservices

| Service | Responsibility |
|---|---|
| Gateway | API entry point, routing and security middleware |
| Usuarios | Authentication, users, companies and RBAC |
| Tickets | Ticket lifecycle and assignments |
| Chat | Real-time communication |
| Notificaciones | Email and notification workflows |
| IA | Ticket analysis and intelligent suggestions |
| Redis | Cache, rate limiting and session-related data |

## 🛠️ Technology stack

**Backend:** Node.js, Express, Python, FastAPI  
**Frontend:** React, Vite, TailwindCSS  
**Data:** MongoDB Atlas, Redis, RabbitMQ  
**DevOps:** Docker, Docker Compose, GitHub Actions  
**Cloud:** AWS EC2  
**Edge:** Nginx, Let's Encrypt / Certbot  
**Security:** JWT, bcrypt, Helmet, rate limiting, SAST/SCA/secret/container scanning

## 🚀 Run locally

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker + Docker Compose
- Environment variables configured from `.env.example`

```bash
git clone https://github.com/ezelpc/AURONTEK.git
cd AURONTEK

cp .env.example .env

# Start the development stack
docker compose -f docker-compose.dev.yml up -d

# Health check
curl http://localhost:3000/health
```

Never commit production credentials, API keys, JWT secrets or service tokens. Use GitHub Secrets or an appropriate secrets manager for deployment environments.

## 🔄 CI/CD

The repository uses GitHub Actions to automate testing, Docker image creation and AWS deployment.

Target security lifecycle:

```text
PR
 ↓
Tests / Lint / Type Check
 ↓
SAST + SCA + Secret Scan
 ↓
IaC / Container Security
 ↓
Security Gate
 ↓
Build & Push
 ↓
AWS Deployment
 ↓
Verification
```

See `.github/workflows/` and [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

## 📚 Security engineering documentation

- [`docs/SECURITY.md`](./docs/SECURITY.md) — security controls and operational guidance
- [`docs/GITHUB_SECRETS.md`](./docs/GITHUB_SECRETS.md) — secret configuration
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — deployment architecture
- [`docs/ENVIRONMENT_VARIABLES.md`](./docs/ENVIRONMENT_VARIABLES.md) — configuration reference

## 🧪 Security testing roadmap

- [x] Authentication and RBAC
- [x] Rate limiting
- [x] Security headers
- [x] HTTPS/TLS deployment
- [x] Environment-based secrets
- [x] Automated CI/CD
- [ ] SAST enforcement on every PR
- [ ] SCA policy with severity threshold
- [ ] Gitleaks enforcement
- [ ] Container image vulnerability gate
- [ ] SBOM generation and artifact retention
- [ ] IaC scanning with Checkov
- [ ] AWS IAM least-privilege review
- [ ] CloudTrail / CloudWatch security monitoring
- [ ] Threat model and attack-surface documentation

## 💼 Why this project matters

AURONTEK is not presented only as a CRUD application. Its portfolio value is the complete engineering lifecycle: **application architecture + cloud deployment + automation + security controls + operational thinking**.

The project is a controlled portfolio/lab environment and should not be interpreted as a production compliance certification.

## 👤 Author

**Ezequiel Perez**  
DevSecOps Engineer Jr · Cloud Security · AWS · Cybersecurity
