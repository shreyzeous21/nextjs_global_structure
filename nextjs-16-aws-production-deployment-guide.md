# Next.js 16 Production Deployment Guide — AWS EC2

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Lucide, MySQL (`mysql2/promise`), Zod.

**Deployment target:** AWS EC2 + Ubuntu + Nginx + PM2 + GitHub Actions.

**Audience:** Development, DevOps, QA, and backend/frontend team members.

---

## 1. Overview

This guide establishes a repeatable production deployment process for the BlueConnects Next.js application.

The target architecture is:

```text
Developer
   |
   | git push origin main
   v
GitHub Repository
   |
   v
GitHub Actions
   |
   | deploy over SSH
   v
AWS EC2
   |
   +--> Nginx :443
   |       |
   |       +--> Next.js :3000
   |                |
   |                +--> MySQL Primary
   |                +--> MySQL Secondary
   |
   +--> PM2 keeps Next.js running
```

The normal team workflow becomes:

```bash
git add .
git commit -m "Describe change"
git push origin main
```

GitHub Actions then performs the deployment.

---

# 2. Production Components

| Component | Purpose |
|---|---|
| GitHub | Source control |
| GitHub Actions | CI/CD automation |
| AWS EC2 | Application server |
| Ubuntu | Server OS |
| Node.js | Runs Next.js |
| npm | Dependency management/build |
| PM2 | Keeps Next.js running |
| Nginx | Reverse proxy + HTTPS |
| MySQL | Application database |
| AWS Secrets Manager / SSM | Production secrets |
| Route 53 | DNS, if using AWS DNS |
| Let's Encrypt/Certbot | TLS certificate, if terminating TLS at Nginx |

---

# 3. Prerequisites

Before starting, make sure the team has:

- GitHub repository
- AWS account
- Domain name
- EC2 SSH key pair
- Production MySQL database(s)
- Node.js version selected for the project
- Production environment variables
- A successful local production build

Verify locally:

```bash
node -v
npm -v
npm ci
npm run build
```

The production build must succeed before deployment automation is configured.

---

# 4. Recommended Repository Structure

The deployment files should live in the repository:

```text
project/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
├── public/
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── .nvmrc
├── .gitignore
└── README.md
```

Recommended `.nvmrc`:

```text
22
```

Use the exact Node.js major version approved by the project. The important requirement is that development, CI, and production use the same supported version.

---

# 5. Environment Variables

## 5.1 Never commit production secrets

Do not commit:

```text
.env
.env.local
.env.production
```

Add them to `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
.env.production
```

A production server needs environment variables such as:

```env
NODE_ENV=production

MYSQL_PRIMARY_URL=mysql://user:password@host:3306/primary_db
MYSQL_SECONDARY_URL=mysql://user:password@host:3306/secondary_db
```

Also configure any application-specific variables required by the project.

---

# 6. Database Security

The application server should be allowed to connect to MySQL, but MySQL should not be exposed unnecessarily to the public internet.

Preferred architecture:

```text
Internet
   |
   v
Nginx / EC2
   |
   v
Private MySQL
```

If the database is on another AWS service/server:

- Restrict inbound MySQL access to the EC2 security group or private network.
- Do not use `0.0.0.0/0` for MySQL unless there is an exceptional, documented reason.
- Use TLS for database connections when supported/required.
- Use separate production credentials.
- Give the application account only the permissions it needs.

---

# 7. Create the AWS EC2 Instance

For a first production deployment, Ubuntu LTS on EC2 is a simple and controllable option.

Example starting point:

```text
OS: Ubuntu LTS
CPU: 2 vCPU
RAM: 4 GB
Disk: 20–30 GB+
```

Choose the instance size based on actual workload. Monitor CPU, RAM, disk, and request latency and resize when necessary.

Do not assume this instance size is appropriate for every workload.

---

# 8. EC2 Security Group

Recommended inbound rules:

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | Your office/VPN IP | SSH |
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |

Do **not** expose port `3000` publicly.

Next.js will listen on:

```text
127.0.0.1:3000
```

Nginx will proxy public HTTPS traffic to it.

---

# 9. Connect to EC2

From your workstation:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

Replace:

```text
your-key.pem
YOUR_EC2_IP
```

with your actual values.

If SSH permissions are too open:

```bash
chmod 400 your-key.pem
```

---

# 10. Update Ubuntu

On EC2:

```bash
sudo apt update
sudo apt upgrade -y
```

Install useful tools:

