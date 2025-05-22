---
# Configuration for the Jekyll template "Just the Docs"
parent: Decisions
nav_order: 001
title: JavaScript File Structure and Coding Style Standards
status: "proposed"
date: 05-25-2025

---

# JavaScript File Structure and Coding Style Standards

## Context and Problem Statement

As our application grows in complexity, maintaining consistent code organization and style becomes increasingly important. How should we structure our JavaScript files in relation to HTML, and what coding style standards should we adopt to ensure the codebase remains cohesive, maintainable, and appears to be written by a single developer?

## Considered Options

* One monolithic JavaScript file for all functionality
* Multiple JavaScript files based on feature domains
* One JavaScript file per HTML file with direct correspondence
* Mixed approach with utility files plus page-specific files
* Controller-based approach with function-specific files and page-specific files

## Decision Outcome

Chosen option: "Controller-based approach with function-specific files and page-specific files", because this approach provides maximum modularity, clear separation of concerns, and enables easy reuse of functionality across different pages.

### Consequences

* Good, because functionality is highly modular with each function in its own file in the controllers folder
* Good, because reusing specific functions across different pages becomes trivial
* Good, because it's easy to locate and modify specific functionality without affecting other parts
* Good, because each HTML page still has a corresponding JS file for page-specific manipulation
* Bad, because it requires managing many small files
* Bad, because it requires additional discipline in organizing the controllers folder
* Bad, because it may increase initial loading time due to multiple HTTP requests (can be mitigated with bundling)

## Pros and Cons of the Options

### One monolithic JavaScript file for all functionality

* Good, because all code is in one place, making it easy to find
* Good, because no need to manage dependencies between files
* Bad, because the file will become unwieldy as the application grows
* Bad, because it creates higher likelihood of merge conflicts
* Bad, because it's difficult to separate concerns

### Multiple JavaScript files based on feature/component domains

* Good, because it organizes code by domain concepts
* Good, because it encourages modular design
* Neutral, because it requires more thought in initial organization
* Bad, because the relationship between HTML and JS might not be immediately clear

### One JavaScript file per HTML file with direct correspondence

* Good, because it creates a clear 1:1 mapping between UI and behavior
* Good, because it makes debugging easier - issues on a page correspond to a specific JS file
* Good, because it supports separation of concerns at the page level
* Neutral, because shared functionality needs to be handled separately
* Bad, because it might lead to some duplication if not managed carefully

### Mixed approach with utility files plus page-specific files

* Good, because it combines the benefits of modular design with clear page mapping
* Good, because it reduces duplication through utility files
* Neutral, because it requires more complex organization
* Bad, because it might lead to confusion about where specific functionality should live

### Controller-based approach with function-specific files and page-specific files

* Good, because it provides maximum modularity with each function in its own file
* Good, because it makes unit testing individual functions very straightforward
* Good, because it creates a clean controllers directory for all reusable functionality
* Good, because HTML pages still maintain a clear 1:1 relationship with their JS manipulation files
* Neutral, because it requires a well-defined import/export strategy
* Bad, because managing many small files can be overwhelming
* Bad, because it may impact initial page load performance without proper bundling

## Implementation Details

Our implementation will follow this structure:

```
source/
├── pages/                     # HTML files
│   ├── add_application.html
│   ├── applications.html
│   ├── dashboard.html
│   └── index.html
├── js/                        # Page-specific JS
│   ├── add_application.js
│   ├── applications.js
│   ├── dashboard.js
│   └── index.js
├── controllers/               # CRUD operations only
│   ├── createApplication.js
│   ├── readApplications.js
│   ├── updateApplication.js
│   ├── deleteApplication.js
├── utils/                     # Utility functions
│   ├── sortApplications.js
│   ├── filterApplications.js
│   └── formatData.js
├── styles/                    # CSS and styling
│   ├── template.css
│   └── template.js
```

Key aspects of this structure:

1. **Pages folder**: Contains all HTML files.

2. **JS folder**: Contains one JavaScript file per HTML page with matching names.
   - Each page-specific JS file handles DOM manipulation and event listeners for its corresponding HTML page.
   - These files import functionality from controllers and utils as needed.

3. **Controllers folder**: Contains CRUD (Create, Read, Update, Delete) operations.
   - Each file exports a single, focused function for data manipulation.
   - Example: `createApplication.js` would handle saving new application data.

4. **Utils folder**: Contains utility functions that operate on data returned by controllers.
   - Example: `sortApplications.js` would import `readApplications.js` to get data, then sort and return it.

5. **Styles folder**: Contains CSS and template-related JavaScript.
   - `template.css` contains global styling.
   - `template.js` contains functions for generating common UI elements.

## Coding Style Standards

To ensure the codebase looks like it was written by a single developer, we will adopt the following standards:

1. **Function Documentation**:
   - Every function must have a descriptive comment block above it explaining:
     - Purpose of the function
     - Parameters (with types)
     - Return value (with type)
     - Example usage (if not obvious)

2. **Complex Logic Documentation**:
   - Any function with complex calculations or logic must include:
     - Step-by-step explanation of the algorithm
     - Reasoning behind the approach chosen
     - Any performance considerations

3. **Naming Conventions**:
   - Use camelCase for variables and functions
   - Use PascalCase for classes
   - Use UPPER_SNAKE_CASE for constants
   - Prefix private functions or variables with underscore (_)

4. **Code Organization**:
   - Group related functions together
   - Place initialization code at the top of the file
   - Place event listeners after function definitions
   - Export public functions at the end of the file if using modules

5. **Whitespace and Formatting**:
   - Use 2-space indentation
   - Place opening braces on the same line as the statement
   - Add a space after keywords (if, for, while, etc.)
   - Use semicolons at the end of statements

## More Information

This decision will be implemented immediately and applied to all new code. Existing code will be refactored incrementally as files are modified.

A linting configuration file will be created to enforce these standards automatically during development.

This decision may be revisited if:
1. The codebase grows beyond a certain size making this structure inefficient
2. We adopt a component-based framework that inherently changes how JS and HTML interact
3. The number of controller files becomes unmanageable 