---
parent: Decisions
nav_order: 100
title: ADR-0001 Adopt Modular 3-Tier Architecture
status: proposed
date: 2025-05-08
---

# Adopt Modular 3-Tier Architecture

## Context and Problem Statement

We’re building a core app for manually tracking job applications (appointments, status, notes, checklists, etc.) and want to leave room for optional features (like filtering external RSS feeds). We need an architecture that:

- Keeps the core workflow simple and maintainable  
- Lets us develop and test UI, business logic, and data storage in parallel  
- Makes it easy to plug in or remove optional modules without rewriting everything

## Considered Options

* **Option A: Monolithic Application**  
  - All UI, business logic, and data access live in a single codebase or service  
  - Pros: very simple setup, no inter-service communication  
  - Cons: tightly coupled features, hard to split work or add/remove modules  

* **Option B: Modular 3-Tier Architecture**  
  - **UI Layer** (HTML/CSS + minimal JS)  
  - **API/Logic Layer** (separate service handling core “application” workflows, plus optional feature endpoints)  
  - **Data Layer** (dedicated storage service; details to be decided in ADR-0002)  
  - Pros: clear separation of concerns, parallel team work, easy feature toggles  
  - Cons: initial overhead wiring layers together, some extra deployment configuration  

## Decision Outcome

**Chosen option:** Option B, Modular 3-Tier Architecture.

**Rationale:**  
- Enables independent development of core app vs optional features  
- Simplifies testing and code reviews by layer  
- Future-proofs the project: we can swap out or extend the RSS-feed module (or any other) without touching core tracking logic

### Consequences

**Positive:**  
- Teams can work on UI, business logic, and storage in parallel  
- Optional features (e.g. RSS filtering) live as standalone modules  
- Easier to scale or replace layers later

**Negative:**  
- Requires setting up and coordinating multiple services/endpoints  
- Slightly more complex CI/CD pipelines and deployment steps

---

> **Next step:** In ADR-0002 we will evaluate specific database options for the Data Layer.  
