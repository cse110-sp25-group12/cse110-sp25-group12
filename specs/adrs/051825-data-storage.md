---
parent: Decisions
nav_order: 200
title: ADR-0002: Choose Client-Side Storage API
status: accepted
date: 2025-05-18
---

# Use localStorage Instead of IndexedDB for Client-Side Storage

## Context and Problem Statement

The front-end team needs a browser storage API for our job-tracker app to hold small amounts of user data (preferences, lightweight session state). We must balance:

- Simplicity of implementation  
- Broad browser compatibility  
- Adequate performance for our use cases  

## Considered Options

* **localStorage**  
* **IndexedDB**  
* **WebSQL** (deprecated)  
* **Cookies**

## Decision Outcome

**Chosen option:** localStorage

**Rationale:**  
- Very simple key/value API (no async boilerplate)  
- Excellent support across all target browsers  
- Zero setup beyond calling `localStorage.setItem()`  

## Consequences

**Positive:**  
- Implementation time cut from ~2 weeks to ~2–3 days  
- Minimal learning curve and maintenance overhead  
- Data persists across browser restarts without extra code  

**Negative:**  
- Storage cap (~5–10 MB) may limit future expansion  
- Synchronous API can block the main thread on large operations  
- No built-in querying or indexing beyond simple keys  

## Pros and Cons of the Options

### localStorage

- **Good:** Simple API (`setItem`/`getItem`), universal browser support  
- **Neutral:** String-only storage (requires JSON stringify/parse)  
- **Bad:** Limited capacity; synchronous calls can block UI  

### IndexedDB

- **Good:** Large storage (>50 MB), complex data structures, async API  
- **Neutral:** Supported in modern browsers only  
- **Bad:** Steep learning curve; verbose API; more setup code  

### WebSQL

- **Good:** SQL-style queries  
- **Bad:** Deprecated; inconsistent browser support  

### Cookies

- **Good:** Works in every browser; accessible server- and client-side  
- **Bad:** Tiny storage (~4 KB); sent with every HTTP request; not suited for app state  

## More Information

If our storage needs grow (e.g. large offline caches or advanced indexing), we will revisit and likely switch to IndexedDB in a future ADR.