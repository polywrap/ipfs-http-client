module.exports = {
  collectCoverage: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/ipfs-http-client/src/__tests__/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
  globals: {
    'ts-jest': {
      tsconfig: "tsconfig.ts.json",
      diagnostics: false
    }
  }
};
