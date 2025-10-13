import { execSync } from "child_process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { isServer, dev }) {
    // Only run Biome linting in production builds (not dev)
    if (!dev) {
      config.plugins.push({
        apply: (compiler: {
          hooks: {
            beforeCompile: { tap: (arg0: string, arg1: () => void) => void };
          };
        }) => {
          compiler.hooks.beforeCompile.tap("BiomeLintPlugin", () => {
            try {
              // Run Biome linting (adjust path/globs as needed)
              execSync("npx biome check ./src", {
                stdio: "inherit", // Show output in terminal
              });
            } catch {
              throw new Error("Biome linting errors detected");
            }
          });
        },
      });
    }
    return config;
  },
  // output: "standalone",
};

export default nextConfig;
