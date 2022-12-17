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
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/pages/(.*)$": "<rootDir/src/pages/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@/shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@/tests/(.*)$": "<rootDir>/tests/$1",
  },
};
