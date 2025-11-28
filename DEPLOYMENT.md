# FleetSync Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Testing](#testing)
6. [Monitoring](#monitoring)

---

## Local Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup
```bash
# Install dependencies for all packages
npm install

# Start API server
cd packages/api
npm run dev

# Start Control Center (in new terminal)
cd packages/control-center
npm run dev

# Start Mobile App (in new terminal)
cd packages/mobile
npm run dev
```

### Telemetry Simulation
```bash
cd packages/api
npm run simulate
```

This will generate high-frequency telemetry events for testing.

---

## Docker Deployment

### Prerequisites
- Docker 20+
- Docker Compose 2+

### Build and Run
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access Services
- **Control Center**: http://localhost:3000
- **Mobile App**: http://localhost:3001
- **API**: http://localhost:4000

### Individual Service Commands
```bash
# Build specific service
docker-compose build api

# Restart service
docker-compose restart control-center

# View service logs
docker-compose logs -f api
```

---

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.24+)
- kubectl configured
- Helm 3+

### Install with Helm

1. **Update values**
   ```bash
   # Edit helm/values.yaml
   # Update image repositories and tags
   ```

2. **Install chart**
   ```bash
   helm install fleetsync ./helm \
     --namespace fleetsync \
     --create-namespace
   ```

3. **Verify deployment**
   ```bash
   kubectl get pods -n fleetsync
   kubectl get services -n fleetsync
   kubectl get ingress -n fleetsync
   ```

### Upgrade Deployment
```bash
helm upgrade fleetsync ./helm \
  --namespace fleetsync \
  --set api.image.tag=v1.1.0
```

### Uninstall
```bash
helm uninstall fleetsync --namespace fleetsync
```

### Manual Kubernetes Deployment

If not using Helm:

```bash
# Apply manifests
kubectl apply -f helm/templates/deployment.yaml
kubectl apply -f helm/templates/service.yaml
kubectl apply -f helm/templates/ingress.yaml

# Check status
kubectl get all -n fleetsync
```

---

## CI/CD Pipeline

### GitHub Actions

The project includes a complete CI/CD pipeline (`.github/workflows/ci-cd.yml`):

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Pipeline Stages:**

1. **Test API**
   - Lint code
   - Run unit tests
   - Run contract tests

2. **Test Control Center**
   - Lint code
   - Run component tests
   - Build production bundle

3. **Test Mobile**
   - Lint code
   - Build PWA

4. **Build Docker Images** (main branch only)
   - Build multi-arch images
   - Push to GitHub Container Registry
   - Tag with commit SHA and branch name

5. **Deploy** (main branch only)
   - Automatic deployment to staging
   - Manual approval for production

### Container Registry

Images are pushed to GitHub Container Registry:
- `ghcr.io/your-org/fleetsync-api:latest`
- `ghcr.io/your-org/fleetsync-control-center:latest`
- `ghcr.io/your-org/fleetsync-mobile:latest`

### Secrets Required

Add these to GitHub repository secrets:
- `GITHUB_TOKEN` (automatically provided)
- `KUBE_CONFIG` (for Kubernetes deployment)
- `MAPBOX_TOKEN` (for production builds)

---

## Testing

### Unit Tests

**API Tests:**
```bash
cd packages/api
npm test
```

**Control Center Tests:**
```bash
cd packages/control-center
npm test
```

### Load Testing

**Prerequisites:**
- k6 installed (`brew install k6` or download from k6.io)

**Run Load Test:**
```bash
cd packages/api
npm run load-test
```

**Custom Load Test:**
```bash
k6 run tests/load-test.js \
  --vus 100 \
  --duration 5m \
  --env API_URL=http://localhost:4000
```

### Integration Testing

**Test Telemetry Playback:**
```bash
# Start API
cd packages/api
npm run dev

# In another terminal, run simulation
npm run simulate

# Query playback
curl "http://localhost:4000/telemetry/vehicle/veh_1?from=2025-11-28T00:00:00Z&to=2025-11-28T23:59:59Z"
```

---

## Monitoring

### Health Checks

**API Health:**
```bash
curl http://localhost:4000/health
```

**Telemetry Stats:**
```bash
curl http://localhost:4000/telemetry/stats
```

### Kubernetes Monitoring

**Pod Status:**
```bash
kubectl get pods -n fleetsync -w
```

**Resource Usage:**
```bash
kubectl top pods -n fleetsync
kubectl top nodes
```

