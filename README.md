# MyTravelApp

A premium, God-Tier mobile-first private family travel system.

## Deployment Architecture Constraints

**CRITICAL: THIS APPLICATION IS DESIGNED FOR VPS / LONG-LIVED SERVER DEPLOYMENT ONLY.**

Do **NOT** deploy this application to ephemeral serverless platforms like Vercel, Netlify, or AWS Lambda if document persistence is required. 

### Why?
This application implements **real local filesystem persistence** for the Family Head's document vault (`src/lib/private_uploads`). Uploaded PDFs are securely written to the local disk and protected by a Next.js Edge proxy route (`/api/documents/[id]/download`) which enforces strict JWT Session RBAC authorization before streaming bytes. 

Because ephemeral serverless environments destroy the local filesystem on every execution, uploading documents to Vercel will result in immediate data loss upon the next cold start.

### Recommended Deployment
Deploy this via Docker, a dedicated VPS (DigitalOcean Droplet, AWS EC2, Hetzner), or any containerized environment with persistent volume claims (Kubernetes PVC) attached to the application's root directory.
