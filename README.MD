# HMPPS Book a Prison Visit UI Tests

This repository contains automated UI tests for the `hmpps-book-a-prison-visit-ui` service. The tests are written in TypeScript and use the Playwright testing library.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository
2. Navigate to the project directory
```
cd hmpps-book-a-prison-visit-ui-tests
```
3. Install the dependencies:
```
npm install
```

## Running the Tests

To run the tests, use the following command:
```
npm run test:chrome                 -   To run the tests on chrome headless
npm run test:chrome:headed          -   To run the tests on chrome in headed mode
npm run test:iPhone13               -   To run the tests on iPhone 13 mobile browser
npm run test:iPhone13:headed        -   To run the tests on iPhone 13 mobile browser in headed mode
npm run test:nexus7                 -   To run the tests on Nexus 7 mobile browser
npm run test:nexus5:headed          -   To run the tests on Nexus 7 mobile browser in headed mode
```