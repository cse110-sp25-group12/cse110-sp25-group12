---
parent: Decisions
nav_order: 002
title: Use localStorage for Client-Side Storage
status: "accepted"
date: 2023-05-22
---

# Use localStorage Instead of IndexedDB for Client-Side Storage

## Context and Problem Statement

The backend team needs to implement client-side storage for our web application. We need to determine which browser storage API to use that balances simplicity, browser compatibility, and performance while meeting our application's storage needs.

## Considered Options

* localStorage
* IndexedDB
* WebSQL (deprecated)
* Cookies

## Decision Outcome

Chosen option: "localStorage", because it provides the best balance of simplicity and functionality for our current needs without introducing unnecessary complexity.

### Consequences

* Good, because implementation time will be significantly reduced
* Good, because the learning curve for developers is minimal
* Good, because maintenance complexity is low
* Bad, because storage is limited to 5-10MB depending on the browser
* Bad, because it's synchronous and could potentially block the main thread

## Pros and Cons of the Options

### localStorage

* Good, because it has a simple key-value API (setItem, getItem, removeItem)
* Good, because it has excellent browser compatibility
* Good, because it requires minimal setup code
* Good, because data persists after browser restarts
* Neutral, because it supports string data only (requires JSON serialization for objects)
* Bad, because it's limited to 5-10MB of storage
* Bad, because it's synchronous and can block the main thread with large operations
* Bad, because it lacks advanced querying capabilities

### IndexedDB

* Good, because it offers large storage capacity (typically 50-100MB or more)
* Good, because it supports complex data structures
* Good, because it's asynchronous and won't block the main thread
* Good, because it provides advanced querying and indexing capabilities
* Neutral, because it has good browser support in modern browsers
* Bad, because it has a complex API with a steep learning curve
* Bad, because implementation requires significantly more code
* Bad, because it adds considerable complexity to maintenance

### WebSQL

* Good, because it offers SQL query capabilities
* Bad, because it's deprecated and no longer recommended
* Bad, because it has inconsistent browser support

### Cookies

* Good, because they work across all browsers
* Good, because they can be accessed by both client and server
* Bad, because they have severe size limitations (4KB)
* Bad, because they're sent with every HTTP request, creating overhead
* Bad, because they're not suited for application state storage

## More Information

This decision is based on our current application requirements, which include storing small amounts of user preferences and temporary session data. If storage requirements grow significantly or we need complex data querying capabilities, we may revisit this decision.

The backend team estimates implementation with localStorage will take approximately 2-3 days, compared to 1-2 weeks for an IndexedDB implementation. The reduced complexity will also lower the barrier to entry for new developers joining the project. 