# Here's a short description of our final CI/CD pipeline and what it does:

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
1. JSDoc Documentation Generation. A separate docs branch will be created holding information for a documentation website. This branch is deployed to Github Pages.

2. App Deployment with Netlify.

### Miscellaneous Dev Quality-Of-Life Features

1. Support for running linting, formatting, and testing locally. Commands defined in package.json.

2. HOW-TO-CONTRIBUTE.md file as group's development guideline.

3. Issue templates and pull request templates with clear definition-of-done standards.

4. Story points and prioritization labels for issues
