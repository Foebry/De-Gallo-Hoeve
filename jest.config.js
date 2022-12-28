require("dotenv").config({ path: ".env.test" });
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  verbose: true,
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFiles: ["dotenv/config"],
  collectCoverageFrom: ["src/**/*.tsx", "src/**/*.ts"],
};
