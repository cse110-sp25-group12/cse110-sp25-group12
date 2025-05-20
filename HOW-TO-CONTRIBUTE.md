## How to Develop

We will adopt a feature branching strategy. To take on an issue:
1. Self-assign yourself to an issue
2. Develop on a similarly named feature branch
3. Push your feature branch to the repo
4. Use the pull request feature and pull request template. Make sure to fill out the high level details, link the issue number to your PR, add screenshots, add a reviewer, and make sure CI/CD tests pass

## Documentation Guidelines

- Please comment your code (small one liners) to help others understand your code
- For JS code, use jsDoc comments. A short reference is linked [here] (https://medium.com/@uomroshan/a-comprehensive-guide-to-jsdoc-comments-in-javascript-ed14df2351ef)

## Testing

- test/ folder is for Jest unit tests. Run `npm run test` to test locally
- Later, implement E2E testing of user interface with Puppeteer or Playwright

## CI/CD

Here's a short description of the CI/CD pipeline and what it does:

On every pull request into main:
1. HTML Validation (W3C). All HTML files fed to W3C validator. Any errors will cause the workflow to fail
2. ESLint and SylisticJS plugin. All JS files will be linted for errors and style warnings. Run `npm run lint` to lint locally. RUn `npm run lint:fix` to lint and auto-format code locally
3. Jest Tests. All folders in test/ will be run. Any test fail will cause the workflow to fail

On every push into main:
1. JSDoc. A separate docs branch will be created that holds docs/, which contains components to a webpage that displays all comments for JS code.
