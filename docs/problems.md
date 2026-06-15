# GatewayOps — Production Issue Assessment

Welcome to the **GatewayOps debugging assessment**. Below are 10 production issues reported by the platform team. Your task is to investigate each issue, identify the root cause, implement a fix, and document your findings.

---

## Overview

**What You'll Do:**
1. Read the problem description and expected behavior
2. Investigate the codebase to find the root cause
3. Implement a fix
4. Verify the fix works
5. Document your findings

**How to Approach:**
- Start with problems marked as **High** or **Critical** severity
- Use the browser DevTools and API endpoints to reproduce issues
- Check database directly: `docker compose exec postgres psql -U gatewayops -d gatewayops`
- Review logs: `docker compose logs -f api`
- Test API endpoints with `curl`

**Submission:**
Create a pull request with your fixes. For each bug, provide:
- Root cause analysis
- Code changes (diff format)
- How you verified the fix
- Prevention suggestions

---

## Problem 1: Inaccurate Dashboard Totals

**Reported by:** Platform team  
**Severity:** 🔴 **High**  
**Area:** Metrics aggregation, database queries  
**Files to investigate:** `apps/api/src/repositories/metrics.repository.ts`

### Issue Description

The dashboard summary cards show total request counts that do not match expectations based on known traffic volumes. The numbers appear inflated by approximately 15–20%.

### Steps to Reproduce

1. Open the dashboard at http://localhost:3000
2. Note the "Total Requests" value shown on the dashboard
3. Run SQL query: `SELECT COUNT(*) FROM api_logs;`
4. Compare the two values — they don't match

### Expected Behavior

The total request count shown on the dashboard should accurately reflect the number of API log records in the system (should match the SQL count).

### Impact

- Users make decisions based on incorrect metrics
- Capacity planning is affected
- SLA monitoring is unreliable

---

## Problem 2: Incomplete API Log Pagination

**Reported by:** Operations team  
**Severity:** 🟡 **Medium**  
**Area:** Database queries, pagination logic  
**Files to investigate:** `apps/api/src/repositories/logs.repository.ts`

### Issue Description

Users navigating the API Logs page report that:
- The first page appears to skip some records
- The final page of results is never reachable
- Clicking "Next" repeatedly shows the same records

### Steps to Reproduce

1. Go to http://localhost:3000/logs
2. Note the records shown on page 1
3. Click "Next" to go to page 2
4. Try going back to page 1 — different records appear
5. Try to reach the last page — it never shows all records

### Expected Behavior

Pagination should:
- Display records 1–10 on page 1
- Display records 11–20 on page 2
- Be able to reach the last page
- Show total count accurately

### Impact

- Users cannot view complete logs
- Missing visibility into API behavior
- Debugging is impossible

---

## Problem 3: Dashboard Metrics Don't Refresh

**Reported by:** On-call engineer  
**Severity:** 🔴 **High**  
**Area:** Caching, cache invalidation  
**Files to investigate:** `apps/api/src/services/metrics.service.ts`

### Issue Description

After generating new API traffic or seeding additional log data, the dashboard summary cards continue to show the same values from the initial load. Refreshing the browser does not help.

### Steps to Reproduce

1. Open the dashboard and note the metrics
2. Insert new data into the database:
   ```bash
   docker compose exec postgres psql -U gatewayops -d gatewayops -c \
   "INSERT INTO api_logs (...) VALUES (...);"
   ```
3. Refresh the browser on the dashboard
4. The metrics are unchanged

### Expected Behavior

The dashboard should show fresh data reflecting the current database state. Cache should expire or be invalidated when new data is added.

### Impact

- Stale metrics cause incorrect alerting
- Operational decisions based on old data
- Defeats the purpose of a monitoring dashboard

---

## Problem 4: Combined Filters Return Wrong Results

**Reported by:** QA team  
**Severity:** 🟡 **Medium**  
**Area:** Query logic, filter combination  
**Files to investigate:** `apps/api/src/repositories/logs.repository.ts`

### Issue Description

When a user selects **both** a specific service (e.g., "Payment Service") and a specific status code (e.g., "5xx") in the API Logs filter bar, the results include logs from **all services**, not just the selected one.

### Steps to Reproduce