```bash
sudo apt install -y git curl unzip nginx
```

---

# 11. Install Node.js

Use a version manager such as `nvm` so the server can use the same Node major version as the project.

Example:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Reload the shell:

```bash
source ~/.bashrc
```

Verify:

```bash
nvm --version
```

Install the project's Node version:

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

Verify:

```bash
node -v
npm -v
```

The exact Node version should match the version selected by the team.

---

# 12. Prepare the Application Directory

Create an application directory:

```bash
mkdir -p ~/apps
cd ~/apps
```

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL blueconnects-vnoc
```

Enter it:

```bash
cd ~/apps/blueconnects-vnoc
```

---

# 13. Configure Production Environment Variables

For an initial deployment, the application can use a server-side environment file.

Example:

```bash
nano ~/apps/blueconnects-vnoc/.env.production
```

Add:

```env
NODE_ENV=production

MYSQL_PRIMARY_URL=mysql://user:password@host:3306/primary_db
MYSQL_SECONDARY_URL=mysql://user:password@host:3306/secondary_db
```

Add every other required production variable.

Secure the file:

```bash
chmod 600 ~/apps/blueconnects-vnoc/.env.production
```

Do not commit this file.

## Recommended long-term approach

For mature production environments, move secrets to:

- AWS Secrets Manager
- AWS Systems Manager Parameter Store

The deployment process can retrieve them without storing credentials in Git.

---

# 14. Install Dependencies

From the project directory:

```bash
npm ci
```

Use `npm ci`, not `npm install`, in CI/CD deployments when `package-lock.json` is committed.

`npm ci` provides reproducible dependency installation based on the lockfile.

---

# 15. Test the Production Build

Run:

```bash
npm run build
```

If the build succeeds:

```bash
npm start
```

By default, Next.js will listen on port 3000.

From another SSH session, test:

```bash
curl http://127.0.0.1:3000
```

Stop the manually started process with:

```text
Ctrl+C
```

Do not use the manually started process as the permanent production process. PM2 will manage it.

---

# 16. Install PM2

Install PM2 globally:

```bash
npm install -g pm2
```

Verify:

```bash
pm2 --version
```

---

# 17. Start Next.js with PM2

From the project directory:

```bash
pm2 start npm --name blueconnects-vnoc -- start
```

Check:

```bash
pm2 status
```

View logs:

```bash
pm2 logs blueconnects-vnoc
```

View the most recent logs:

```bash
pm2 logs blueconnects-vnoc --lines 100
```

Check process details:

```bash
pm2 describe blueconnects-vnoc
```

---

# 18. Configure PM2 Startup

Save the process list:

```bash
pm2 save
```

Generate the system startup command:

```bash
pm2 startup
```

PM2 will print a command.

Run that command exactly as provided.

Then save again:

```bash
pm2 save
```

Reboot test:

```bash
sudo reboot
```

Reconnect and verify:

```bash
pm2 status
```

The Next.js application should have restarted automatically.

---

# 19. Configure Nginx

The public request flow should be:

```text
https://vnoc.example.com
        |
        v
      Nginx
        |
        v
127.0.0.1:3000
        |
        v
    Next.js
```

Create a site configuration:

```bash
sudo nano /etc/nginx/sites-available/blueconnects-vnoc
```

Example:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name vnoc.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Replace:

```text
vnoc.example.com
```

with the real domain.

---

# 20. Enable the Nginx Site

Create the symlink:

```bash
sudo ln -s /etc/nginx/sites-available/blueconnects-vnoc \
  /etc/nginx/sites-enabled/blueconnects-vnoc
```

Test Nginx:

```bash
sudo nginx -t
```

If successful:

```bash
sudo systemctl reload nginx
```

Check:

```bash
sudo systemctl status nginx
```

---

# 21. Configure DNS

Create a DNS record:

```text
Type: A
Name: vnoc
Value: YOUR_EC2_PUBLIC_IP
```

For example:

```text
vnoc.example.com -> 203.0.113.10
```

Use an Elastic IP for production so the server's public address does not unexpectedly change if the instance is stopped/started.

---

# 22. Configure HTTPS

Use HTTPS in production.

A common setup is Let's Encrypt with Certbot.

Install Certbot and the Nginx plugin:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Run:

```bash
sudo certbot --nginx -d vnoc.example.com
```

Follow the prompts.

Verify renewal configuration:

```bash
sudo certbot renew --dry-run
```

Your production endpoint should ultimately be:

```text
https://vnoc.example.com
```

---

# 23. Test the Production Application

Check the public site:

```bash
curl -I https://vnoc.example.com
```

Check Next.js directly from the server:

```bash
curl -I http://127.0.0.1:3000
```

Check Nginx:

```bash
sudo systemctl status nginx
```

Check PM2:

```bash
pm2 status
```

Check logs:

```bash
pm2 logs blueconnects-vnoc --lines 100
```

---

# 24. GitHub Actions CI/CD

Create:

```text
.github/workflows/deploy.yml
```

A simple first-stage deployment workflow:

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.2.2
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            set -e

            cd ~/apps/blueconnects-vnoc

            git fetch origin
            git reset --hard origin/main

            npm ci

            npm run build

            pm2 restart blueconnects-vnoc --update-env
```

