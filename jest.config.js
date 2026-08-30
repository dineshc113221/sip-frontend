module.exports = {
    rootDir: ".",
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
      ".+\\.(svg|css|styl|less|sass|scss|png|jpg|gif|ttf|woff|woff2)$":
      "jest-transform-stub",
    },
     moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "single-spa-react/parcel": "single-spa-react/lib/cjs/parcel.cjs",
    "@consumer/core-login-ui-mf": "<rootDir>/src/mocks/CoreLogin.mock.ts",
    "./vite.svg": "<rootDir>/src/mocks/ViteSvgMocks.tsx",
  },
    setupFilesAfterEnv: [
      '<rootDir>/src/setupTests.ts'
    ],
    testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/coverage/"
  ],

  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.tsx",
    "!src/**/main.tsx"
  ],
  coverageReporters: ["text", "lcov", "clover", "html"]
};