1. Go to http://localhost:3000/logs
2. Select service: "Payment Service"
3. Select status code: "5xx"
4. Click filter/search
5. Results show 5xx logs from **all services**, not just Payment Service

### Expected Behavior

Results should show only 5xx logs from the Payment Service. All filters should use AND logic, not OR.

### Impact

- Filtering is unreliable
- Users cannot isolate issues to specific services
- Hard to troubleshoot service-specific problems

---

## Problem 5: Rate Limit Calculations Are Wrong

**Reported by:** Infrastructure team  
**Severity:** 🔴 **High**  
**Area:** Math, calculations  
**Files to investigate:** `apps/api/src/repositories/rateLimits.repository.ts`

### Issue Description

The "Requests per Minute" (RPM) metric displayed on the Rate Limits page appears **lower than expected** during peak traffic periods. The discrepancy grows larger when the observation window is not a round multiple of 60 seconds.

### Example

- **Real-world data:** 1,000 requests in a 90-second window
- **Expected RPM:** ~666.67 requests/min
- **Actual displayed:** ~555 requests/min (off by ~20%)

### Expected Behavior

RPM should be calculated accurately regardless of the duration of the selected time window.

### Impact

- Rate limiting decisions are based on incorrect metrics
- Services get incorrectly throttled or over-provisioned
- SLA breaches go undetected

---

## Problem 6: Failed Login Count Is Too Low

**Reported by:** Security team  
**Severity:** 🔴 **High**  
**Area:** Query filtering, data consistency  
**Files to investigate:** `apps/api/src/repositories/auth.repository.ts`

### Issue Description

The Authentication Dashboard shows a failed login count that is **significantly lower** than what the security team observes in raw logs. Approximately **30% of failure events appear to be missing** from the reported total.

### Steps to Reproduce

1. Go to http://localhost:3000/auth-stats
2. Note the "Failed Logins" count
3. Run SQL query:
   ```sql
   SELECT COUNT(*) FROM auth_events WHERE event_type IN ('login_failure', 'failed_login');
   ```
4. The dashboard count is lower

### Expected Behavior

All login failure events should be counted, regardless of how they were recorded in the system.

### Impact

- Security visibility is compromised
- Attack patterns go undetected
- Compliance reporting is inaccurate

---

## Problem 7: API Logs Endpoint Is Slow at Scale

**Reported by:** Platform team  
**Severity:** 🔴 **High**  
**Area:** Performance, database indexes, query optimization  
**Files to investigate:** `apps/api/src/repositories/logs.repository.ts`, database schema

### Issue Description

The `/api/v1/logs` endpoint responds within 100ms on a fresh database but degrades to **8–15 seconds** once the database contains the full dataset. The slowdown is especially noticeable when filters are applied.

### Steps to Reproduce

1. When fresh: `curl http://localhost:4000/api/v1/logs` → responds in <100ms
2. After seeding full data: same query → responds in 8–15 seconds
3. With filters: `curl "http://localhost:4000/api/v1/logs?service=payment-service&statusCode=500"` → even slower

### Expected Behavior

Log queries should return within 500ms even on a fully seeded database with active filters.

### Likely Causes

- Missing database indexes
- N+1 query problem (query per row)
- Inefficient joins

### Impact

- Users experience frustrating delays
- High load on database server
- Logging infrastructure becomes the bottleneck

---

## Problem 8: Non-Admin Users Can Access Admin Endpoint

**Reported by:** Security audit  
**Severity:** 🔴 **Critical**  
**Area:** Authorization, middleware ordering  
**Files to investigate:** `apps/api/src/routes/metrics.routes.ts`

### Issue Description

During a routine security review, it was discovered that the endpoint:
```
GET /api/v1/metrics/admin/detailed
```
returns data to **any authenticated user**, not just administrators. No authorization error is returned for non-admin accounts.

### Steps to Reproduce

1. As a regular user, try:
   ```bash
   curl http://localhost:4000/api/v1/metrics/admin/detailed
   ```
2. You receive detailed metrics (should get 403 Forbidden)
3. Admin-only data is exposed

### Expected Behavior

This endpoint must only be accessible to users with the `admin` role. All other users should receive a `403 Forbidden` response.

### Impact

- **CRITICAL SECURITY VULNERABILITY**
- Unauthorized access to sensitive metrics
- Exposure of system internals
- Compliance violation
- Potential basis for attack planning

