# Dit Dit

Dit Dit is the React/Vite CW trainer app and product for the Sheps CW project. The active application lives in this `app/` directory.

Dit Dit Box is the Raspberry Pi appliance/kiosk deployment of Dit Dit. The Pi deployment layer lives in `deploy/pi/`, where Docker Compose, systemd, desktop shortcut, and Chromium kiosk launcher assets are maintained.

The app currently includes the touch-first training flow foundation, browser-based Morse audio, local settings persistence, local progress history, missed-character practice, and an exit-to-desktop flow foundation. Hardware input, GPIO integration, backend services, authentication, and a reusable core Morse engine are not included yet.

## Local Development With NPM

Use this workflow while building the React/Vite app directly.

### Install

```bash
npm install
```

### Run Manually

From this directory:

```bash
npm run dev -- --host 0.0.0.0
```

Vite will print a local URL. Open it on the Raspberry Pi touchscreen, or open the network URL from another device on the same local network.

### Build

```bash
npm run build
```

## Raspberry Pi Deployment With Docker Compose

Use this workflow to serve the built app on the Pi while Chromium runs outside Docker.

From the repository root:

```bash
docker compose -f deploy/pi/docker-compose.yml up -d --build
```

The container serves Dit Dit at:

```text
http://localhost:3000
```

The Compose file binds the web app to `127.0.0.1:3000`, so it is intended for the Pi desktop and kiosk browser on the same machine.

To stop it:

```bash
docker compose -f deploy/pi/docker-compose.yml down
```

## Raspberry Pi Kiosk Launcher

The Pi appliance/kiosk helper script starts or checks the Docker Compose service and launches Chromium kiosk mode on the Pi host:

```bash
deploy/pi/start-ditdit-kiosk.sh
```

The script does not containerize Chromium or the Pi desktop. It starts the web container, waits briefly for `http://localhost:3000`, then runs the host's Chromium browser in kiosk mode.

You can override the browser URL if needed:

```bash
DITDIT_URL=http://localhost:3000 deploy/pi/start-ditdit-kiosk.sh
```

## Raspberry Pi Touchscreen Notes

- Initial target display is a 7-inch Raspberry Pi touchscreen at `1024x600`.
- The interface uses large buttons and high-contrast text for finger input.
- The app can be launched manually with npm during development or served through Docker Compose for Pi deployment.
- Exit to Desktop attempts to close the browser window and falls back to user guidance if Chromium does not allow the web app to close itself. Deeper desktop/session control should remain in the Raspberry Pi launcher layer.

## Future TODO: Startup and Kiosk Flow

Do not implement this inside the React app yet. The desired future Raspberry Pi startup flow is:

```text
Raspberry Pi boots
Dit Dit startup screen appears
Short countdown starts
User may press Cancel to Desktop
If not canceled, launch Dit Dit fullscreen
```

The user should never feel trapped after reboot. A visible startup screen with a Cancel to Desktop option should exist before launching the app fullscreen.

Likely future additions:

- Desktop autostart or a small pre-launch cancel prompt.
- Additional Chromium kiosk hardening after real Pi testing.
- More systemd/user-session polish if Dit Dit Box becomes more appliance-like.
