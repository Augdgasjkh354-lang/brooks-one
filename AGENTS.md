# Project Agent Instructions

## Stack
- Runtime: Node.js
- Frontend: Vanilla JS
- Backend: Express.js

## Architecture Rules
- Maximum 2000 lines per file. If approaching limit, refactor into a new module.
- Follow layered structure: routes → controllers → services → utils
- One responsibility per file, no exceptions.

## Naming Conventions
- Files: kebab-case (user-service.js)
- Classes: PascalCase (UserService)
- Functions: camelCase (getUserById)
- No duplicate class names across different directories.

## File Structure
src/
  routes/       # Entry only, no business logic (< 200 lines)
  controllers/  # Request handling (< 500 lines)
  services/     # Core business logic (< 800 lines)
  utils/        # Pure functions only (< 500 lines)
  config/       # Constants and env vars (< 100 lines)
public/
  js/           # Frontend scripts (< 500 lines each)
  css/

## Prohibited Behaviors
- Never put business logic in route files
- Never exceed 2000 lines without refactoring first
- Never use inline complex regex in business logic files
- Never create placeholder files with only comments

## PR Instructions
- Each PR must address one atomic task only
- PR description must list every file modified and why
