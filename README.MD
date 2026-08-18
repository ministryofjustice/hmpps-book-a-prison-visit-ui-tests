# HMPPS Book a Prison Visit UI Tests

This repository contains automated E2E UI tests for the `hmpps-book-a-prison-visit-ui` **`(Public UI)`** service. The tests are written in TypeScript and use the Playwright testing library.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository
2. Navigate to the project directory - `cd hmpps-book-a-prison-visit-ui-tests`
3. Install the dependencies:

```bash
npm ci
```

Create 3 .env files:

```bash
tee .env .env.dev .env.staging < .env.example
```

Fill out the created env files ([.env](.env), [.env.dev](.env.dev), and [.env.staging](.env.staging)) with appropriate information.

## Running the Tests
**All the below scripts are in package.json**

To run the tests, use one of the following commands:

| Command                        | Description                                                 |
|--------------------------------|-------------------------------------------------------------|
| `npm run test:chrome`          | To run the tests on chrome headless                         |
| `npm run test:chrome:headed`   | To run the tests on chrome in headed mode                   |
| `npm run test:iPhone13`        | To run the tests on iPhone 13 mobile browser                |
| `npm run test:iPhone13:headed` | To run the tests on iPhone 13 mobile browser in headed mode |
| `npm run test:nexus7`          | To run the tests on Nexus 7 mobile browser                  |
| `npm run test:nexus5:headed`   | To run the tests on Nexus 7 mobile browser in headed mode   |

## Running single test
To run a single test in headed mode use the below command
```
test_env={environment to run the test:dev or staging} npx playwright test --project={browserName} {testName}.spec.ts --headed 

Supported Browsers: 
Chromium
Firefox
Edge
Webkit/Safari
```