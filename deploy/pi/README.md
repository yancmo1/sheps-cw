# Dit Dit Box Raspberry Pi Deployment

## Naming and paths

- Repo/project: `ShepsCW` / `sheps-cw`
- App/product: `Dit Dit`
- App source: `app/`
- Pi install path: `/opt/ditditbox`
- Pi service: `ditditbox.service`

## Overview

This folder contains the Raspberry Pi appliance startup layer for Dit Dit Box.

The React/Vite app is built into a Docker image and served by nginx at `http://localhost:3000`. Chromium runs directly on the Raspberry Pi desktop, not inside Docker.

Normal kiosk launch should be fast:

1. The Docker app service starts at boot with systemd.
2. The desktop shortcut runs `start-ditdit-kiosk.sh`.
3. The launcher checks `http://localhost:3000`.
4. If Dit Dit is already responding, it skips Docker and opens Chromium.
5. If Dit Dit is not responding, it starts the existing container with `--no-build`.

Docker image builds happen during install or update, not when clicking the desktop shortcut.

## Expected Paths

On the Raspberry Pi, the project checkout is expected at:

```bash
/opt/ditditbox
```

The Pi deployment files live under:

```bash
deploy/pi
```

This checkout currently keeps the active React app in `app/`. The Compose file builds that app directory and serves it through nginx on host port `3000`.

## First-Time Install/Update

From the repository root:

```bash
npm run ditdit:install
npm run ditdit:build
npm run pi:build-image
bash deploy/pi/install-systemd-service.sh
bash deploy/pi/install-desktop-shortcut.sh
```

The systemd installer builds the Docker image once, installs `ditditbox.service`, enables it at boot, restarts it, and verifies the app responds at `http://localhost:3000`.

## Root Helper Commands

Run these from the repository root:

```bash
npm run ditdit:install
npm run ditdit:build
npm run ditdit:dev
npm run ditdit:preview
npm run pi:build-image
npm run pi:start
npm run pi:stop
npm run pi:logs
npm run pi:kiosk
```

Important behavior:

- `npm run pi:build-image` explicitly builds or updates the image.
- `npm run pi:start` starts the Compose app with `--no-build`.
- `npm run pi:kiosk` opens the fast kiosk launcher.

## Systemd Service

Install and enable the app service:

```bash
bash deploy/pi/install-systemd-service.sh
```

Check the service:

```bash
systemctl status ditditbox.service --no-pager
```

Check the app:

```bash
curl -fsS http://localhost:3000 && echo "Dit Dit ready"
```

The service starts only the Docker app service. It does not start Chromium.

## Desktop Shortcut

Install the desktop shortcut:

```bash
bash deploy/pi/install-desktop-shortcut.sh
```

The shortcut is copied to:

```bash
~/Desktop/DitDit.desktop
```

The shortcut runs:

```bash
/opt/ditditbox/deploy/pi/start-ditdit-kiosk.sh
```

If the desktop asks `Execute`, `Execute in Terminal`, or `Open`, run:

```bash
chmod +x ~/Desktop/DitDit.desktop
gio set ~/Desktop/DitDit.desktop metadata::trusted true
```

Some Raspberry Pi desktop environments may still require right-clicking the Dit Dit icon and marking it trusted manually.

## Fast Kiosk Launch Behavior

Use:

```bash
npm run pi:kiosk
```

The fast launcher:

- Checks `http://localhost:3000` first.
- Prints `Dit Dit is already running.` and skips Docker when the app is healthy.
- Starts `ditditbox.service` if the app is not responding.
- Falls back to `docker compose -f deploy/pi/docker-compose.yml up -d --no-build` if the service is missing or fails.
- Waits briefly for the app.
- Detects `chromium`, then `chromium-browser`.
- Launches Chromium with Pi-safe flags, including `--disable-gpu`.
- Logs Chromium output to `/home/pi/.cache/ditdit/chromium.log`.

Use the slower full launcher only for troubleshooting or update testing:

```bash
bash deploy/pi/start-ditdit-full.sh
```

That script builds the image, starts the app, then runs the kiosk launcher.

## Troubleshooting

View app logs:

```bash
npm run pi:logs
```

Restart the service:

```bash
sudo systemctl restart ditditbox.service
systemctl status ditditbox.service --no-pager
```

Start the app without building:

```bash
npm run pi:start
```

Stop the app:

```bash
npm run pi:stop
```

Confirm Docker and Compose are installed:

```bash
docker --version
docker compose version
```

Install Chromium if the launcher cannot find it:

```bash
sudo apt install chromium
```

Chromium must run from the Pi desktop session. Raspberry Pi Connect or NoMachine can help when desktop access is needed, but SSH is better for routine maintenance such as logs, service restarts, and image updates.
