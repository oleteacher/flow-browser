import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, join } from "path";
import fs from "fs";

// Function to get all routes from the routes directory
function getRoutes() {
  const routesDir = resolve(__dirname, "src/routes");
  const routes: Record<string, string> = {};

  // Check if routes directory exists
  if (fs.existsSync(routesDir)) {
    // Get all subdirectories in the routes directory
    const routeDirs = fs
      .readdirSync(routesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Create input entries for each route
    routeDirs.forEach((route) => {
      const htmlPath = join(routesDir, route, "index.html");
      if (fs.existsSync(htmlPath)) {
        routes[route] = `./src/routes/${route}/index.html`;
      }
    });
  }

  return routes;
}

// Get all routes
const routes = getRoutes();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-extension-files",
      buildEnd() {
        // Copy manifest.json and background.js to the dist folder
        const distDir = resolve(__dirname, "dist");
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }

        fs.copyFileSync(resolve(__dirname, "manifest.json"), resolve(distDir, "manifest.json"));
        fs.copyFileSync(resolve(__dirname, "background.js"), resolve(distDir, "background.js"));
      }
    },
    {
      name: "html-transform",
      // This will run after the build is complete
      closeBundle() {
        const distDir = resolve(__dirname, "dist");
        const routesDir = resolve(distDir, "src/routes");

        // Check if src/routes directory exists
        if (fs.existsSync(routesDir)) {
          // Get all route directories
          const routeDirs = fs
            .readdirSync(routesDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

          // Process each route
          routeDirs.forEach((route) => {
            const srcPath = resolve(routesDir, route, "index.html");
            const destDir = resolve(distDir, route);
            const destPath = resolve(destDir, "index.html");

            if (fs.existsSync(srcPath)) {
              // Ensure destination directory exists
              if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
              }

              // Copy the file to the new location
              fs.copyFileSync(srcPath, destPath);

              // Remove the original file
              fs.unlinkSync(srcPath);

              // Try to remove the now-empty directory
              try {
                fs.rmdirSync(resolve(routesDir, route));
              } catch {
                // Ignore errors if directory isn't empty
              }
            }
          });

          // Clean up empty directories
          try {
            fs.rmdirSync(routesDir);
            fs.rmdirSync(resolve(distDir, "src"));
          } catch {
            // Ignore errors if directories aren't empty or don't exist
          }
        }
      }
    }
  ],
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    // Ensure assets are properly referenced
    assetsDir: "assets",
    // Generate a manifest for Electron to use
    manifest: true,
    rollupOptions: {
      input: routes,
      output: {
        entryFileNames: "[name]/[name].js",
        chunkFileNames: "[name]/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          // Place assets in their respective route folders
          const name = assetInfo.name || "";

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return "assets/images/[name][extname]";
          }

          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(name)) {
            return "assets/fonts/[name][extname]";
          }

          if (/\.css$/i.test(name)) {
            return "[name]/[name][extname]";
          }

          if (/\.html$/i.test(name)) {
            return "[name]/index.html";
          }

          return "[name]/[name][extname]";
        }
      }
    }
  }
});
