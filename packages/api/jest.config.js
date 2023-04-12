/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest/presets/js-with-ts",
  setupFiles: ["dotenv/config"],
  transform: {
    "^.+\\.mjs$": "ts-jest",
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
  },
  coverageReporters: ["json-summary", "text", "lcov", "html"],
};

module.exports = config;
