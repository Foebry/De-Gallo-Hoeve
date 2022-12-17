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
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@middlewares/(.*)$": "<rootDir>/middlewares/$1",
    "^@controllers/(.*)$": "<rootDir>/controllers/$1",
  },
};
