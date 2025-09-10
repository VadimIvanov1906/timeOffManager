# Storybook for TimeOffManager

This Storybook setup is for the **TimeOffManager** project. It allows you to develop, preview, and test UI components in isolation.

## Project Structure

timeoff-manager/
├─ .storybook/ # Storybook config files
│ ├─ main.js # Main Storybook configuration
│ ├─ preview.js # Global decorators and parameters
├─ src/
│ ├─ components/ # React components
│ └─ stories/ # Story files (*.stories.tsx)
├─ tests/ # Unit and integration tests
└─ package.json

## Getting Started

### Install Dependencies

```bash
npm install

```
### Run Storybook
Start the Storybook development server:
```bash
npm run storybook
```
### Build Storybook for production:
```bash
npm run build-storybook
```
### Testing
This project uses Vitest with @testing-library/react for unit and integration tests.
Run Tests (Watch Mode)
This will run all tests and watch for changes.
```bash
npm run test
```

Run Tests Once (CI Mode)
```bash
npm run test:ci
```
### Test Files
All test files are located in the tests/ folder.

Test files should have the .test.tsx or .test.ts extension.
