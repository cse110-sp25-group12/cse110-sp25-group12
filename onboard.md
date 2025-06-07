# Onboarding Guide - This document serves as a walkthrough to our codebase

## Important Folders/Files
- .github/ -- Holds issue and PR templates along with Github Actions files
- admin/ -- Holds team information and meeting minutes
- specs/ -- Holds major design decisions and architecture records
- source/ -- Holds project source files. Everything needed for development and deployment build can be found here
- package.json -- Lists JS dependencies and handy npm commands
- HOW-TO-CONTRIBUTE.md -- Guide to making contributions

## Frontend

## Backend

Our Backend is build on the localStorage WebAPI, which supports our aim to store data local-first.

source/controllers/ defines our CRUD functions, which accesses and manipulates application-related data in localStorage.

source/js/ defines user-interactivity. Data-rendering, event handling, form submission, and chart generation is handled here.

source/data/ defines development-time mock JSON data that we can easily prototype with.

## Testing

- Packages used: Jest and Playwright

We cover 2 of the 3 bases of the testing pyramid by implementing both Unit tests and End to End tests. Unit tests, run with Jest, handle isolated testing of individual logic functions and are placed in tests/ folders next to the functions they test. End to End tests, run with Jest and Playwright, mock user operations on a standalone browser ensuring that the user interface and business logic are both sound. End to End tests are placed in the e2e/ folder.

4 npm commands exist to simplify local testing -- highly encouraged before submitting a pull request:
1. ```npm run test``` -- runs Unit and E2E tests
2. ```npm run test:unit``` -- runs Unit tests
3. ```npm run test:e2e``` -- runs E2E tests
4. ```npm run test:coverage``` -- generates a test coverage report in coverage/

## CI/CD

Here's a short description of the CI/CD pipeline and what it does:

### On every attempted pull request into main:
1. HTML Validation (W3C). All HTML files fed to W3C validator. Markup errors will cause the workflow to fail.
   1. The errors are hard to understand. ```"lastLine":25``` tells you which line of the HTML file caused the error.
   2. For easier debugging, just chuck the contents of the failed HTML file into [W3C's website](https://validator.w3.org/#validate_by_input)

  
2. ESLint and SylisticJS plugin. All JS files will be linted for errors and style warnings. Run ```npm run lint``` to lint locally. Run ```npm run lint:fix``` to lint and auto-format code locally. Current style guidelines are listed below:
    1. Indent by 2 spaces per code level
    2. Use single spaces ' for strings
    3. End all statements with a semicolon ;
    4. No trailing spaces after the last character in every line
    5. Spaces required in curly braces.
        1. Correct: ```const obj = { key: 'value' };```
        2. Incorrect: ```const obj = {key: 'value'};```
    6. Spaces required before and after ```=>``` in arrow functions
  
  
3. Jest Unit Tests. All unit tests scattered inside source/ will be run. Run ```npm run test:unit``` to run unit tests locally.

4. End-to-End Tests with Jest and Puppeteer. All e2e tests inside e2e/ will be run. Run ```npm run test:e2e"``` to run e2e tests locally.

5. Test Coverage. Runs the [Jest Coverage Report](https://github.com/marketplace/actions/jest-coverage-report) action which summarizes test coverage as a comment in the attempted pull request. Run ```npm run test:coverage``` to generate more detailed coverage report locally.

### On every push into main:
1. Deployment to Github Pages. Builds latest main branch and deploys to Github Pages.

2. JSDoc Documentation Generation. A separate docs branch will be created that holds docs/, which contains a webpage that displays all documentation for JS logic.



### Miscellaneous Dev Quality-Of-Life Features

1. Support for running linting, formatting, and testing locally. Commands defined in package.json.

2. HOW-TO-CONTRIBUTE.md file as group's development guideline.

3. Issue templates and pull request templates with clear definition-of-done standards.

4. Story points and prioritization labels for issues
