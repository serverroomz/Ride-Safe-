# GoCab AWS Production Architecture

## Overview
This document outlines the complete AWS infrastructure setup for deploying GoCab to production with high availability, scalability, and security.

## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        CloudFront CDN                           │
│                  (Edge locations worldwide)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    Route 53 (DNS)                               │
│                  (Geolocation routing)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                  AWS WAF + Shield                               │
│              (DDoS protection & filtering)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────┴────────┐               ┌───────────┴─────────┐
│   ALB (Multi   │               │   ALB (Multi        │
│   Region)      │               │   Region)           │
│   US-EAST-1    │               │   EU-WEST-1         │
└────────┬───────┘               └──────────┬──────────┘
         │                                   │
    ┌────┴────┐                         ┌────┴────┐
    │          │                         │          │
┌───┴──┐    ┌──┴──┐                 ┌───┴──┐    ┌──┴──┐
│ ECS  │    │ ECS │                 │ ECS  │    │ ECS │
│Fargate│   │Fargate│              │Fargate│   │Fargate│
│(API) │    │(API) │               │(API) │    │(API) │
└──┬───┘    └──┬───┘               └──┬───┘    └──┬───┘
   │           │                      │           │
   └─────┬─────┘                      └─────┬─────┘
         │                                   │
    ┌────┴─────────────────────┬───────────┴────┐
    │                          │                │
┌───┴────────┐         ┌──────┴─────┐    ┌────┴──────┐
│ RDS Aurora │         │   ElastiCache   │ S3 Buckets│
│   MySQL    │         │   (Redis)      │ (uploads) │
│Multi-AZ    │         │ Multi-AZ       │           │
└────────────┘         └────────────────┘    └───────┘
    │                        │
    │                        │
┌───┴────────────────────────┴──────────┐
│        AWS Backup & Disaster          │
│            Recovery (DR)              │
│  - Automated snapshots                │
│  - Cross-region replication           │
│  - Backup vaults                      │
└───────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│              Monitoring & Logging                             │
├───────────────────────────────────────────────────────────────┤
│ - CloudWatch (metrics, logs, alarms)                          │
│ - X-Ray (distributed tracing)                                 │
│ - EventBridge (event-driven architecture)                     │
│ - SNS (notifications)                                         │
│ - SQS (async message queue)                                   │
│ - Lambda (serverless functions for notifications)             │
└───────────────────────────────────────────────────────────────┘
```

## AWS Services Used

### 1. **Compute**
- **ECS Fargate**: Container orchestration for API services
  - Auto-scaling based on CPU/memory
  - Blue-green deployments
  - Task definitions for API containers

- **Lambda**: Serverless functions
  - Payment processing callbacks
  - Email notifications
  - SMS notifications
  - Image processing
  - Scheduled tasks

### 2. **Database**
- **RDS Aurora MySQL**: Primary database
  - Multi-AZ deployment
  - Automated backups (35-day retention)
  - Read replicas for scaling
  - Parameter groups for optimization
  - Enhanced monitoring

- **ElastiCache Redis**: Caching layer
  - Session management
  - Real-time data caching
  - Socket.IO adapter
  - Multi-AZ automatic failover

### 3. **Storage**
- **S3**: Object storage
  - KYC documents
  - User profile photos
  - Trip invoices/receipts
  - Backup archives
  - Versioning enabled
  - Server-side encryption

- **EBS**: Persistent volumes
  - Database storage
  - Application logs

### 4. **Networking**
- **VPC**: Virtual private network
  - Public subnets for ALB
  - Private subnets for ECS/RDS
  - NAT Gateways for outbound traffic
  - Security Groups for firewall rules
  - Network ACLs for additional security

- **Application Load Balancer (ALB)**:
  - Path-based routing
  - HTTPS termination
  - Health checks
  - Security headers

- **Route 53**: DNS management
  - Health checks
  - Failover routing
  - Geolocation routing
  - Weighted routing

- **CloudFront**: CDN
  - Edge caching
  - SSL/TLS termination
  - Request filtering

### 5. **Security**
- **AWS Secrets Manager**: Credential management
  - API keys
  - Database passwords
  - Payment gateway credentials

- **IAM**: Identity & Access Management
  - Role-based access control
  - Service-to-service permissions
  - User policies

- **AWS KMS**: Key management
  - Encryption keys
  - Envelope encryption
  - Audit logging

- **AWS WAF**: Web Application Firewall
  - SQL injection prevention
  - XSS protection
  - Rate limiting
  - Geographic blocking

- **AWS Shield**: DDoS protection
  - Standard (included)
  - Advanced (optional)

### 6. **Monitoring & Logging**
- **CloudWatch**:
  - Custom metrics
  - Log groups
  - Alarms & notifications
  - Dashboards

- **AWS X-Ray**: Distributed tracing
  - Request tracing
  - Service map
  - Performance analytics

- **EventBridge**: Event routing
  - Ride events
  - Payment events
  - User events

### 7. **Message Queues**
- **SQS**: Asynchronous processing
  - Payment processing
  - Email queue
  - SMS queue
  - Notifications

- **SNS**: Publish/Subscribe
  - Push notifications
  - Email notifications
  - SMS notifications
  - Lambda triggers

### 8. **CI/CD & Deployment**
- **CodePipeline**: Continuous deployment
- **CodeBuild**: Build & test
- **CodeDeploy**: Deployment automation
- **ECR**: Docker registry

## Deployment Steps

### Prerequisites
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Install Terraform (optional but recommended)
brew install terraform
```

### 1. VPC Setup
```bash
# Create VPC with public/private subnets
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
```