The important sequence is:

```text
git push
   ↓
GitHub Actions
   ↓
SSH to EC2
   ↓
git fetch
   ↓
git reset
   ↓
npm ci
   ↓
npm run build
   ↓
pm2 restart
```

---

# 25. GitHub Actions Secrets

In GitHub:

```text
Repository
  → Settings
  → Secrets and variables
  → Actions
```

Create:

```text
EC2_HOST
EC2_USERNAME
EC2_SSH_KEY
```

Example values:

```text
EC2_HOST
203.0.113.10

EC2_USERNAME
ubuntu

EC2_SSH_KEY
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Never put the private key directly into the workflow file.

---

# 26. Important SSH Security

The deployment key should have only the access required for deployment.

Do not share personal SSH private keys with the team.

Prefer a dedicated deployment key.

The public key can be installed in the deployment user's:

```text
~/.ssh/authorized_keys
```

The private key belongs in GitHub Actions Secrets.

---

# 27. Recommended CI Before Deployment

A production workflow should eventually validate the code before touching production.

Example:

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.2.2
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            set -e

            cd ~/apps/blueconnects-vnoc

            git fetch origin
            git reset --hard origin/main

            npm ci

            npm run build

            pm2 restart blueconnects-vnoc --update-env
```

The deployment is blocked when lint/build fails.

---

# 28. Do Not Deploy Every Branch

Recommended branch model:

```text
feature/*
    |
    v
pull request
    |
    v
develop
    |
    v
staging
    |
    v
main
    |
    v
production
```

At minimum:

```text
feature/*
    ↓
main
    ↓
production
```

The `main` branch should be protected.

Require pull requests and CI checks before merging.

---

# 29. Production Deployment Workflow

The team's normal process should be:

### Step 1 — Create a feature branch

```bash
git checkout -b feature/mvno-api-records
```

### Step 2 — Develop

```bash
npm run dev
```

### Step 3 — Verify locally

```bash
npm run lint
npm run build
```

### Step 4 — Commit

```bash
git add .
git commit -m "Add MVNO API records"
```

### Step 5 — Push

```bash
git push origin feature/mvno-api-records
```

### Step 6 — Open Pull Request

Reviewers check:

- functionality
- TypeScript
- database queries
- security
- UI
- performance
- migrations

### Step 7 — Merge into main

After required checks pass:

```text
feature → main
```

### Step 8 — Automatic deployment

GitHub Actions:

```text
main
 ↓
CI
 ↓
npm ci
 ↓
npm run lint
 ↓
npm run build
 ↓
deploy to EC2
 ↓
npm ci
 ↓
npm run build
 ↓
pm2 restart
```

---

# 30. Database Migrations

Application deployments and database changes must be treated as separate but coordinated operations.

Do not manually make production schema changes without a migration record.

A migration process should eventually look like:

```text
Migration file
      ↓
Review
      ↓
Test on development
      ↓
Test on staging
      ↓
Backup/verification
      ↓
Production migration
      ↓
Application deployment
```

Prefer backward-compatible migrations.

Example:

### Release 1

Add a nullable column:

```sql
ALTER TABLE users
ADD COLUMN display_name VARCHAR(255) NULL;
```

Deploy application code that can work with both old and new schema.

### Release 2

Backfill data.

### Release 3

Only after all application code uses the field safely, add stricter constraints if required.

Avoid migrations that immediately destroy data required by the currently running application.

---

# 31. Transactions and Multiple MySQL Databases

This project uses primary and secondary MySQL pools.

Normal transactions are database-specific:

```ts
await withTransaction(async (connection) => {
  // operations using this connection
});
```

A transaction on the primary pool does not automatically make a secondary-database operation atomic.

Do not assume:

