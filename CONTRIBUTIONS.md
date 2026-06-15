# How to Submit Your Bug Fixes

This guide explains how to contribute your bug fixes to the GatewayOps project.

---

## Before You Start

1. Read `docs/problems.md` for the 10 bugs
2. Get the project running: `docker compose up --build`
3. Reproduce the issues you're fixing
4. Understand the root cause before coding

---

## Workflow

### 1. Create a Branch for Your Fix

For each bug fix, create a descriptive branch:

```bash
git checkout -b fix/metrics-aggregation-double-count
git checkout -b fix/pagination-off-by-one
git checkout -b fix/stale-cache
```

**Branch naming convention:**
```
fix/<bug-number>-<short-description>
```

Examples:
- `fix/1-metrics-aggregation`
- `fix/8-authorization-guard`
- `fix/10-date-range-edge-case`

### 2. Make Your Changes

**For each bug:**

1. **Investigate** the root cause
2. **Create a failing test** (if applicable)
3. **Fix the code**
4. **Verify the fix** works
5. **Test edge cases**

### 3. Commit Your Changes

**Write clear commit messages:**

```bash
git add .
git commit -m "Fix: Correct pagination offset calculation

- Changed (page - 1) * limit instead of page * limit
- Fixes off-by-one error on first page skipping records
- Last page is now reachable
- Verified with manual testing of 50+ pages"
```

**Commit message format:**
```
<type>: <subject>

<body explaining what changed and why>

<footer with any references>
```

**Types:**
- `fix:` — Bug fix
- `refactor:` — Code restructuring without changing behavior
- `test:` — Added or updated tests
- `docs:` — Documentation updates

### 4. Push to Remote

```bash
git push origin fix/pagination-off-by-one
```

### 5. Create a Pull Request

On GitHub:

1. Go to the repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template (see below)
5. Submit

---

## Pull Request Template

Use this structure for your PR description:

```markdown
## Bugs Fixed

Fixes #1, #2, #3 (reference the problem numbers)

## Problem Description

[Brief description of what was broken]

## Root Cause

[Explain why it was broken - be specific]

### Bug 1: Metrics Aggregation Double-Count

**Root Cause:**
The `getSummary()` method in metrics.repository.ts was using...

**Impact:**
- Dashboard totals were 15-20% higher than actual
- Users made capacity decisions based on wrong data

## Solution

[Explain how you fixed it]

### Bug 1: Metrics Aggregation

**The Fix:**
Changed the aggregation query from:
```sql
SELECT COUNT(DISTINCT id) FROM ... JOIN ...
```
to:
```sql
SELECT COUNT(*) FROM api_logs WHERE ...
```

## Verification

[How you tested the fix]

### Bug 1: Metrics Aggregation
- [x] Dashboard shows correct total
- [x] Metrics match database count
- [x] Tested with fresh data insert
- [x] Tested with filtered date ranges
- [x] No regression on other endpoints

## Checklist

- [x] All affected bugs are fixed
- [x] Tests pass (if applicable)
- [x] Code follows project style
- [x] No console errors
- [x] Verified on real data
- [x] Tested edge cases
```

---

## Code Style Guidelines

### TypeScript

- Use `strict: true` mode
- No `any` types unless absolutely necessary
- Use proper typing for function parameters and returns
- No unused variables

```typescript
// ❌ Bad
const getSummary = async (from: any, to: any) => {
  let result;
  // ...
  return result;
};

// ✅ Good
async function getSummary(from: string, to: string): Promise<MetricsSummary> {
  const result: MetricsSummary = {
    total_requests: 0,
    // ...
  };
  return result;
}
```

### SQL Queries

- Use parameterized queries (never string interpolation)
- Add comments for complex queries
- Use meaningful alias names
- Format consistently

```sql
-- ❌ Bad
WHERE created_at BETWEEN '${from}' AND '${to}'

-- ✅ Good
WHERE created_at BETWEEN $1 AND $2
```

### React Components

