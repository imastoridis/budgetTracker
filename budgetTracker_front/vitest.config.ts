import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 1. Enable globals (vi, describe, it, etc.) for a familiar Jest/Jasmine syntax
    globals: true,
    // 2. Use jsdom to simulate a browser environment for Angular components
    environment: 'jsdom',
    // 3. Set the setup file created previously (assuming it's at src/test.setup.ts)
    setupFiles: ['src/test.setup.ts'],
    // 4. Optionally, exclude node_modules and the standard Angular 'e2e' folder
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e'],
    // 5. Specify test file patterns (Angular convention uses .spec.ts)
    include: ['src/**/*.spec.ts'],
  },
});
