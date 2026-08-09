## Goal Description
The current `AdminDashboard` functionality allows for comprehensive management of the CLATS platform (Users, Curriculum, Analytics, Support Tickets, etc.). However, there are a few critical issues to ensure everything works properly and securely in a production environment:
1. **Frontend-Only Authentication:** The admin login is currently hardcoded in the frontend (`clatsafrica@gmail.com` with plaintext password). This is highly insecure and can be bypassed.
2. **Unprotected API Endpoints:** The backend API routes (e.g., `/api/supabase/users`, `/api/supabase/tickets`) do not enforce authentication, meaning anyone could theoretically query them to extract user data or modify the curriculum.
3. **Supabase Data Sync:** Some admin features rely on `localStorage` as a fallback. We need to ensure that when an admin modifies curriculum, games, or tickets, the changes securely sync to the backend Supabase tables.

This plan focuses on securing the admin panel, verifying the backend endpoints, and ensuring full end-to-end functionality.

## User Review Required
> [!WARNING]  
> **Security Update:** We will move the admin credentials to the backend. You will need to set an `ADMIN_EMAIL` and `ADMIN_PASSWORD` (or `ADMIN_SECRET`) in your Vercel Environment Variables. Until set, the backend will reject admin logins to protect the system.

## Open Questions
> [!IMPORTANT]
> 1. Are there any specific bugs or errors you have encountered while using the Admin Dashboard that I should focus on fixing first?
> 2. Do you want to restrict the admin dashboard to multiple different users (e.g., Support Staff vs Super Admin) using database roles, or is a single global Admin Password sufficient for now?

---

## Proposed Changes

### Backend (server.ts)
We will introduce an authentication layer for the Admin routes and protect the Supabase endpoints.

#### [MODIFY] server.ts
- **Add Admin Auth Endpoints:** Create `POST /api/admin/login` to verify credentials against environment variables and return a secure HttpOnly cookie or token.
- **Add Middleware:** Implement an `isAdmin` middleware that verifies the admin token.
- **Protect Supabase Routes:** Apply the `isAdmin` middleware to sensitive routes like `/api/supabase/users`, `/api/supabase/tickets/update`, and `/api/supabase/learning_pathways`.
- **Ensure Table Schemas:** Verify that the `SCHEMA_SQL` script contains the definitions for `learning_pathways`, `modules`, `lessons`, and `quizzes` so the admin panel can actually save to the database.

### Frontend (AdminDashboard.tsx & utils/config.ts)
Update the Admin Dashboard to authenticate via the backend rather than hardcoded strings.

#### [MODIFY] src/components/AdminDashboard.tsx
- Remove the hardcoded plaintext password check (`if (adminEmail === "..." && adminPassword === "...")`).
- Replace it with a `fetch("/api/admin/login", ...)` call that securely authenticates with the server.
- Ensure all Supabase `fetch` calls send the correct credentials/headers so they are not rejected by the new backend protection.
- Improve error handling if the Supabase tables don't exist yet (prompting the admin to "Initialize Database").

#### [MODIFY] src/App.tsx
- Ensure the routing to `AdminDashboard` correctly handles session states on page refreshes.

---

## Verification Plan

### Automated Tests
Currently, the monolithic structure relies on integration testing. We will verify the API routes using backend HTTP requests:
1. Attempt to fetch `/api/supabase/users` without a token -> **Should return 401 Unauthorized**.
2. Perform login at `/api/admin/login` with correct credentials -> **Should return 200 OK and a token**.
3. Attempt to fetch `/api/supabase/users` WITH the token -> **Should return 200 OK and data**.

### Manual Verification
Once the implementation is complete, you should manually verify:
1. Go to the app, click the Admin Dashboard button (or route).
2. Attempt to log in with an incorrect password (should fail).
3. Log in with the correct `ADMIN_PASSWORD` defined in your environment variables.
4. Add a new "Learning Pathway" in the Curriculum tab and click Save.
5. Verify that the pathway successfully syncs to Supabase and persists across page reloads.
