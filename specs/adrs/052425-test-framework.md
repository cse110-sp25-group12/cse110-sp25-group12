---
parent: Decisions
nav_order: 400
title: ADR-0004: Choose Testing Framework
status: accepted
date: 2025-05-24
---

# Choose Testing Framework

## Context and Problem Statement

To support test-driven development and maintain code quality in our job-tracker app, we need a unit testing framework that’s easy for our team to adopt, integrates well with our plain-JS setup, and provides essential features like mocking and coverage reporting.

## Considered Options

* **Option A: Jest**  
* **Option B: Mocha**  
* **Option C: Vitest**

## Decision Outcome

**Chosen option:** Jest

**Rationale:**  
- Built-in mocking and code-coverage tools with zero extra setup  
- Watch mode and parallel test execution boost productivity  
- Team members already have some Jest experience, reducing onboarding time  

## Consequences

**Positive:**  
- Fast initial setup and out-of-the-box features (mocking, coverage, snapshot testing)  
- Active ecosystem and strong documentation  
- Built-in watch mode for rapid feedback loops  

**Neutral:**  
- May require additional tuning in CI or with custom build tools  
- Startup time can increase as test suite grows  

**Negative:**  
- Slightly heavier dependency compared to minimal frameworks  
- Jest’s internal architecture can be opaque when debugging very deep issues  

## Pros and Cons of the Options

### Option A: Jest
* **Good:** All-in-one framework with mocking, coverage, and snapshot support  
* **Good:** Zero-config setup for most use cases  
* **Good:** Parallel test execution and built-in watch mode  
* **Bad:** Slower startup on large codebases  
* **Bad:** Can be overkill for very small projects  

### Option B: Mocha
* **Good:** Highly customizable; choose your own assertion and mocking libraries  
* **Neutral:** Established ecosystem in Node.js  
* **Bad:** Requires additional packages (Chai, Sinon) to match Jest features  
* **Bad:** No built-in coverage or snapshot support  

### Option C: Vitest
* **Good:** Lightning-fast, Vite-native test runner  
* **Good:** Jest-compatible API makes migration easy  
* **Neutral:** Growing ecosystem; fewer plugins than Jest  
* **Bad:** Less mature, with occasional compatibility gaps  

## More Information