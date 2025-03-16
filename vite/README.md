# Flow Browser WebUI

This folder contains the React-based UI for the Flow Browser, built with Vite and Tailwind CSS. The UI is packaged as a Chrome extension to access the Chrome APIs.

## Development

### Development Mode

To run the app in development mode:

```bash
# From the webui folder
npm run electron:dev
```

This will:

1. Build the Vite app and watch for changes
2. Start the Electron app, which will load the UI as an extension

When you make changes to the React code, the app will be rebuilt automatically, but you'll need to reload the Electron app to see the changes.

### Preview Mode

To build the Vite app and run it in the Electron app without packaging:

```bash
# From the webui folder
npm run electron:preview
```

This is useful for testing the built app before packaging.

## Production

To build the app for production:

```bash
# From the root folder
npm run build
```

This will:

1. Build the Vite app as a Chrome extension
2. Package the Electron app with the built extension included

## How It Works

The Vite app is built as a Chrome extension with:

- A manifest.json file that defines the extension
- A background.js script for extension functionality
- The React app as the main UI

The Electron app loads this extension and uses it for the browser UI, which gives the UI access to the Chrome APIs needed for browser functionality.

## Available Scripts

- `npm run dev` - Build the Vite app and watch for changes
- `npm run build` - Build the Vite app
- `npm run lint` - Lint the code
- `npm run preview` - Preview the built Vite app
- `npm run electron:dev` - Build the Vite app with watch mode and run the Electron app
- `npm run electron:preview` - Build the Vite app and run it in the Electron app
- `npm run electron:build` - Build the Vite app and package the Electron app