**Logs:**
```bash
# API logs
kubectl logs -f deployment/fleetsync-api -n fleetsync

# Control Center logs
kubectl logs -f deployment/fleetsync-control-center -n fleetsync

# All logs
kubectl logs -f -l app.kubernetes.io/name=fleetsync -n fleetsync
```

### Metrics (if Prometheus is installed)

```bash
# Port forward Prometheus
kubectl port-forward svc/prometheus 9090:9090 -n monitoring

# Access metrics at http://localhost:9090
```

---

## Production Checklist

### Before Deployment

- [ ] Update environment variables
- [ ] Configure SSL/TLS certificates
- [ ] Set up database (replace in-memory store)
- [ ] Configure authentication (replace mock auth)
- [ ] Set up monitoring and alerting
- [ ] Configure backups
- [ ] Review resource limits
- [ ] Test disaster recovery
- [ ] Security audit
- [ ] Performance testing

### Environment Variables

**API:**
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
REDIS_URL=redis://...
```

**Control Center:**
```env
VITE_API_URL=https://api.fleetsync.com
VITE_MAPBOX_TOKEN=your-mapbox-token
```

**Mobile:**
```env
VITE_API_URL=https://api.fleetsync.com
```

### SSL/TLS Setup

**With cert-manager (Kubernetes):**
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@fleetsync.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### Database Migration

Replace in-memory stores with persistent databases:

1. **Telemetry**: TimescaleDB or InfluxDB
2. **Application Data**: PostgreSQL
3. **Cache**: Redis
4. **File Storage**: S3 or MinIO

---

## Troubleshooting

### Common Issues

**1. Docker build fails**
```bash
# Clear build cache
docker-compose build --no-cache

# Check disk space
docker system df
docker system prune
```

**2. Kubernetes pods not starting**
```bash
# Check events
kubectl describe pod <pod-name> -n fleetsync

# Check logs
kubectl logs <pod-name> -n fleetsync

# Check resources
kubectl top nodes
```

**3. Telemetry not appearing**
```bash
# Check API logs
docker-compose logs api

# Verify Socket.IO connection
# Open browser console and check for WebSocket connection
```

**4. High memory usage**
```bash
# Adjust telemetry store limit in code
# Default: 10,000 events per vehicle

# Or use external time-series database
```

### Support

For issues and questions:
- GitHub Issues: https://github.com/your-org/fleetsync/issues
- Documentation: https://docs.fleetsync.com
- Email: support@fleetsync.com

---

## Performance Tuning

### API Optimization
- Enable compression (gzip)
- Implement caching (Redis)
- Use connection pooling
- Optimize database queries
- Implement rate limiting

### Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- CDN for static assets
- Service worker caching

### Kubernetes Optimization
- Horizontal Pod Autoscaling
- Vertical Pod Autoscaling
- Node affinity rules
- Resource requests/limits
- PodDisruptionBudgets

---

## Backup and Recovery

### Database Backups
```bash
# PostgreSQL backup
kubectl exec -n fleetsync deployment/postgres -- \
  pg_dump -U postgres fleetsync > backup.sql

# Restore
kubectl exec -i -n fleetsync deployment/postgres -- \
  psql -U postgres fleetsync < backup.sql
```

### Persistent Volume Backups
```bash
# Create snapshot (cloud provider specific)
# AWS EBS
aws ec2 create-snapshot --volume-id vol-xxxxx

# GCP Persistent Disk
gcloud compute disks snapshot disk-name
```

---

## Scaling

### Horizontal Scaling
```bash
# Scale API
kubectl scale deployment fleetsync-api --replicas=5 -n fleetsync

# Auto-scaling
kubectl autoscale deployment fleetsync-api \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n fleetsync
```

### Load Balancing
- Use Kubernetes Ingress with NGINX
- Configure session affinity for WebSocket
- Implement health checks
- Set up circuit breakers

---

## Security Best Practices

1. **Network Policies**: Restrict pod-to-pod communication
2. **RBAC**: Implement role-based access control
3. **Secrets Management**: Use Kubernetes Secrets or external vaults
4. **Image Scanning**: Scan Docker images for vulnerabilities
5. **TLS Everywhere**: Encrypt all traffic
6. **Regular Updates**: Keep dependencies updated
7. **Audit Logging**: Enable and monitor audit logs
8. **Penetration Testing**: Regular security assessments
