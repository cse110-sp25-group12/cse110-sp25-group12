## How to Develop

We will adopt a feature branching strategy. To take on an issue:
1. Self-assign yourself to an issue


2. Develop on a similarly named feature branch
    1. See [Branch Naming Conventions](#branch-naming-conventions) for how to name feature branches
  

3. (suggested) Run ```npm install``` in the root directory. Read package.json for useful commands to run locally (for testing/linting before pushing/GH actions). Some useful ones are listed below:
    1. ```npm run test``` - for local testing
    2. ```npm run lint``` - runs ESLint, which tells you errors
    3. ```npm run lint:fix``` - **runs ESLint and performs some AUTOMATIC CODE FORMATTING.** Highly recommended to run before pushes/PRs
  
      
4. Push your feature branch to the repo

  
5. Use the pull request feature and pull request template
    1. Fill out high level details
    2. Link the issue number to your PR by adding the issue number next to the ```Fixes Issue #_``` header
    3. (optional) Add screenshots (by copy/pasting from clipboard)
    4. Make sure to check CI/CD tests. If the HTML validation fails, please find errors and fix them and repush the branch. For linter warnings/recommendations, please fix and repush the branch. If a main branch <- feature branch pull request has already been created, all subsequent pushes to the feature branch will automatically show up in the pull request and rerun github actions

## Documentation Guidelines

- Please comment your code (small one liners) to help others understand your code
- For JS code, use jsDoc-style comments. A short reference is linked [here] (https://medium.com/@uomroshan/a-comprehensive-guide-to-jsdoc-comments-in-javascript-ed14df2351ef)

## Branch Naming Conventions

- Name feature branches based on team and issue name or something similar: ```team/issue-name```
- Example Issue: Backend: Implement Basic Filtering
  - Branch name: ```backend/basic-filtering```
 

# Codebase Explainer - Teams will update this as project moves along

## Frontend

## Backend

## Testing

- Packages used: Jest
- test/ folder parallel to source/ folder holds all unit tests & E2E tests
- Run ```npm run test``` to test locally

## CI/CD

Here's a short description of the CI/CD pipeline and what it does:

### On every pull request into main:
1. HTML Validation (W3C). All HTML files fed to W3C validator. Any errors will cause the workflow to fail. The errors are hard to understand. but ```"lastLine":25``` tells you which line of the HTML file caused the error.

  
2. ESLint and SylisticJS plugin. All JS files will be linted for errors and style warnings. Run ```npm run lint``` to lint locally. Run ```npm run lint:fix``` to lint and auto-format code locally. Current style guidelines are listed below:
    1. Indent by 2 spaces per code level
    2. Use single spaces ' for strings
    3. End all statements with a semicolon ;
    4. No trailing spaces after the last character in every line
    5. Spaces required in curly braces.
        1. Correct: ```const obj = { key: 'value' };```
        2. Incorrect: ```const obj = {key: 'value'};```
    6. Spaces required before and after ```=>``` in arrow functions
  
  
3. Jest Tests. All folders in test/ will be run. Any test fail will cause the workflow to fail

### On every push into main:
1. JSDoc. A separate docs branch will be created that holds docs/, which contains components to a webpage that displays all comments for JS code.