---

## Problem 9: Dashboard Cards and Charts Show Different Values

**Reported by:** Product team  
**Severity:** 🟡 **Medium**  
**Area:** State management, React Query, cache keys  
**Files to investigate:** `apps/web/src/hooks/useDashboardMetrics.ts`, `apps/web/src/app/page.tsx`

### Issue Description

When a user changes the date range filter on the dashboard:
- **Charts update correctly** (requests-over-time, error-trends)
- **KPI summary cards don't update** (Total Requests, Failed Requests, etc.)

The cards show values from the previously selected range or the default view.

### Steps to Reproduce

1. Open http://localhost:3000
2. Note the metrics on the KPI cards
3. Change the date range using the date picker (top right)
4. Charts update immediately
5. Cards show old values from before the date change

### Expected Behavior

All dashboard components should display data for the same selected date range at all times.

### Impact

- User confusion (seeing contradictory metrics)
- Wrong decisions based on mismatched data
- Reduced trust in the dashboard

---

## Problem 10: Single-Day Date Filter Returns No Results

**Reported by:** Operations team  
**Severity:** 🟡 **Medium**  
**Area:** Date handling, time boundaries  
**Files to investigate:** `apps/api/src/repositories/logs.repository.ts`

### Issue Description

When a user selects the **same date** for both the start and end of the date range filter (i.e., filtering for a single specific day), the API Logs page returns **zero results** even when logs clearly exist for that date.

### Steps to Reproduce

1. Go to http://localhost:3000/logs
2. Click the date filter
3. Select start date: June 1, 2024
4. Select end date: June 1, 2024
5. Click apply
6. Result: No logs shown (but logs exist for that date)

### Example

```bash
curl "http://localhost:4000/api/v1/logs?from=2024-06-01&to=2024-06-01"
# Returns empty array, but:
# SELECT COUNT(*) FROM api_logs WHERE DATE(created_at) = '2024-06-01';
# Returns: 50 records
```

### Expected Behavior

Selecting a single day as the date range should return all log records from 00:00:00 to 23:59:59 on that day.

### Impact

- Users cannot view logs for specific dates
- Daily analysis is impossible
- Troubleshooting incidents is harder

---

## Submission Template

For each problem you fix, create a section like this in your pull request:

### Bug Fix: [Problem Name]

**Root Cause:**
[Describe what was causing the issue]

**Impact:**
[How it affects users/system]

**The Fix:**
```diff
[Code diff showing your changes]
```

**Verification:**
[How you tested that it's fixed]
- [Verification step 1]
- [Verification step 2]
- [Verification step 3]

**Prevention:**
[How could this have been caught earlier?]
- Suggestion 1
- Suggestion 2

---

## Evaluation Criteria

Your submission will be evaluated on:

1. **Problem Identification** (20%)
   - Did you correctly identify the root cause?
   - Is your analysis accurate?

2. **Solution Quality** (40%)
   - Is the fix correct and complete?
   - Does it solve the problem without introducing new bugs?
   - Is the code following project patterns?

3. **Verification** (20%)
   - Can you demonstrate the fix works?
   - Did you test edge cases?
   - Did you verify no regression?

4. **Documentation** (15%)
   - Clear explanation of the issue
   - Clear explanation of the fix
   - Good prevention suggestions

5. **Code Quality** (5%)
   - Does it follow TypeScript best practices?
   - Is it maintainable?
   - Does it fit the architecture?

---

## Tips for Success

✅ **Do:**
- Start with the highest severity bugs
- Use browser DevTools to debug
- Check database directly with psql
- Review related code
- Test thoroughly
- Write clear commit messages
- Document your findings well

❌ **Don't:**
- Guess at fixes without understanding the root cause
- Change code without testing
- Leave TODO comments
- Over-engineer solutions
- Submit without verification
- Rush through the analysis

---

## Resources

- **README:** Full documentation about the project
- **API Docs:** Endpoint reference in README
- **Docker Commands:** `DOCKER_COMMANDS.md` for common operations
- **Code Structure:** `apps/api/src/` for backend, `apps/web/src/` for frontend

---

## Timeline

Take your time to investigate each issue properly. Quality matters more than speed. Typical assessment time: 2–4 hours depending on experience level.

---

**Good luck! You've got this. 🚀**
