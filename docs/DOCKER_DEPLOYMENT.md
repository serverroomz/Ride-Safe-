# Docker Deployment Guide

## Quick Start with Docker Compose

### Prerequisites
- Docker 20.10+
- Docker Compose 1.29+
- 4GB RAM minimum
- 10GB disk space

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/gocab.git
cd gocab
```

### Step 2: Setup Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit with your actual values
nano .env
```

### Step 3: Start Services
```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### Step 4: Verify Services
```bash
# API health check
curl http://localhost:5000/health

# MongoDB check
docker-compose exec mongodb mongosh -u admin -p

# Redis check
docker-compose exec redis redis-cli ping

# Access admin dashboard
open http://localhost:3000  # Grafana
open http://localhost:5601  # Kibana
```

## Production Deployment

### Option 1: Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml gocab

# Check services
docker service ls
docker service ps gocab_backend

# Scale service
docker service scale gocab_backend=5
```

### Option 2: Kubernetes
```bash
# Create namespace
kubectl create namespace gocab

# Create secrets
kubectl create secret generic gocab-secrets \
  --from-env-file=.env \
  -n gocab

# Apply manifests
kubectl apply -f k8s/

# Check deployment
kubectl get pods -n gocab
kubectl logs -f deployment/gocab-api -n gocab
```

### Option 3: AWS ECS
```bash
# Login to AWS
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag gocab-backend:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/gocab-api:latest

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/gocab-api:latest

# Update ECS service
aws ecs update-service \
  --cluster gocab-production \
  --service gocab-api \
  --force-new-deployment
```

## Image Management

### Building Custom Images
```bash
# Build backend
docker build -t gocab-backend:latest ./backend

# Build mobile apps (if using Docker)
docker build -t gocab-rider-app:latest ./rider-app
docker build -t gocab-driver-app:latest ./driver-app

# Build admin dashboard
docker build -t gocab-admin:latest ./admin-dashboard
```

### Image Registry
```bash
# Tag for registry
docker tag gocab-backend:latest myregistry.azurecr.io/gocab-backend:v1.0

# Push to registry
docker push myregistry.azurecr.io/gocab-backend:v1.0

# Pull from registry
docker pull myregistry.azurecr.io/gocab-backend:v1.0
```

## Monitoring & Logs

### Docker Logs
```bash
# View container logs
docker-compose logs backend mongodb redis

# Follow logs
docker-compose logs -f backend

# Filter logs by time
docker-compose logs --since 2024-03-10 backend
```

### Prometheus Metrics
```bash
# Access Prometheus
open http://localhost:9090

# Query metrics
- container_memory_usage_bytes
- container_cpu_usage_seconds_total
- http_requests_total
- http_request_duration_seconds
```

### Grafana Dashboards
```
URL: http://localhost:3000
Username: admin
Password: admin (change on first login)

Pre-configured dashboards:
- API Performance
- Database Metrics
- Container Health
- Request Rate
```

### Kibana Logs
```
URL: http://localhost:5601

Pre-configured logs:
- Application logs
- Database logs
- API access logs
- Error logs
```

## Backup & Restore

### Database Backup
```bash
# Export database
docker-compose exec mongodb mongodump \
  --uri="mongodb://admin:password@mongodb:27017/gocab?authSource=admin" \
  --out=/backup

# Copy backup out
docker cp gocab-mongodb:/backup ./backups/

# Restore database
docker-compose exec mongodb mongorestore \
  --uri="mongodb://admin:password@mongodb:27017/gocab?authSource=admin" \
  /backup
```

### Redis Backup
```bash
# Create snapshot
docker-compose exec redis redis-cli BGSAVE

# Copy backup
docker cp gocab-redis:/data/dump.rdb ./backups/

# Restore
docker cp ./backups/dump.rdb gocab-redis:/data/
```

## Scaling & Performance

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=5

# Scale with specific limits
docker service scale gocab_backend=10

# Update load balancer
# Nginx will automatically distribute traffic
```

### Resource Limits
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### CPU & Memory Optimization
```bash
# Monitor resource usage
docker stats

# View detailed stats
docker-compose top backend
docker-compose top mongodb

# Optimize Node.js heap
docker-compose exec backend node --max-old-space-size=1024 server.js
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Inspect container
docker inspect gocab-backend

# Rebuild image
docker-compose build --no-cache backend
docker-compose up backend
```

### Port Conflicts
```bash
# Find process using port
lsof -i :5000
netstat -tulpn | grep 5000

# Release port
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "5001:5000"  # Changed from 5000
```

### Database Connection Issues
```bash
# Test MongoDB connection
docker-compose exec backend mongosh \
  mongodb://admin:password@mongodb:27017/gocab?authSource=admin

# Check MongoDB logs
docker-compose logs mongodb

# Reset database
docker-compose down -v  # Remove volumes
docker-compose up -d   # Recreate fresh
```

### Memory Leaks
```bash
# Monitor memory over time
docker stats --no-stream

# Enable memory swap limit
docker-compose up --memory=2g

# Restart container periodically
docker-compose restart backend
```

## Maintenance

### Regular Tasks
```bash
# Weekly updates
docker-compose pull
docker-compose up -d

# Monthly cleanup
docker system prune -a  # Remove unused images
docker volume prune     # Remove unused volumes

# Backup databases
docker-compose exec mongodb mongodump --out /backup

# Check health
docker-compose ps
docker-compose logs --tail=100 backend
```

### Update Procedure
```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild images
docker-compose build

# 3. Create backup
docker-compose exec mongodb mongodump --out /backup

# 4. Update services
docker-compose up -d

# 5. Verify
curl http://localhost:5000/health

# 6. Check logs
docker-compose logs -f
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backups scheduled
- [ ] Monitoring and alerts set up
- [ ] Log aggregation configured
- [ ] SSL/TLS certificates installed
- [ ] Resource limits set
- [ ] Auto-restart policies enabled
- [ ] Health checks configured
- [ ] Backup and restore tested
- [ ] Disaster recovery plan documented
- [ ] Performance tuning completed
- [ ] Security scanning enabled
- [ ] Rate limiting configured
- [ ] Database replication set up

## Performance Benchmarks

### Expected Performance
- **API Response Time**: <200ms (99th percentile)
- **Database Queries**: <50ms average
- **Cache Hit Rate**: >80%
- **Throughput**: 1000+ requests/second

### Optimization Tips
1. Enable redis caching for frequent queries
2. Use database indexes properly
3. Optimize Docker image size
4. Use health checks for quick failover
5. Configure proper memory limits
6. Use compression for API responses
7. Implement API rate limiting

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Kubernetes Deployment](https://kubernetes.io/docs/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)

## Support

For Docker-related issues, check:
1. Container logs: `docker-compose logs`
2. Container stats: `docker stats`
3. Network issues: `docker network inspect`
4. Volume issues: `docker volume inspect`

## Security Considerations

1. **Always use secrets management** - Don't hardcode credentials
2. **Keep images updated** - Pull latest base images
3. **Scan images for vulnerabilities** - Use Docker Scout or Trivy
4. **Use private registries** - Don't push to public DockerHub
5. **Sign images** - Use Docker Content Trust
6. **Limit container resources** - Prevent resource exhaustion
7. **Run as non-root** - Don't use root user in containers
8. **Use read-only filesystems** - Where possible
