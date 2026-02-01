# Krishiment – Project Workflow & Tech Stack Analysis

## 1. Project Overview

**Krishiment** is a farmer-centric digital platform for small and medium farmers in India. It connects farmers with agricultural labour, provides an equipment marketplace, real-time market prices, government schemes, and route optimization for labour/mandis.

**Core users:** Farmers, Labour (agricultural workers).

---

## 2. Repository Structure

```
projectsjk/
├── backend/                    # Django REST API
│   ├── api/                    # Main app: models, views, serializers, routing
│   │   ├── migrations/         # DB migrations
│   │   ├── views/              # ViewSets & API views (auth, jobs, equipment, AI, etc.)
│   │   ├── models.py           # CustomUser, Job, Equipment, Landmark, etc.
│   │   ├── serializers.py
│   │   ├── urls.py             # API routes
│   │   ├── routing_service.py  # Dijkstra + SLM route optimization
│   │   └── admin.py
│   ├── backend/                # Django project config
│   │   ├── settings.py
│   │   └── urls.py             # /admin/, /api/
│   ├── manage.py
│   ├── .env                    # GEMINI_API_KEY, OPENAI_API_KEY, etc. (gitignored)
│   └── requirements.txt       # python-dotenv
├── project/                    # Frontend (Vite + React)
│   ├── src/
│   │   ├── App.tsx             # Root: AuthProvider, AppRoutes, AIAssistant
│   │   ├── main.tsx            # Entry: i18n, Leaflet, React root
│   │   ├── routes/             # AppRoutes.jsx, PrivateRoute
│   │   ├── contexts/           # AuthContext (user, login, logout)
│   │   ├── pages/              # All screen-level pages
│   │   ├── components/         # Auth, Common, Layout, Products
│   │   ├── services/           # api.js + feature services (job, equipment, ai, etc.)
│   │   ├── locales/            # en, hi, mr (i18n)
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── templates/                  # Email templates (e.g. account)
└── README.md
```

---

## 3. Tech Stack

### 3.1 Frontend (`project/`)

| Category        | Technology |
|----------------|------------|
| **Runtime**    | Node.js, browser |
| **Framework**  | React 18 |
| **Build**     | Vite 5 |
| **Language**   | TypeScript + JavaScript (JSX) |
| **Routing**    | React Router DOM 7 |
| **Styling**    | Tailwind CSS 3, PostCSS |
| **UI Components** | Radix UI (via shadcn-style components in `components/Common/ui/`), Lucide React icons |
| **State**      | React Context (AuthContext), local component state |
| **Data fetching** | Axios (central `api.js`), TanStack React Query |
| **Forms**      | React Hook Form, Zod, @hookform/resolvers |
| **Maps**       | Leaflet, react-leaflet |
| **i18n**       | i18next, react-i18next (en, hi, mr) |
| **Other**      | Framer Motion, class-variance-authority, clsx, tailwind-merge, sonner (toasts) |

### 3.2 Backend (`backend/`)

| Category        | Technology |
|----------------|------------|
| **Runtime**    | Python 3 |
| **Framework**  | Django 4.2 |
| **API**        | Django REST Framework (DRF) |
| **Auth**       | JWT (rest_framework_simplejwt) |
| **Database**   | SQLite (default; MongoDB referenced in .env for possible future use) |
| **CORS**       | django-cors-headers |
| **Env**        | python-dotenv (GEMINI_API_KEY, OPENAI_API_KEY) |

### 3.3 External / Integrations

- **AI Assistant:** Google Gemini API (primary), OpenAI API (fallback) – server-side only.
- **Maps:** OpenStreetMap tiles (Leaflet).
- **Email:** SMTP (Gmail) for transactional emails (e.g. confirmation).

---

## 4. Total Workflow

### 4.1 Authentication Flow

1. **Landing** → User visits `/` → `LandingPage` or redirect to `/dashboard` if already logged in.
2. **Sign up** → `/signup` → `Register` → after success, redirect to `/select-role` → `RoleSelection` (Farmer / Labour) → then to `/dashboard`.
3. **Login** → `/login` → `Login.jsx` → `POST /api/auth/login/` (username + password) → JWT `access`/`refresh` returned → user + tokens stored in `localStorage`; `AuthContext` updates → redirect to `/dashboard`.
4. **Persistence** → On load, `AuthContext` reads `user` and `tokens` from `localStorage`; all API calls use `Authorization: Bearer <access>` via `api.js` interceptor.
5. **Logout** → Clear `localStorage` and context → redirect to login/landing.

