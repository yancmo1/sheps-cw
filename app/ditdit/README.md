# Dit Dit

Dit Dit is the first local app shell for a Raspberry Pi touchscreen Morse/CW trainer. This milestone creates the appliance-style home screen, touch-friendly navigation, and placeholder screens that future training features can build on.

No Morse engine, audio, hardware input, backend, authentication, or kiosk launcher is included yet.

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

The helper script starts the Docker Compose service and launches Chromium kiosk mode on the Pi host:

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
- Exit to Desktop is only a placeholder inside the web app. Real desktop exit behavior should be handled by the Raspberry Pi launcher layer.

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

Likely future approaches:

- Desktop autostart script during early development
- Chromium kiosk mode after the app shell is stable
- systemd service later if Dit Dit becomes more appliance-like