### 2. RDS Aurora Setup
```bash
# Create DB cluster
aws rds create-db-cluster \
  --db-cluster-identifier gocab-production \
  --engine aurora-mysql \
  --master-username admin \
  --master-user-password $(echo $DB_PASSWORD) \
  --db-subnet-group-name gocab-sg

# Create DB instance
aws rds create-db-instance \
  --db-instance-identifier gocab-prod-1 \
  --db-instance-class db.r5.large \
  --db-cluster-identifier gocab-production
```

### 3. ElastiCache Setup
```bash
# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-description "GoCab production Redis" \
  --engine redis \
  --cache-node-type cache.r6g.xlarge \
  --port 6379 \
  --num-cache-clusters 2 \
  --automatic-failover-enabled
```

### 4. ECR Repository
```bash
# Create ECR repository
aws ecr create-repository --repository-name gocab-api

# Push Docker image
docker tag gocab-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/gocab-api:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/gocab-api:latest
```

### 5. ECS Fargate Setup
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name gocab-production

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster gocab-production \
  --service-name gocab-api \
  --task-definition gocab-api:1 \
  --desired-count 3 \
  --launch-type FARGATE
```

### 6. Load Balancer Setup
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name gocab-alb \
  --subnets subnet-xxxxx subnet-xxxxx

# Create target group
aws elbv2 create-target-group \
  --name gocab-targets \
  --protocol HTTP \
  --port 5000
```

### 7. S3 & CloudFront
```bash
# Create S3 bucket
aws s3 mb s3://gocab-uploads --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket gocab-uploads \
  --versioning-configuration Status=Enabled

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cf-config.json
```

## Auto-Scaling Configuration

### ECS Service Auto-Scaling
```
Target CPU: 70%
Target Memory: 80%
Min tasks: 3
Max tasks: 20
Scale-up cooldown: 60 seconds
Scale-down cooldown: 300 seconds
```

### RDS Auto-Scaling
```
Minimum Aurora replicas: 2
Maximum Aurora replicas: 5
Target connections: 70% of capacity
Storage auto-scaling: Enabled (max 100GB)
```

## Backup & Disaster Recovery

### RDS Backup Policy
- Automated daily backups (35-day retention)
- Multi-region replication
- Point-in-time recovery enabled

### S3 Backup
- Cross-region replication to us-west-2
- Versioning enabled
- Lifecycle policies for archival

### Disaster Recovery (DR)
- RTO (Recovery Time Objective): 15 minutes
- RPO (Recovery Point Objective): 5 minutes
- Multi-region failover setup
- Automated DNS failover

## Cost Optimization

### Recommendations
1. **Reserved Instances**: Purchase 1-year RDS reserved instances (40% savings)
2. **Spot Instances**: Use Spot for non-critical services
3. **S3 Intelligent-Tiering**: Automatically move data to cheaper storage classes
4. **CloudFront**: Enable caching to reduce origin requests
5. **Lambda**: Use for event-driven processing instead of always-on services

### Estimated Monthly Costs (US-EAST-1)
- ECS Fargate: $800-1200
- RDS Aurora: $1500-2000
- ElastiCache: $400-600
- S3: $100-300
- CloudFront: $200-500
- Miscellaneous (ALB, NAT, etc.): $300-500
- **Total**: ~$3300-5100/month

## Monitoring & Alerts

### Key Metrics to Monitor
1. **Application Metrics**
   - Request latency (target: <200ms)
   - Error rate (target: <0.1%)
   - Request volume
   - Active connections

2. **Database Metrics**
   - CPU utilization (alert: >80%)
   - Database connections (alert: >80%)
   - Replication lag (alert: >1 second)
   - Storage used (alert: >80%)

3. **Infrastructure Metrics**
   - ECS CPU (alert: >80%)
   - ECS Memory (alert: >80%)
   - ALB target health
   - Redis evictions

### CloudWatch Alarms
```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name gocab-high-error-rate \
  --alarm-actions arn:aws:sns:us-east-1:123456789:alerts

# Database CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name gocab-rds-high-cpu \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## Security Best Practices

1. **Network Security**
   - Enable VPC Flow Logs
   - Use Security Groups to restrict traffic
   - Enable AWS WAF for web application protection

2. **Data Security**
   - Enable encryption at rest (S3, RDS, EBS)
   - Enable encryption in transit (HTTPS/TLS)
   - Use AWS KMS for key management

3. **Access Control**
   - Use IAM roles for service authentication
   - Enable MFA for console access
   - Regular Access Analyzer reviews
   - Use Secrets Manager for credentials

4. **Compliance**
   - Enable CloudTrail for audit logging
   - Regular security assessments
   - Compliance with GDPR/privacy regulations
   - PCI-DSS for payment processing

## Deployment Checklist

- [ ] VPC and networking configured
- [ ] RDS Aurora cluster created and tested
- [ ] ElastiCache Redis configured
- [ ] S3 buckets created with proper permissions
- [ ] ECR repository created
- [ ] ECS cluster and services deployed
- [ ] Load balancer configured
- [ ] CloudFront distribution created
- [ ] SSL/TLS certificates installed
- [ ] Route 53 DNS records configured
- [ ] CloudWatch monitoring and alarms set up
- [ ] Backup and DR procedures tested
- [ ] Security groups and NACLs configured
- [ ] AWS WAF rules configured
- [ ] CloudTrail enabled for audit logging
- [ ] Load testing completed
- [ ] Documentation updated

## Terraform Implementation

For infrastructure as code, use the included Terraform files:
```bash
cd terraform/
terraform plan
terraform apply
```

## Support & Troubleshooting

- Access logs: CloudWatch Logs
- Error tracking: X-Ray tracing
- Performance: CloudWatch dashboards
- Security: GuardDuty findings

For detailed troubleshooting guides, see the [Troubleshooting Guide](./TROUBLESHOOTING.md).
