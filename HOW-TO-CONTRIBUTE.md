## How to Develop

We will adopt a feature branching strategy. To take on an issue:
1. Self-assign yourself to an issue


2. Develop on a similarly named feature branch
    1. See [Branch Naming Conventions](#branch-naming-conventions) for how to name feature branches
  

3. (suggested) Run ```npm install``` in the root directory. Read package.json for useful commands to run locally (for testing/linting before pushing/GH actions). Some useful ones are listed below:
    1. ```npm run test``` - for local testing (Unit and E2E)
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
- For JS logic code, use jsDoc-style comments. A short reference is linked [here] (https://medium.com/@uomroshan/a-comprehensive-guide-to-jsdoc-comments-in-javascript-ed14df2351ef)

## Branch Naming Conventions

- Name feature branches based on team and issue name or something similar: ```team/issue-name```
- Example Issue: Backend: Implement Basic Filtering
  - Branch name: ```backend/basic-filtering```
