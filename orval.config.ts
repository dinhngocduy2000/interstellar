import { defineConfig } from "orval";

export default defineConfig({
  "interstellar-api": {
    // Arbitrary name for this spec
    input: {
      target: "http://localhost:3000/api-json", // Your NestJS Swagger JSON URL (update host/port)
      // Alternative: Use a local file if you download the JSON: target: './swagger.json'
      filters: {
        mode: "exclude",
        tags: ["auth", "chat"],
      },
    },
    output: {
      mode: "tags-split", // Generates one file per API tag (e.g., users.ts, posts.ts) for better organization
      target: "./src/lib/api", // Output directory in your React project
      client: "axios", // Use Axios as the HTTP client (default is fetch, but axios is specified)
      // Optional: mock: false, // Disable MSW mocks if you don't need them
      schemas: "./src/lib/interfaces",
      override: {
        mutator: {
          path: "./src/lib/api/mutator.ts",
          name: "customInstance", // Uses your apiClient
        },
      },
    },
    // Optional: Override for React integration
    hooks: {
      // afterAllFilesWrite: "next --fix", // Auto-fix generated code with ESLint
    },
  },
});
