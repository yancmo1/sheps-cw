# Dit Dit Raspberry Pi Deployment

This folder contains the Raspberry Pi proof-of-life deployment for Dit Dit.

The React/Vite app is built into static files and served by nginx in Docker. Chromium is not containerized. The Pi desktop session launches Chromium kiosk mode and points it at the containerized app on `http://localhost:3000`.

## Root Helper Commands

From the repository root:

```bash
npm run ditdit:install
npm run ditdit:build
npm run ditdit:kiosk
```

The root `package.json` only delegates into `app`; it does not move the app.

## Files

- `docker-compose.yml` builds and runs the Dit Dit web container.
- `start-ditdit-kiosk.sh` starts the container, waits for the app, then launches host Chromium in kiosk mode.

## Install Docker If Needed

On Raspberry Pi OS, first check whether Docker and Compose are already installed:

```bash
docker --version
docker compose version
```

If Docker is missing, a common Raspberry Pi OS install path is:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
```

Log out and back in, or reboot, so the Docker group change takes effect. Then confirm:

```bash
docker run hello-world
docker compose version
```

## Start The App With Docker Compose

From the repository root:

```bash
docker compose -f deploy/pi/docker-compose.yml up -d
```

Force a rebuild only when needed:

```bash
docker compose -f deploy/pi/docker-compose.yml up -d --build
```

Open the app on the Pi at:

```text
http://localhost:3000
```

The Compose service is named `ditdit`, uses `restart: unless-stopped`, and maps host port `3000` to nginx in the container.

## Manually Launch Kiosk Mode

Run this from the repository root while logged into the Pi desktop session:

```bash
deploy/pi/start-ditdit-kiosk.sh
```

The script:

- Reuses the running `ditdit` container when already up (fast path).
- Starts the Docker Compose app when needed.
- Waits until `http://localhost:3000` responds.
- Shows a visible startup window with `Launch Dit Dit` and `Cancel to Desktop` options.
- Finds Chromium on the host.
- Launches Chromium in kiosk mode pointed at Dit Dit.

To force an image rebuild on launch, set:

```bash
DITDIT_BUILD_ON_START=1 deploy/pi/start-ditdit-kiosk.sh
```

Startup cancel window options:

```bash
STARTUP_CANCEL_ENABLED=1 STARTUP_CANCEL_SECONDS=10 deploy/pi/start-ditdit-kiosk.sh
```

- `STARTUP_CANCEL_ENABLED=1` enables the visible cancel window (default).
- `STARTUP_CANCEL_SECONDS=10` controls the countdown before auto-launch.

Chromium must run on the Pi desktop session. Do not run this script from a headless SSH-only session unless the desktop display environment is already available.

If you see an error like this:

```text
Missing X server or $DISPLAY
The platform failed to initialize.
```

Chromium was launched without access to the Pi display. Start the kiosk from the Pi desktop, or install the desktop shortcut below.

You can override the target URL or wait timeout:

```bash
DITDIT_URL=http://localhost:3000 WAIT_SECONDS=90 deploy/pi/start-ditdit-kiosk.sh
```

## Install A Desktop Shortcut

From the repository root on the Pi:

```bash
bash deploy/pi/install-desktop-shortcut.sh
```

This copies `deploy/pi/DitDit.desktop` to `~/Desktop/DitDit.desktop`, rewrites the shortcut `Exec=` path to the current checkout's launcher script, makes the launcher executable, sets `quick_exec=1` in `~/.config/libfm/libfm.conf`, and tries to mark the shortcut trusted. Use that shortcut from the Pi desktop session to start Docker Compose and launch Chromium kiosk mode.

Some Raspberry Pi desktop environments may ask you to trust or allow the launcher the first time you click it.

If the desktop shows a popup asking `Execute`, `Execute in Terminal`, or `Open`, run:

```bash
chmod +x ~/Desktop/DitDit.desktop
gio set ~/Desktop/DitDit.desktop metadata::trusted true
sed -i 's/^quick_exec=.*/quick_exec=1/' ~/.config/libfm/libfm.conf
```

Some Raspberry Pi desktop environments may still require right-clicking the icon and marking it trusted manually.

The shortcut runs without opening a terminal window. Chromium output is written to:

```text
~/.cache/ditdit/chromium.log
```

## Chromium GPU Messages

Some Raspberry Pi Chromium builds print EGL or GPU context errors such as:

```text
eglCreateContext: Requested version is not supported
EGL_BAD_ATTRIBUTE
CollectGraphicsInfo failed
```

Dit Dit does not need GPU acceleration yet, so the kiosk launcher disables Chromium GPU acceleration and uses software rendering. If the app opens correctly, these messages are not usually fatal.

## Stop The App

From the repository root:

```bash
docker compose -f deploy/pi/docker-compose.yml down
```

## Future Auto-Start

Auto-start on reboot is intentionally not included yet. Add it after Docker + kiosk proof-of-life is confirmed on the Pi touchscreen.

The likely next step is a desktop autostart entry or systemd user service that runs `deploy/pi/start-ditdit-kiosk.sh` after the Pi desktop session starts.