```text
Primary DB transaction
+
Secondary DB transaction
=
One atomic transaction
```

For cross-database workflows, use an architecture appropriate to the business requirement, such as:

- idempotency
- transactional outbox
- Saga pattern
- compensation
- or distributed transactions/XA where genuinely required

---

# 32. Next.js Production Process

The production process should be:

```bash
npm run build
npm start
```

PM2 manages the `npm start` process.

You should not repeatedly SSH into production and manually run:

```bash
npm start
```

PM2 does this continuously.

Check:

```bash
pm2 status
```

Restart:

```bash
pm2 restart blueconnects-vnoc
```

Stop:

```bash
pm2 stop blueconnects-vnoc
```

Start:

```bash
pm2 start blueconnects-vnoc
```

---

# 33. Useful PM2 Commands

List applications:

```bash
pm2 list
```

Logs:

```bash
pm2 logs
```

Application logs:

```bash
pm2 logs blueconnects-vnoc
```

Restart:

```bash
pm2 restart blueconnects-vnoc
```

Reload:

```bash
pm2 reload blueconnects-vnoc
```

Describe process:

```bash
pm2 describe blueconnects-vnoc
```

Save processes:

```bash
pm2 save
```

---

# 34. Useful Nginx Commands

Check configuration:

```bash
sudo nginx -t
```

Reload:

```bash
sudo systemctl reload nginx
```

Restart:

```bash
sudo systemctl restart nginx
```

Status:

```bash
sudo systemctl status nginx
```

View Nginx errors:

```bash
sudo tail -f /var/log/nginx/error.log
```

View access logs:

```bash
sudo tail -f /var/log/nginx/access.log
```

---

# 35. Deployment Failure Procedure

If GitHub Actions fails:

1. Open the GitHub Actions run.
2. Identify the failed command.
3. Do not immediately restart production blindly.
4. Determine whether the failure happened during:
   - CI
   - dependency installation
   - build
   - database migration
   - PM2 restart
   - application startup
5. Check production logs.

On EC2:

```bash
pm2 status
pm2 logs blueconnects-vnoc --lines 200
```

Check Nginx:

```bash
sudo nginx -t
sudo systemctl status nginx
```

Test Next.js:

```bash
curl -I http://127.0.0.1:3000
```

Test public endpoint:

```bash
curl -I https://vnoc.example.com
```

---

# 36. Emergency Rollback — Basic Approach

The simple deployment model uses Git.

If a known-good commit is required:

```bash
cd ~/apps/blueconnects-vnoc

git log --oneline -10
```

Identify the known-good commit.

Then:

```bash
git reset --hard KNOWN_GOOD_COMMIT
```

Reinstall/build:

```bash
npm ci
npm run build
```

Restart:

```bash
pm2 restart blueconnects-vnoc --update-env
```

Use this only when the database schema is compatible with the rollback.

A database migration can make an application rollback unsafe.

---

# 37. Better Release/Rollback Model

As the application becomes more important, use release directories instead of building directly inside the active application directory.

Example:

```text
~/apps/blueconnects-vnoc/
├── releases/
│   ├── 20260902-190000/
│   ├── 20260902-210000/
│   └── 20260903-090000/
├── shared/
│   └── .env.production
└── current -> releases/20260903-090000
```

Deployment:

```text
Build release
      ↓
Upload release
      ↓
Install dependencies
      ↓
Build
      ↓
Run safe migrations
      ↓
Switch current symlink
      ↓
PM2 reload/restart
```

Rollback:

```text
current
  ↓
previous release
```

This is a more robust deployment strategy for production.

---

# 38. Health Check Endpoint

Create a simple health endpoint.

For example:

