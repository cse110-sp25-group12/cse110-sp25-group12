# 🛠️ Team 12 | Git Commitment Issues — Development Guidelines

> **Focus**: This course emphasizes **process over product**. This document defines how we work as a team — our structure, practices, and tools to ensure quality, transparency, and collaboration throughout the project.


## 📚 Overview

This guide ensures that every team member understands:
- How we write, review, and manage code
- Our project workflow and responsibilities
- How we stay transparent and accountable
- The standards required for successful teamwork


## 🚀 Tech Stack (To Be Finalized by Team)

- **Frontend**: TBD
- **Backend**: TBD
- **Database**: TBD
- **Hosting**: TBD


## 🔄 Git Workflow & Version Control

### 🔧 Branches
- `main`: Always deployable. Protected.
- `dev`: Integrates all features before merging to `main`.

### 🌿 Feature Branch Naming
- Each task/feature gets a branch: `team/feature/feature-name`, `bugfix/issue-name`

### ✍️ Meaningful, consistent commit messages:
- `feat: add login screen`
- `fix: resolve auth error`
- `test: add unit tests for auth utils`
- Keep PRs small and focused.

### 🔁 Pull Requests
- Must be reviewed and approved by **2 team members**
- Include:
  - Clear description of changes
  - Screenshots for UI (if applicable)
  - Linked issue (if applicable)
  - ✅ All tests passing


## 👀 Code Reviews

- All PRs must be reviewed by two peers
- Reviewers check for:
  - Code clarity and style
  - Functionality and logic
  - Test coverage
  - Simplicity and maintainability
- Be constructive and kind in feedback


## 🧪 Testing

- Each feature must include relevant **unit tests**
- coverage? talk to TA?
- Run all tests before pushing code


## 🤖 CI/CD

Use **GitHub Actions** for:  TBD???
- Running tests
- Linting
- Deploying on merge to `main`
- Auto-deploy to staging or production (as configured)


## ✅ Definition of Done

A feature/task is **done** when:
- [ ] It works as intended
- [ ] Code is pushed to a feature branch
- [ ] PR is approved by two reviewers
- [ ] Tests are included and passing
- [ ] Code is deployed (if applicable)
- [ ] Docs are updated (if applicable)


## 🛠️ Project Management

- **Tool**: GitHub Projects
- Each task includes:
  - Description
  - Status: `Todo`, `In Progress`, `In Review`, `Done`
  - Assignees
  - Due Date
  - Definition of Done
- Weekly team syncs to prioritize and check progress


## 📄 Documentation

- Stored in WHERE?? TBD
- Must include:
  - TBD??
  - TBD??


## 🔍 Transparency for TA/Professor

- Weekly updates posted in a shared doc or Slack  
- GitHub shows team activity (commits, PRs, issues)  
- Documented processes, decision logs, and retrospectives  
- Everything accessible for review


## 💬 Communication

- **Slack** for all team communication  
  Channels: `#general`, `#frontend`, `#backend`, `#qa`, etc. TBD!!!
- **Weekly Meetings:**
  - **Quick updates:** What was done? What’s next? Any blockers?
    - When? Thursdays 11 a.m.
  - **Retro/Planning:** What was good / What can be done better? - Upcoming tasks for the week?
    - When? TBD
- **Meeting Notes** live in GitHub Repo: [Meeting Notes](meeting-notes.md)


## 🎯 Team Roles (Example)

| Role               | Name   | Responsibility                                   |
|--------------------|--------|--------------------------------------------------|
| Team Lead "Project"| Fabio  | Meetings, planning, communication, deadlines     |
| Team Lead "Tech"   | James  | Architecture, CI/CD, coding standards            |
| Frontend Lead      | TBD    | UI components, frontend logic                    |
| Backend Lead       | TBD    | API, backend structure                           |
| QA / Testing       | TBD    | Testing strategy, quality checks                 |
| CI/CD Lead         | TBD    | GitHub Actions, deployment workflows, automation |

> 🔄 Roles can rotate or evolve over time.


## 💡 Final Tips

- Prioritize communication & clarity  
- Keep scope realistic — simplicity > complexity  
- Ask for help early  
- Follow the process — the TA and Prof are watching how we work





