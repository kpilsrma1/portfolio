# Deployment

Target: an Ubuntu server running Docker, managed with Portainer, fronted by Nginx Proxy Manager (NPM) that already terminates TLS for other services. The portfolio is one container with no database and no volumes.

> **Status:** the site has not been deployed yet. The Docker image has not been built on the development machine (the Docker daemon was not running there); the `Dockerfile` is exercised by the CI `docker` job. The hostname `KapilSahrma.mageiatech.com` is reproduced exactly as supplied and **Needs Confirmation** before any DNS work.

## Artefacts

| File | Role |
| --- | --- |
| `Dockerfile` | Multi-stage build: `deps` (`npm ci`) → `builder` (`npm run build`) → `runner` (`node:24-alpine`, non-root `nextjs`, copies `.next/standalone`, `.next/static`, `public`) |
| `docker-compose.yml` | Service `portfolio`, image `${IMAGE_NAME:-kapil-portfolio}:${IMAGE_TAG:-latest}`, port `${HOST_PORT:-3005}:3000`, `restart: unless-stopped`, health check, log rotation |
| `.dockerignore` | Excludes `node_modules`, `.next`, `.git`, tests, docs, env files |
| `.env.example` | Names every variable with placeholder values |

Build-time argument: `NEXT_PUBLIC_SITE_URL` (canonical origin baked into metadata, sitemap, feed). Runtime variables: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (all optional; the form stays disabled when any is missing).

## 1. Prepare the server (Ubuntu)

```bash
sudo apt update && sudo apt upgrade -y
# Docker Engine + Compose plugin (official convenience script or apt repo)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"   # log out and back in
docker version && docker compose version
```

Portainer and Nginx Proxy Manager are assumed to be running already. Do not stop, restart, or prune anything unrelated to this service.

## 2. Get the code onto the server

Either clone the repository (after it has been pushed to a remote with explicit authorisation) or copy the working tree with `rsync`/`scp`. Place it under a path such as `/opt/kapil-portfolio`.

```bash
cd /opt/kapil-portfolio
cp .env.example .env
```

Edit `.env`:

```dotenv
NEXT_PUBLIC_SITE_URL=https://KapilSahrma.mageiatech.com   # confirm spelling first
HOST_PORT=3005                                              # pick a free host port
IMAGE_NAME=kapil-portfolio
IMAGE_TAG=2026.09.29                                        # date or git SHA; avoid only using "latest"
# RESEND_API_KEY=...        # optional
# CONTACT_TO_EMAIL=...      # optional
# CONTACT_FROM_EMAIL=...    # optional
```

Check the port is free: `ss -ltnp | grep :3005`.

## 3. Build and run

### Option A: Docker Compose on the host

```bash
docker compose build
docker compose up -d
docker compose ps                       # wait for "healthy"
curl -s http://127.0.0.1:3005/api/health   # {"status":"ok"}
curl -sI http://127.0.0.1:3005/ | head -n 20
```

### Option B: Portainer stack

1. Portainer → **Stacks** → **Add stack**.
2. Name: `kapil-portfolio`. Build method: **Repository** (if the repo is reachable from the server) or **Upload** / **Web editor** with the contents of `docker-compose.yml`.
3. Add the environment variables from step 2 in the stack's *Environment variables* section (Portainer substitutes `${VAR}` in the compose file).
4. Deploy. Watch the container reach `healthy` in **Containers**.

If Portainer cannot build from the repository, build the image with Option A (`docker compose build`) and let the stack reference the resulting `IMAGE_NAME:IMAGE_TAG`.

## 4. Reverse proxy (Nginx Proxy Manager)

1. NPM → **Hosts** → **Proxy Hosts** → **Add Proxy Host**.
2. Domain: `KapilSahrma.mageiatech.com` (after confirming spelling and that the DNS record exists).
3. Scheme `http`, Forward Hostname/IP: the Docker host's address as seen by NPM (`172.17.0.1`, the host LAN IP, or the container name if NPM shares a Docker network with it), Forward Port: `3005` (or `3000` when addressing the container directly on a shared network).
4. Enable **Block Common Exploits** and **Websockets Support** (harmless; not required).
5. **SSL** tab: request a Let's Encrypt certificate, enable **Force SSL** and **HTTP/2**. HSTS is already sent by the application; enabling it in NPM as well is fine.
6. Save, then open `https://KapilSahrma.mageiatech.com` and check the health route and a case study page.

Optional hardening: remove the `ports:` mapping from the compose file and attach the service to NPM's Docker network so the app is reachable only through the proxy. That network name is site-specific and is **Not Yet Verified**; do not invent one.

## 5. DNS

Create an `A` (and `AAAA` if applicable) record for the confirmed hostname pointing at the server's public IP. Propagation can take minutes to hours. Do not treat the site as live until `https://<host>/api/health` answers `{"status":"ok"}` from outside the network.

## 6. Update procedure

```bash
cd /opt/kapil-portfolio
git pull            # or copy the new tree
# bump IMAGE_TAG in .env
docker compose build
docker compose up -d
docker compose ps
docker image prune -f --filter "label=none"   # optional; only removes dangling layers
```

Compose replaces the container in place; downtime is a few seconds while the new container starts and passes its health check (`start_period: 15s`).

## 7. Rollback

Because the container is stateless, rollback is redeploying the previous image tag:

```bash
# in .env set IMAGE_TAG to the previous known-good tag
docker compose up -d --no-build
docker compose ps
```

Keep at least the last two tags on the server. Never run `docker system prune -a` on a shared host.

## 8. Verification checklist after deploy

- [ ] `GET /api/health` returns `{"status":"ok"}` through the proxy
- [ ] Homepage, `/projects`, one case study, `/blog/dockerizing-a-nextjs-application`, `/contact` render
- [ ] `/projects/does-not-exist` returns 404 with the custom page
- [ ] `/sitemap.xml`, `/robots.txt`, `/feed.xml` show the confirmed hostname
- [ ] Response headers include `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`
- [ ] Theme toggle and mobile menu work over HTTPS
- [ ] If contact variables were set: submit a test message and confirm receipt; otherwise the page shows the disabled state

## Operational notes

- **Logs:** `docker compose logs -f portfolio`. JSON-file driver, rotated at 10 MB × 3.
- **Health:** `wget` inside the image polls `/api/health` every 30 s.
- **Rate limiter** for the contact form is in-memory per container; restarting resets it.
- **Changing `NEXT_PUBLIC_SITE_URL`** requires a rebuild; it is inlined at build time.
- **Résumé PDF:** place the file at `public/resume/kapil-sharma-resume.pdf` *before* building; `src/lib/resume.ts` checks for it at build time and the résumé page, header, and footer switch to the download variant automatically.
