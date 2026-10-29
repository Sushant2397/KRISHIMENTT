# KrishiMent application audit

Date: 2026-10-28

## Scope and evidence

Inspected the React/Vite frontend, Django/DRF backend, Django models/migrations, route declarations, API services, auth context, and current uncommitted frontend/backend changes. This audit used Django's isolated in-memory test database for writes. It did not reset or modify the development SQLite database. No external email, market data, or contact submissions were made.

The browser showed the signup form and its expected initial fields. Attempts to navigate directly to other localhost routes failed in the browser bridge, and shell HTTP probes were blocked by the Windows socket policy. Therefore this report does not claim a complete live browser end-to-end run.

## Project inventory

- Frontend: React 18, TypeScript/JavaScript, Vite, React Router, Axios, Context auth state, Tailwind.
- Backend: Django, Django REST Framework, SimpleJWT, SQLite (`backend/db.sqlite3`), custom `api.CustomUser`.
- Persisted models: custom users, equipment, inquiries, jobs, job applications, labour ratings, skills, earnings, notifications, landmarks and landmark distances, plus a Todo model.
- Auth: username/password login returns JWT access/refresh tokens. The frontend stores tokens and user data in `localStorage` and Axios adds the bearer token.
- Third-party integrations: AGMARK data.gov.in for market prices; inquiry email handling; AI chat route. Their live upstream behavior was not exercised.
- Existing commands: frontend `npm run dev`, `npm run build`, `npm run lint`; backend `python manage.py check`, `python manage.py test`. No frontend test script or E2E suite is configured.

## Route and feature map

| Frontend route/feature | Client and backend route | Persistence / evidence |
|---|---|---|
| `/login`, `/signup`, `/select-role` | `AuthContext` → `POST /api/auth/login/`, `POST /api/auth/register/` | `CustomUser`; prior APIClient probes confirmed valid/bad login and valid/duplicate signup responses. Full browser form submission not run. |
| Farmer dashboard and posted jobs | `jobService` → `/api/jobs/`, detail CRUD, labour count, route | `Job`, `JobApplication`, notifications; farmer list/edit was exercised previously. A nearby labour write/delete bypass was fixed and regression-tested. |
| Job browse, apply, applications | `/api/jobs/nearby/`, `/{id}/apply/`, `/{id}/applications/`, `respond_to_application/`, `/api/job-applications/` | `JobApplication`; role and completion regressions tested. Full two-user browser journey not run. |
| Worker dashboard, availability, skills, earnings, ratings | `/api/auth/me/availability/`, `/api/labour-skills/`, `/api/labour-earnings/`, `/api/labour-ratings/` | Corresponding models exist; endpoints/components were mapped but not fully exercised. |
| Equipment buy/sell and inquiries | `/api/equipment/`, `/api/buy-equipment/`, `/api/inquiries/`, `/api/inquiries/mine/`, notifications | `Equipment`, `Inquiry`, `Notification`; upload and email-provider integration not exercised. |
| Notifications | `/api/notifications/`, `mark_all_read/` | `Notification`; client now uses the shared Axios instance. Live read/write not exercised. |
| Government schemes | `schemeService` uses in-code sample data; no Django route | Not connected to a live source. Entries include old deadlines; treat as demo content. |
| Market prices | AGMARK data.gov.in direct fetch | Third-party key now read from `VITE_AGMARK_API_KEY`; missing configuration and failures are displayed. No upstream request was made. |
| Todo page | `/api/todos/` client calls, but no Todo router/view is registered | Feature is not wired end to end; Django's Todo model alone does not provide an API. |
| General contact form | `ContactModal` has no API endpoint | Form no longer closes as if sent; it tells the user the message was not sent. Backend feature remains unimplemented. |
| AI chat | `/api/ai/chat/` | External/model dependency not exercised. |

## Confirmed defects fixed