- Use functional components with hooks
- Proper TypeScript typing
- Meaningful component names
- One component per file

```typescript
// ❌ Bad
export default () => {
  return <div>...</div>;
};

// ✅ Good
interface MetricCardProps {
  title: string;
  value: number;
}

export function MetricCard({ title, value }: MetricCardProps): JSX.Element {
  return <div>{title}: {value}</div>;
}
```

---

## Testing Your Fixes

### Manual Testing Checklist

For each bug, verify:

1. **Reproduce the original issue** — Confirm the bug exists
2. **Apply the fix** — Make your code changes
3. **Test the fix** — Does it solve the problem?
4. **Test edge cases** — Does it work in all scenarios?
5. **Check for regressions** — Did you break anything else?

### Example: Pagination Bug

```bash
# 1. Reproduce
curl "http://localhost:4000/api/v1/logs?page=1&limit=10"
# Note: First record is missing (should start from record 1)

# 2. Fix the code
# Edit apps/api/src/repositories/logs.repository.ts
# Change: const offset = page * limit;
# To:     const offset = (page - 1) * limit;

# 3. Rebuild
docker compose build api
docker compose up

# 4. Test the fix
curl "http://localhost:4000/api/v1/logs?page=1&limit=10"
# Now shows records 1-10

curl "http://localhost:4000/api/v1/logs?page=2&limit=10"
# Now shows records 11-20

# 5. Test edge cases
curl "http://localhost:4000/api/v1/logs?page=1000&limit=10"
# Should return empty or last page correctly
```

---

## Submitting Multiple Fixes

If you're fixing multiple bugs:

1. Create one PR per bug (separate branches, separate PRs)
   - `fix/1-metrics-aggregation`
   - `fix/2-pagination-off-by-one`
   - `fix/3-stale-cache`

   OR

2. Create one comprehensive PR with multiple commits
   - Each commit is one bug fix
   - PR title: "Fix: Resolve 10 production issues"

**Recommended:** Separate PRs for easier review, but either is acceptable.

---

## Commit Best Practices

### Good Commit

```
Fix: Correct metrics aggregation query

Changed COUNT(DISTINCT id) to COUNT(*) in getSummary() to avoid
double-counting when logs have multiple metadata entries.

This fixes the 15-20% inflation in dashboard totals reported by
the platform team.

- Database query now returns accurate counts
- Dashboard metrics reflect actual log count
- Verified with 10,000 log records
- No performance regression
```

### Bad Commit

```
fix bug
```

---

## Review Process

When you submit your PR:

1. **Code review** — Reviewer checks if fix is correct
2. **Testing feedback** — Any issues found?
3. **Revision** — Update your PR if needed
4. **Approval** — PR gets merged when ready

---

## FAQ

### How many bugs should I fix?

- **Minimum:** At least 3-5 bugs for a credible submission
- **Ideal:** All 10 bugs
- **Maximum:** No limit, fix as many as you can

### Should I write tests?

- **Optional** — Not required for the assessment
- **Recommended** — Shows good practice
- Existing tests should still pass

### Can I refactor while fixing?

- **Keep it minimal** — Focus on the bug fix
- **No scope creep** — Save refactoring for later
- **Don't break other code** — Make sure regression tests pass

### How long does review take?

- Typically 24-48 hours
- Complex fixes might take longer
- You'll get feedback to address

### What if my fix doesn't work?

- **That's OK** — Push a follow-up commit
- **Explain what went wrong** — Document the issue
- **Resubmit** — Include the fix for the fix

---

## Questions?

Check the documentation:
- [README.md](README.md) — Full project documentation
- [GETTING_STARTED.md](GETTING_STARTED.md) — Quick setup guide
- [docs/problems.md](docs/problems.md) — Detailed problem descriptions
- [DOCKER_COMMANDS.md](DOCKER_COMMANDS.md) — Docker operations

---

## Good Luck! 🚀

You've got this. Take your time, understand the root causes, and submit quality fixes.
