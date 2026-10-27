import { defineConfig } from "vitest/config";

// Kept apart from vite.config.ts so the Salla build and demo plugins stay out of test runs
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
  },
});
