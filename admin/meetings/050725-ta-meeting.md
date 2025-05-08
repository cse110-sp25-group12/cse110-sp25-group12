# TA Meeting Notes — 2025-05-07

## Team Contract
- Everyone knows what their role is / responsibilities  
- See Canvas Assignment

## Project Kickoff

### ADR (Architecture Decision Record)
- **Why?**  
  - Keeps track of decisions for later review
- **Structure:**  
  1. **Context of the Problem**  
     - e.g. database for storing nodes  
  2. **Options Available**  
     - e.g. JS/unit, etc.  
  3. **Decision**  
  4. **Outcome** (pros/cons)

### CI/CD
- Incremental process  
- Automating tasks  
- **Phase 1:** Linting & code reviews  
- **Phase 2:**  
  - Unit tests (JS framework)  
  - Documentation (JSDoc)  
- Coverage: Codacy  
- E2E (if time permits): GitHub Actions (.yaml)  
- Etc.

### Branching Strategy
- Option 1: Main and dev branches  
- Option 2: Branch per feature

### Issue Management & Kanban Board
1. Convert tasks to issues  
2. Use issue templates  
3. Create feature branch named after the issue  
4. Open a PR (closes the issue)  
5. Mark task as done

---

## Other Notes
**Example Workflow:**  
Kanban board → convert task to issue → issue template → feature branch → PR (close issue) → mark task done

## Roles per feature example (we don`t have to do it like that)
- For each feature:  
  - 1 × Frontend developer  
  - 1 × Backend developer  
  - 1 × Tester  
  (team of 3)

## Meetings
- **Daily Standups:** via Slack (dedicated channel), fixed time (e.g. 10–11 AM; everyone drops a message)  
- **Weekly:** Thursdays  
- **Post-class:** Tuesdays after class  