```text
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

The endpoint should be lightweight.

It can verify application availability without performing expensive database queries.

For deeper monitoring, create a separate readiness check that verifies required dependencies.

---

# 39. Monitoring

At minimum monitor:

```text
Application uptime
HTTP 4xx
HTTP 5xx
Response latency
CPU
RAM
Disk
PM2 process status
Nginx errors
Database connectivity
Database CPU/connections
```

Useful first checks:

```bash
pm2 status
free -h
df -h
uptime
```

For a more mature environment, use AWS CloudWatch or another observability platform.

---

# 40. Logging

Do not rely exclusively on terminal output.

At minimum maintain:

```text
Application logs
Nginx access logs
Nginx error logs
Deployment logs
Database/migration logs
```

Avoid logging:

- passwords
- database URLs
- API keys
- session tokens
- authorization headers
- sensitive user data

---

# 41. Security Checklist

Before production:

- [ ] SSH restricted to trusted IPs where possible
- [ ] SSH key authentication enabled
- [ ] Password SSH login disabled where appropriate
- [ ] Root login disabled
- [ ] Port 3000 not publicly exposed
- [ ] MySQL not publicly exposed unnecessarily
- [ ] HTTPS enabled
- [ ] Production secrets not committed
- [ ] `.env.production` protected if used
- [ ] GitHub deployment key protected
- [ ] GitHub branch protection enabled
- [ ] Dependencies audited
- [ ] Database credentials rotated appropriately
- [ ] Application errors do not expose secrets
- [ ] Backups configured
- [ ] Monitoring configured
- [ ] Rollback process documented

---

# 42. Backups

Production databases must have backups.

The backup strategy should define:

- frequency
- retention
- encryption
- recovery procedure
- backup verification
- recovery point objective (RPO)
- recovery time objective (RTO)

A backup that has never been restored/tested should not be considered a verified recovery strategy.

---

# 43. Scaling

A single EC2 instance is appropriate as a starting point, but it is not automatically highly available.

Single-server architecture:

```text
Internet
   |
   v
EC2
 |
 +-- Nginx
 |
 +-- Next.js
```

If the EC2 instance fails, the application is unavailable.

A more scalable architecture is:

```text
Internet
   |
   v
Application Load Balancer
   |
   +--------+
   |        |
   v        v
 EC2      EC2
   |        |
   +---+----+
       |
      DB
```

At that stage:

- application instances should be stateless
- shared files should not live only on one instance
- sessions should use an appropriate shared/session strategy
- database connection limits must be planned
- deployments should use rolling/blue-green strategies
- Auto Scaling can be introduced

---

# 44. Docker/ECS Future Option

When the application requires more scalable infrastructure, consider:

```text
GitHub
   ↓
GitHub Actions
   ↓
Docker image
   ↓
Amazon ECR
   ↓
ECS/Fargate
   ↓
Application Load Balancer
   ↓
Next.js containers
```

This is more operationally sophisticated than EC2 + PM2.

For the current boilerplate, EC2 + PM2 is a reasonable first production deployment.

---

# 45. Recommended Production `package.json`

A typical configuration:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

Do not change the production start command to development mode.

Production uses:

```bash
npm run build
npm start
```

Never:

```bash
npm run dev
```

on the production server.

---

# 46. Recommended Server Directory

Use:

```text
/home/ubuntu/apps/blueconnects-vnoc
```

rather than deploying into `/var/www` unless the team's infrastructure standard requires it.

The deployment user should own the application directory:

```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/apps/blueconnects-vnoc
```

Avoid running the Next.js application as root.

---

# 47. Production Deployment Checklist

## Infrastructure

- [ ] EC2 created
- [ ] Elastic IP configured
- [ ] Security group configured
- [ ] SSH access tested
- [ ] Node installed
- [ ] Git installed
- [ ] Nginx installed
- [ ] PM2 installed

## Application

- [ ] Repository cloned
- [ ] Correct Node version selected
- [ ] `.env.production` configured securely
- [ ] `npm ci` successful
- [ ] `npm run build` successful
- [ ] `npm start` tested
- [ ] PM2 configured
- [ ] PM2 startup configured

## Network

- [ ] DNS configured
- [ ] Nginx configured
- [ ] Port 80 configured
- [ ] Port 443 configured
- [ ] Port 3000 private
- [ ] HTTPS working

## CI/CD

- [ ] GitHub Actions workflow created
- [ ] GitHub secrets configured
- [ ] CI checks configured
- [ ] Deployment tested
- [ ] Failure behavior understood
- [ ] Rollback procedure documented

## Database

- [ ] Production DB configured
- [ ] Primary DB connectivity tested
- [ ] Secondary DB connectivity tested
- [ ] Database credentials secured
- [ ] Backup policy configured
- [ ] Migration strategy documented

## Monitoring

- [ ] Health endpoint available
- [ ] PM2 logs accessible
- [ ] Nginx logs accessible
- [ ] CPU/RAM/disk monitoring configured
- [ ] Error monitoring configured
- [ ] Alerts configured

---

# 48. Day-to-Day Developer Workflow

Developers should generally NOT SSH into production to deploy.

Normal workflow:

```bash
git checkout -b feature/my-change

# development
npm run dev

# validation
npm run lint
npm run build

