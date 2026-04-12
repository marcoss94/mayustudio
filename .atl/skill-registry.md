# Skill Registry — mayustudio

Generated: 2026-04-11

## Project Conventions

- No convention files yet (greenfield). CLAUDE.md and AGENTS.md pending creation in Phase 0.

## User Skills

| Skill          | Trigger                         | Source                          |
| -------------- | ------------------------------- | ------------------------------- |
| caveman        | Always active (user preference) | ~/.claude/skills/caveman        |
| go-testing     | Go tests, Bubbletea TUI testing | ~/.claude/skills/go-testing     |
| skill-creator  | Create new AI skills            | ~/.claude/skills/skill-creator  |
| branch-pr      | Creating pull requests          | ~/.claude/skills/branch-pr      |
| issue-creation | Creating GitHub issues          | ~/.claude/skills/issue-creation |
| judgment-day   | Adversarial parallel review     | ~/.claude/skills/judgment-day   |

## Compact Rules

### caveman

- Terse, direct, no filler. Execute first, talk second.
- No preamble, no postamble, no tool announcements.
- Cut words, never cut facts (code, errors, paths, numbers stay exact).

### branch-pr

- Issue-first enforcement: PR must reference a GitHub issue.
- Use `gh pr create` with structured body (Summary + Test Plan).

### issue-creation

- Issue-first enforcement: create issue before starting work.
- Use `gh issue create` with structured body.

### judgment-day

- Two blind judge sub-agents review in parallel.
- Synthesize findings, apply fixes, re-judge until both pass or escalate after 2 iterations.
