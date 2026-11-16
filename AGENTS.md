# AGENTS.md

## Project overview

This repository contains a reusable JavaScript framework designed to host multiple independent applications through a shared Framework Kernel.

The agreed architectural specification is maintained in:

`docs/architecture.md`

This document is the architectural source of truth.

## 1. Architectural guidance

- Read `docs/architecture.md` before undertaking work that affects the framework architecture.
- Follow the agreed architectural boundaries and responsibilities.
- Do not introduce architectural changes without explaining the reasoning and obtaining approval.
- If an implementation requirement conflicts with the architecture specification, stop and explain the conflict rather than silently changing the design.
- Avoid introducing unnecessary complexity or implementing features belonging to later development milestones.

## 2. Working modes

Distinguish clearly between three types of work:

**Investigation**
- Inspect and analyse existing code.
- Explain findings and identify potential issues.
- Do not modify project files.

**Planning**
- Propose implementation approaches.
- Identify affected files and potential risks.
- Explain alternatives where appropriate.
- Do not modify project files.

**Implementation**
- Only implement when the user explicitly requests implementation.
- For substantial changes, present the proposed approach and wait for approval before editing.
- Keep implementation within the agreed scope.

Discussing or proposing a solution does not, by itself, authorise implementation.

## 3. Change discipline

- Make small, focused changes.
- Preserve existing coding conventions unless there is an agreed reason to change them.
- Avoid unrelated refactoring.
- Do not introduce external dependencies without explaining why they are needed and obtaining approval.
- Do not rename or delete existing files without approval.
- Never overwrite or discard unrelated user changes.
- Do not modify `docs/architecture.md` unless explicitly instructed.
- Do not perform Git operations that change repository history or branch state, including commits, pushes, merges, resets or branch deletion, unless explicitly requested.

## 4. Testing and verification

- Inspect available project scripts and testing arrangements before choosing how to test.
- Run relevant tests and checks when implementing changes.
- Do not claim that something works unless it has been verified.
- Report any tests that could not be run and explain why.
- Avoid changing unrelated files merely to make a test pass.

## 5. Reporting changes

After implementation, provide:

- A summary of what was changed.
- A list of files created, modified or deleted.
- An explanation of important implementation decisions.
- Tests and verification performed, including their results.
- Any outstanding issues or recommendations.

Keep explanations clear and understandable. Explain unfamiliar technical decisions rather than assuming the user already knows them.