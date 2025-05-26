---
parent: Decisions
nav_order: 300
title: ADR-0003: JavaScript File Structure and Coding Style Standards
status: accepted
date: 2025-05-23
---

# JavaScript File Structure and Coding Style Standards

## Context and Problem Statement

As our application grows in complexity, we need a consistent way to organize our JavaScript files relative to HTML, and a set of coding style standards so our codebase remains cohesive, maintainable, and uniform across contributors.

## Considered Options

* **Option A: Monolithic JavaScript file**
* **Option B: Multiple JS files by feature domain**
* **Option C: One JS file per HTML file**
* **Option D: Mixed utility + page-specific files**
* **Option E: Controller-based approach with function-specific and page-specific files**

## Decision Outcome

**Chosen option:** Controller-based approach with function-specific files and page-specific files, because it offers the maximum modularity, clear separation of concerns, and easy reuse of functionality across different pages.

## Consequences

* **Positive:** Functionality is highly modular with each function in its own controller file.  
* **Positive:** Reusing specific functions across pages is trivial.  
* **Positive:** Easy to locate and modify specific functionality without impacting other parts.  
* **Positive:** Each HTML page still has a corresponding JS file for page-specific DOM manipulation.  
* **Negative:** Requires managing many small files.  
* **Negative:** Needs discipline in organizing the controllers folder.  
* **Negative:** May increase initial load time due to multiple HTTP requests (mitigated by bundling).

## Pros and Cons of the Options

### Option A: Monolithic JavaScript file
* **Good:** Single file easy to find code.  
* **Good:** No dependency management.  
* **Bad:** Becomes unwieldy as app grows.  
* **Bad:** Higher likelihood of merge conflicts.  
* **Bad:** Poor separation of concerns.

### Option B: Multiple JS files by feature domain
* **Good:** Organizes code by domain concepts.  
* **Good:** Encourages modular design.  
* **Neutral:** Requires planning upfront.  
* **Bad:** Relationship between HTML and JS not immediately clear.

### Option C: One JS file per HTML file
* **Good:** Clear 1:1 mapping between UI and behavior.  
* **Good:** Easier debugging per page.  
* **Bad:** Shared functionality duplicated if not handled separately.

### Option D: Mixed utility + page-specific files
* **Good:** Combines modular design with page mapping.  
* **Good:** Reduces duplication via utility files.  
* **Neutral:** More complex organization.  
* **Bad:** Potential confusion about where functionality lives.

### Option E: Controller-based approach with function-specific and page-specific files
* **Good:** Maximum modularity; controllers folder with reusable functions.  
* **Good:** Straightforward unit testing of functions.  
* **Good:** Maintains clear page-specific JS mapping.  
* **Neutral:** Requires an import/export strategy.  
* **Bad:** Many small files to manage.  
* **Bad:** Possible impact on initial page load without bundling.

## Implementation Details

Project structure:

```
source/
├── components/
│ ├── job-card-component.js
│ ├── material.js
│ └── add-application.css
├── pages/
│ ├── add_application.html
│ ├── applications.html
│ ├── dashboard.html
│ └── index.html
├── js/
│ ├── add_application.js
│ ├── applications.js
│ ├── dashboard.js
│ └── index.js
├── controllers/
│ ├── createApplication.js
│ ├── readApplications.js
│ ├── updateApplication.js
│ └── deleteApplication.js
├── utils/
│ ├── sortApplications.js
│ ├── filterApplications.js
│ └── formatData.js
└── styles/
└── template.css
```

- **pages/**: HTML files  
- **components/**: Custom Components like our card object
- **js/**: Page-specific JS importing controllers and utils  
- **controllers/**: CRUD operations as single-function modules  
- **utils/**: Data transformation helpers  
- **styles/**: CSS files for styling

## More Information

We will create a lint configuration file to enforce these style standards automatically. We can revisit this ADR if adopting a component framework or if the number of controller files becomes unmanageable.  