- **P1 — job access control:** workers could reach the job viewset's generic update/delete methods for nearby jobs. Non-farmer edits and deletes now return 403; farmer-owned scoping remains in place. Regression test verifies job data remains unchanged.
- **P1 — application status control:** workers could change their own pending application to `accepted`, bypassing farmer review. Status updates now permit only `accepted → completed`; accept/reject decisions remain on the farmer action endpoint. Regression tests cover denied promotion and valid completion/earning creation.
- **P2 — application creation role:** generic application creation did not reject a farmer. Only labour accounts can create applications, and the referenced job must be open. Regression test covers farmer rejection.
- **P2 — Aadhaar privacy:** the demo Aadhaar value was included in the signup payload despite the UI saying verification was simulated. The value is no longer sent to the backend; no Aadhaar verification integration exists.
- **P2 — market API key and error handling:** removed the hard-coded AGMARK key from active code/comments; page reads `VITE_AGMARK_API_KEY`, reports missing configuration/request failures, and polling handles failures without unhandled rejections.
- **P2 — false contact success:** the contact form previously closed without sending anything. It now explicitly reports that it is not connected and that no message was sent.
- Registration/job serializer debug output containing submitted personal/job data was removed. Role signup response handling now matches `AuthContext.register()`'s `{ user }` result. Shared Axios use is consistent for equipment uploads, inquiries, notifications and bearer headers.

## Verification results

- `python manage.py test api.tests -v 2`: **4 passed**, isolated in-memory database; includes authorization and completion/earning behavior.
- `python -m compileall -q api`: passed.
- `python manage.py check`: no errors; one warning remains because configured `backend/static` directory is missing.
- `npm run build`: passed. Vite reports vendor annotation warnings and a ~1.9 MB JS bundle (gzip ~491 KB) over its 500 KB chunk warning threshold.
- Targeted ESLint for `JobUploadPage.tsx`, `ProductForm.tsx`, and `seedPriceService.ts`: passed.
- Full `npm run lint`: failed with **33 errors and 9 warnings**, mostly unused imports/variables, `any` types, and existing UI/template files. No blanket suppression was added.
- Live HTTP/browser end-to-end: blocked by environment loopback policy. The browser displayed signup, but route navigation/API requests could not be verified through the tool. No test account credentials were used or exposed.

## Security notes / remaining work

- **P1 — source credential exposure:** Django settings contained a fixed signing secret and SMTP app password. They were removed from source: Django now reads `DJANGO_SECRET_KEY` and `EMAIL_HOST_PASSWORD`; local DEBUG mode uses a process-local random signing key, while non-debug startup fails closed unless a signing key is configured. No `.env` file or machine environment variable was changed. Previously exposed credentials should be rotated because removing them from the current tree does not remove Git history.
- Backend settings default `DJANGO_DEBUG` to development mode, retain `CORS_ALLOW_ALL_ORIGINS=True`, and leave `ALLOWED_HOSTS` empty. Set production debug/CORS/hosts explicitly before deployment. Production configuration and `.env` were left untouched. The new process-local debug signing key means existing local JWTs expire after a backend restart and the user must sign in again.
- JWTs are stored in `localStorage`, which increases token exposure if an XSS vulnerability is introduced. This audit did not migrate the auth/session model.
- The market key and backend credentials had been present in source history. If active, rotate/revoke them at their providers; removing them from the current working tree does not erase Git history. Provide replacements through local environment configuration, not source control.
- Scheme data and seed-price generator include demo/mock implementations; the schemes page is not a live backend feature. Todo and general contact have no functioning backend route. No claim is made that these are production-ready.
- Ratings, skills, availability, equipment CRUD/upload, notifications, AI chat, email delivery, and external market-price responses still need role-by-role integration tests. Registration/login success paths were probed previously, but the full signup/login/logout browser journey remains unverified.

## Changed files

Frontend design and dashboard progress already present in the working tree: `project/src/components/Common/{DashboardCard,Header,Sidebar}.jsx`, `project/src/components/Layout/MainLayout.jsx`, `project/src/index.css`, `project/tailwind.config.js`, `project/src/pages/{LandingPage,Login,FarmerDashboard,LabourDashboard,JobListingPage,JobUploadPage,MyApplications,MyEarnings,Notifications,WorkerApplications,MarketPrices}.(jsx|tsx)`.

Integration, security, or audit fixes: `backend/backend/settings.py`, `project/src/components/Auth/RoleSelection.jsx`, `project/src/components/Auth/signup/AadhaarVerificationStep.jsx`, `project/src/components/Common/ContactModal.jsx`, `project/src/components/Products/ProductForm.tsx`, `project/src/contexts/AuthContext.jsx`, `project/src/services/{api.js,inquiryService.ts,notificationService.ts,seedPriceService.ts}`, `project/src/pages/Register.jsx`, `project/src/bolt-auth-temp/BoltSignup.jsx`, `backend/api/{serializers.py,tests.py,views/auth_views.py,views/buy_equipment.py,views/job_views.py}`.