### 4.2 Farmer Workflow

1. **Dashboard** → `FarmerDashboard` – cards for Schemes, Equipment Buy/Sell, Worker Applications, Upload Jobs, Market Prices, Notifications.
2. **Government schemes** → `/schemes` → `GovernmentSchemes` (schemeService, schemeService API).
3. **Equipment** → Buy: `/equipment/buy` (`BuySellPage`); Sell: `/equipment/sell` (`SellPage`); Detail: `/equipment/:id` – equipmentService, inquiryService.
4. **Jobs** → Upload: `/upload-jobs` (`JobUploadPage`) – set location, check labour availability (labour_count), optional route optimization; list/applications via jobService.
5. **Labour matching** → On job create, backend finds nearby labours (Haversine), expands radius if needed, sends notifications; farmer sees applications on job and in Notifications.
6. **Worker applications** → Farmer sees applications, accepts/rejects; can rate labour after completion (LabourRating).
7. **Route optimization** → From job upload map, “Get route” to a labour → `GET /api/jobs/route/` → Dijkstra (local) or SLM (long-distance) → waypoints drawn on LeafletMap.

### 4.3 Labour Workflow

1. **Dashboard** → `LabourDashboard` – jobs, applications, skills, earnings, notifications.
2. **Jobs** → `/jobs` (`JobListingPage`) – nearby jobs (jobService) by user location.
3. **Apply** → Apply to job with optional message/contact → `JobApplication` created; farmer can accept/reject.
4. **Applications** → `/my-applications` – status (pending/accepted/rejected/completed).
5. **Skills** → `/skills` – LabourSkill CRUD (skillsService).
6. **Earnings** → `/earnings` – LabourEarning records (earningsService).
7. **Availability** → Toggle `is_available` (auth/availability API).

### 4.4 Equipment Marketplace Flow

1. **Listings** → EquipmentViewSet – list/filter by category, condition; create (seller = user).
2. **Detail** → Equipment detail page – image, description, seller; compare, contact seller (Inquiry).
3. **Inquiries** → InquiryViewSet – buyer sends inquiry → seller gets notification; ContactModal / ContactSellerModal.

### 4.5 Notifications

- **Model:** `Notification` – title, message, optional links to job/equipment/inquiry/job_application.
- **Triggers:** New job (to nearby labours), new inquiry (to seller), application updates (to farmer).
- **UI:** `/notifications` + NotificationViewSet; mark read, list by user.

### 4.6 Route Optimization (Backend + Frontend)

- **Graph:** Nodes = origin (farmer), destination (labour/mandi), nearby labours, landmarks (Landmark model). Edges = Haversine distance + travel time; landmark–landmark from `LandmarkDistance`.
- **Local:** Dijkstra’s algorithm for shortest path (distance + time cost).
- **Long-distance:** Spatial Landmark Model (SLM) – route via nearest landmarks using precomputed `LandmarkDistance`.
- **API:** `GET /api/jobs/route/?from_lat=&from_lon=&to_lat=&to_lon=&to_label=` → waypoints, total_distance_km, total_time_min, algorithm_used.
- **Frontend:** JobUploadPage → “Get route” per labour → route drawn on LeafletMap (polyline).

### 4.7 AI Assistant Flow

- **Visibility:** Only when user is logged in; history cleared when `user.id` changes (new user / logout).
- **Request:** User types message → `POST /api/ai/chat/` with `message` + `history` (JWT required).
- **Backend:** If `GEMINI_API_KEY` set → Google Gemini `gemini-2.5-flash`; else if `OPENAI_API_KEY` set → OpenAI `gpt-3.5-turbo`. Same system prompt (Krishiment agriculture/labour/schemes/equipment/routes).
- **Response:** `{ reply }` shown in floating chat panel (AIAssistant.tsx).

### 4.8 Internationalization (i18n)

- **Locales:** `en`, `hi`, `mr` under `project/src/locales/*/translation.json`.
- **Setup:** `i18n.ts` – i18next + react-i18next + language detector; used across pages/components via `useTranslation()`.

---