# commit
git add .
git commit -m "Add my change"

# push
git push origin feature/my-change
```

Open a pull request.

After review and merge:

```text
main
 ↓
GitHub Actions
 ↓
CI
 ↓
Build
 ↓
Deploy
 ↓
PM2 restart
```

---

# 49. Production Server Manual Commands

For authorized DevOps/operations users:

### Check application

```bash
pm2 status
```

### Check logs

```bash
pm2 logs blueconnects-vnoc --lines 200
```

### Restart application

```bash
pm2 restart blueconnects-vnoc --update-env
```

### Check Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
```

### Check server resources

```bash
free -h
df -h
uptime
```

### Check local application

```bash
curl -I http://127.0.0.1:3000
```

### Check public application

```bash
curl -I https://vnoc.example.com
```

---

# 50. Troubleshooting Matrix

| Problem | First check |
|---|---|
| Site unavailable | Nginx + PM2 |
| 502 Bad Gateway | Next.js/PM2 on port 3000 |
| Build failure | GitHub Actions build logs |
| App crashes | `pm2 logs` |
| Database connection failure | Environment variables + security group |
| HTTPS failure | Certbot/Nginx/DNS |
| Deployment SSH failure | GitHub secret + EC2 SSH configuration |
| Out of disk | `df -h` |
| Out of memory | `free -h` / PM2 |
| Wrong application version | Git commit + deployment logs |
| Migration failure | Migration logs + DB state |

For a 502 error:

```bash
pm2 status
curl http://127.0.0.1:3000
sudo nginx -t
```

If:

```bash
curl http://127.0.0.1:3000
```

fails, investigate Next.js/PM2.

If it works but the public URL fails, investigate Nginx/DNS/TLS/networking.

---

# 51. Important Production Rules

## Rule 1 — Never commit secrets

```text
.env.production
database passwords
API keys
private SSH keys
JWT secrets
```

must not be committed.

## Rule 2 — Never expose port 3000 publicly

Nginx should proxy to:

```text
127.0.0.1:3000
```

## Rule 3 — Never run Next.js development mode in production

Use:

```bash
npm run build
npm start
```

## Rule 4 — Do not manually modify production code

Production should be produced by the deployment pipeline.

## Rule 5 — Database migrations require review

A database change can be more dangerous than an application deployment.

## Rule 6 — Test rollback

Do not wait for a production incident to discover that rollback does not work.

## Rule 7 — Keep production access limited

Only authorized team members should have production SSH access.

---

# 52. Recommended Evolution

### Stage 1 — Current

```text
GitHub
  ↓
GitHub Actions
  ↓
EC2
  ↓
Nginx
  ↓
PM2
  ↓
Next.js
  ↓
MySQL
```

Good for:

- small/medium applications
- straightforward operations
- full server control
- low infrastructure complexity

### Stage 2 — Improved deployment

```text
GitHub
  ↓
GitHub Actions
  ↓
Build artifact
  ↓
Release directory
  ↓
Atomic switch
  ↓
PM2 reload
```

Adds safer releases and rollback.

### Stage 3 — Highly available

```text
GitHub
  ↓
GitHub Actions
  ↓
Docker
  ↓
ECR
  ↓
ECS/Fargate
  ↓
ALB
  ↓
Multiple containers
  ↓
MySQL
```

Adds horizontal scaling and stronger infrastructure automation.

---

# 53. Final Target

For the current BlueConnects boilerplate, the recommended first production target is:

```text
                       GitHub
                          |
                          | push main
                          v
                  GitHub Actions
                          |
                 +--------+--------+
                 |                 |
              Lint              Build
                 |                 |
                 +--------+--------+
                          |
                          | SSH
                          v
                    AWS EC2
                          |
                    +-----+-----+
                    |   Nginx   |
                    | HTTPS :443|
                    +-----+-----+
                          |
                    localhost:3000
                          |
                    +-----+-----+
                    |   PM2     |
                    |  Next.js  |
                    +-----+-----+
                          |
              +-----------+-----------+
              |                       |
              v                       v
       MySQL Primary          MySQL Secondary
```

The team developer experience should be:

```bash
git push origin main
```

The deployment system handles:

```text
✓ CI
✓ dependency installation
✓ production build
✓ deployment
✓ Next.js restart
✓ process supervision
✓ HTTPS/reverse proxy
```

The long-term objective is to move toward immutable releases, managed secrets, automated migrations, monitoring, tested rollback, and eventually multiple application instances when required.
