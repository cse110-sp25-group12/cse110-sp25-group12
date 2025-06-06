---
parent: Decisions
nav_order: 001
title: ADR-001 Chart.js CDN Import
status: "proposed"
date: 2025-01-06
---

# Allow Chart.js CDN Import

## Problem
Need data visualization for job application analytics (charts, graphs, progress tracking).

## Decision
Allow `import 'https://cdn.jsdelivr.net/npm/chart.js';` for testing and development.

## Reasoning
- Fast to implement and test
- Chart.js is lightweight and reliable
- jsDelivr CDN has good performance
- Perfect for our visualization needs

## Consequences
- ✅ Quick prototyping of charts
- ✅ No build configuration needed
- ❌ Requires internet connection
- ❌ External dependency

## Usage
Approved for:
- Application status charts
- Timeline visualizations  
- Progress tracking graphs 