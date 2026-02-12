# GitHub Secrets Setup Guide

This document explains how to configure secrets for each environment in your GitHub repository.

## 📋 Setting Up GitHub Secrets

### Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on **Settings** tab
3. Navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**

---

## 🔐 Required Secrets for Each Environment

### **Staging Environment Secrets**
Add these secrets with the `STAGING_` prefix:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `STAGING_API_URL` | Staging API endpoint | `https://staging-api.sampark.com` |
| `STAGING_DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `STAGING_REDIS_URL` | Redis connection string | `redis://host:6379` |
| `STAGING_UPSTASH_REDIS_REST_URL` | Upstash Redis URL | `https://xxx.upstash.io` |
| `STAGING_UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | `AXXXxxxxxx` |
| `STAGING_JWT_SECRET` | JWT signing secret | `random_strong_secret_key` |
| `STAGING_SESSION_SECRET` | Session secret | `another_random_secret` |
| `STAGING_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `staging-cloud` |
| `STAGING_CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `STAGING_CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefg` |
| `STAGING_GOOGLE_AI_API_KEY` | Google AI API key | `AIzaSyXXXXXX` |
| `STAGING_ALLOWED_ORIGINS` | CORS allowed origins | `https://staging.sampark.com` |

### **Production Environment Secrets**
Add these secrets with the `PRODUCTION_` prefix:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `PRODUCTION_API_URL` | Production API endpoint | `https://api.sampark.com` |
| `PRODUCTION_DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PRODUCTION_REDIS_URL` | Redis connection string | `redis://host:6379` |
| `PRODUCTION_UPSTASH_REDIS_REST_URL` | Upstash Redis URL | `https://xxx.upstash.io` |
| `PRODUCTION_UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | `AXXXxxxxxx` |
| `PRODUCTION_JWT_SECRET` | JWT signing secret | `STRONG_random_production_secret` |
| `PRODUCTION_SESSION_SECRET` | Session secret | `STRONG_production_session_secret` |
| `PRODUCTION_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `production-cloud` |
| `PRODUCTION_CLOUDINARY_API_KEY` | Cloudinary API key | `987654321` |
| `PRODUCTION_CLOUDINARY_API_SECRET` | Cloudinary API secret | `zyxwvut` |
| `PRODUCTION_GOOGLE_AI_API_KEY` | Google AI API key | `AIzaSyXXXXXX` |
| `PRODUCTION_ALLOWED_ORIGINS` | CORS allowed origins | `https://sampark.com,https://www.sampark.com` |

### **Docker & Deployment Secrets**

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DOCKER_USERNAME` | Docker Hub username | `your-dockerhub-username` |
| `DOCKER_PASSWORD` | Docker Hub password/token | `dckr_pat_xxxxx` |
| `AWS_ACCESS_KEY_ID` | AWS access key (if using AWS) | `AKIAXXXXXXXX` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `xxxxxxxxxx` |
| `AWS_REGION` | AWS region | `us-east-1` |

---

## 🔧 Alternative: AWS Systems Manager Parameter Store

If you prefer using AWS Parameter Store instead of GitHub Secrets:

### Step 1: Store Secrets in AWS Parameter Store
```bash
# Store staging secrets
aws ssm put-parameter --name /sampark/staging/database-url --value "postgresql://..." --type SecureString
aws ssm put-parameter --name /sampark/staging/jwt-secret --value "secret123" --type SecureString
aws ssm put-parameter --name /sampark/staging/redis-url --value "redis://..." --type SecureString

# Store production secrets
aws ssm put-parameter --name /sampark/production/database-url --value "postgresql://..." --type SecureString
aws ssm put-parameter --name /sampark/production/jwt-secret --value "prod-secret" --type SecureString
```

### Step 2: Retrieve in CI/CD Pipeline
```yaml
- name: Fetch secrets from AWS Parameter Store
  run: |
    export DATABASE_URL=$(aws ssm get-parameter --name /sampark/production/database-url --with-decryption --query 'Parameter.Value' --output text)
    export JWT_SECRET=$(aws ssm get-parameter --name /sampark/production/jwt-secret --with-decryption --query 'Parameter.Value' --output text)
```

---

## 🔵 Alternative: Azure Key Vault

If you prefer using Azure Key Vault:

### Step 1: Store Secrets in Azure Key Vault
```bash
# Create Key Vault (one-time)
az keyvault create --name sampark-keyvault --resource-group sampark-rg --location eastus

# Store secrets
az keyvault secret set --vault-name sampark-keyvault --name staging-database-url --value "postgresql://..."
az keyvault secret set --vault-name sampark-keyvault --name staging-jwt-secret --value "secret123"
az keyvault secret set --vault-name sampark-keyvault --name production-database-url --value "postgresql://..."
```

### Step 2: Retrieve in CI/CD Pipeline
```yaml
- name: Azure Login
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}

- name: Fetch secrets from Azure Key Vault
  uses: azure/get-keyvault-secrets@v1
  with:
    keyvault: "sampark-keyvault"
    secrets: 'staging-database-url, staging-jwt-secret'
  id: keyvault
```

---

## ✅ Verification Checklist

- [ ] All staging secrets added to GitHub repository
- [ ] All production secrets added to GitHub repository
- [ ] Docker Hub credentials configured
- [ ] AWS/Azure credentials configured (if applicable)
- [ ] Secrets tested in CI/CD pipeline
- [ ] No secrets committed to git repository
- [ ] `.env` files are in `.gitignore`
- [ ] Only `.env.example` is committed

---

## 🔒 Security Best Practices

1. **Never commit secrets to git** - Use `.gitignore` for all `.env` files
2. **Use strong random secrets** - Generate with `openssl rand -hex 32`
3. **Rotate secrets regularly** - Change JWT secrets periodically
4. **Use different secrets per environment** - Never reuse staging secrets in production
5. **Limit access** - Only give team members access to secrets they need
6. **Enable audit logs** - Monitor who accesses secrets in AWS/Azure
7. **Use principle of least privilege** - CI/CD should only have deployment permissions

---

## 🎯 Testing Your Setup

After adding secrets, test them by:

1. Push to `staging` branch → Check staging deployment logs
2. Verify environment variables are injected correctly
3. Check application connects to correct database
4. Test API endpoints with staging configuration
5. Repeat for production branch

---

## 📞 Need Help?

If secrets aren't working:
- Check secret names match exactly (case-sensitive)
- Verify GitHub Actions workflow has correct secret references
- Check AWS/Azure credentials have proper permissions
- Review deployment logs for missing environment variables