## 5. API Surface (Backend)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | `/api/auth/register/` | Register user |
| POST   | `/api/auth/login/` | Login → JWT |
| GET    | `/api/auth/me/availability/` | Get/update labour availability |
| GET    | `/api/equipment/` | List equipment |
| POST   | `/api/equipment/` | Create listing |
| GET/PUT/DELETE | `/api/equipment/:id/` | Equipment CRUD |
| GET    | `/api/equipment/categories/`, `/conditions/` | Metadata |
| GET/POST | `/api/inquiries/` | Inquiries |
| GET    | `/api/notifications/` | Notifications |
| GET/POST | `/api/jobs/` | Jobs (farmer: create/list own; labour: list filtered) |
| GET    | `/api/jobs/nearby/` | Nearby jobs (labour) |
| GET    | `/api/jobs/labour_count/` | Labour count for location + radius |
| GET    | `/api/jobs/route/` | Optimal route (Dijkstra/SLM) |
| POST   | `/api/jobs/:id/apply/` | Apply to job |
| GET    | `/api/jobs/:id/applications/` | List applications |
| POST   | `/api/jobs/:id/respond_to_application/` | Accept/reject |
| GET/POST | `/api/job-applications/` | Job applications |
| GET/POST | `/api/labour-ratings/` | Rate labour |
| GET/POST | `/api/labour-skills/` | Labour skills |
| GET    | `/api/labour-earnings/` | Labour earnings |
| POST   | `/api/ai/chat/` | AI assistant (Gemini/OpenAI) |
| POST   | `/api/buy-equipment/` | Buy equipment (custom view) |

All authenticated endpoints (except login/register) use **JWT** via `Authorization: Bearer <access>`.

---

## 6. Data Models (Backend – Django)

| Model | Purpose |
|-------|---------|
| **CustomUser** | email, phone, role (farmer/labour), address, lat/lon, is_available |
| **Equipment** | title, description, price, category, condition, location, image, seller |
| **Inquiry** | equipment, seller, buyer_name/email/phone, message |
| **Job** | farmer, title, description, category, wage_per_day, duration_days, required_workers, start/end_date, address, lat/lon, radius_km, status |
| **JobApplication** | job, labour, message, contact_name/phone, status (pending/accepted/rejected/completed) |
| **LabourRating** | job_application, farmer, labour, rating, comment |
| **LabourSkill** | labour, skill_name, category, experience_level, etc. |
| **LabourEarning** | job_application, labour, job_title, farmer_name, wage_per_day, days_worked, payment_status, etc. |
| **Notification** | user, title, message, optional equipment/inquiry/job/job_application, buyer snapshot |
| **Landmark** | name, location_type (mandi/warehouse/market), lat/lon, address |
| **LandmarkDistance** | from_landmark, to_landmark, distance_km, travel_time_min |
| **Todo** | Example/template model |

---

## 7. Frontend Services (project/src/services)

- **api.js** – Axios instance, base URL, JWT request interceptor, response error handling.
- **jobService** – jobs CRUD, nearby, labour_count, getOptimalRoute, apply, respond, my applications.
- **equipmentService** – equipment CRUD, categories, conditions.
- **inquiryService** – inquiries.
- **schemeService** – government schemes.
- **seedPriceService** – market/seed prices.
- **notificationService** – notifications.
- **ratingService** – labour ratings.
- **skillsService** – labour skills.
- **earningsService** – labour earnings.
- **userService** – user profile.
- **aiService** – AI chat (`/api/ai/chat/`).

---

## 8. Summary Diagram (Conceptual)

```
[User Browser]
       │
       ▼
[React App (Vite)]  ← AuthContext, AppRoutes, AIAssistant
       │
       ├── Pages: Landing, Login, Register, RoleSelection
       ├── Farmer: Dashboard, Upload Jobs, Equipment Sell, Schemes, Market Prices, Worker Applications, Notifications
       ├── Labour: Dashboard, Job List, My Applications, Skills, Earnings, Notifications
       ├── Shared: Equipment Buy/Detail, Notifications, AI Assistant (floating)
       │
       ▼
[Axios → JWT]
       │
       ▼
[Django REST API]
       │
       ├── Auth (JWT) → CustomUser
       ├── Jobs → Job, JobApplication, labour_count, route (Dijkstra/SLM)
       ├── Equipment → Equipment, Inquiry
       ├── Notifications, Ratings, Skills, Earnings
       ├── Landmarks → Route optimization (SLM)
       └── AI → Gemini / OpenAI (server-side)
       │
       ▼
[SQLite DB]
```

This document reflects the current codebase and gives a single reference for the **total workflow** and **tech stack** of the Krishiment project.
