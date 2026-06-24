# Frontend Implementation Plan

This plan is based on the existing frontend setup and the current Django backend API.

## Current frontend status

- React + Vite app already initialized
- Tailwind CSS configured and imported in `src/index.css`
- Axios installed
- React Router DOM installed
- Redux Toolkit installed
- React Redux installed
- React Hook Form installed
- Current `src/App.jsx` is a placeholder and routing is not implemented yet

## Recommended folder structure

Keep the current `src/` root, then add these folders and files:

- `src/`
  - `api/`
    - `axios.js` (central axios instance)
    - `authApi.js`
    - `clientsApi.js`
    - `projectsApi.js`
    - `tasksApi.js`
    - `attachmentsApi.js`
  - `app/`
    - `store.js` (Redux store configuration)
  - `features/`
    - `auth/`
      - `authSlice.js`
      - `authActions.js` or `authThunks.js`
      - `LoginPage.jsx`
      - `RegisterPage.jsx`
    - `dashboard/`
      - `DashboardPage.jsx`
      - `dashboardSlice.js` (optional summary-derived state)
    - `clients/`
      - `clientsSlice.js`
      - `ClientsPage.jsx`
      - `ClientDetailPage.jsx`
      - `ClientForm.jsx`
    - `projects/`
      - `projectsSlice.js`
      - `ProjectsPage.jsx`
      - `ProjectDetailPage.jsx`
      - `ProjectForm.jsx`
    - `tasks/`
      - `tasksSlice.js`
      - `TasksPage.jsx`
      - `TaskDetailPage.jsx`
      - `TaskForm.jsx`
    - `attachments/`
      - `attachmentsSlice.js`
      - `AttachmentsPage.jsx`
      - `AttachmentForm.jsx`
  - `components/`
    - `layout/`
      - `AppLayout.jsx`
      - `PrivateRoute.jsx` or `RequireAuth.jsx`
    - `ui/`
      - `Button.jsx`
      - `Input.jsx`
      - `Select.jsx`
      - `Table.jsx`
      - `Modal.jsx`
  - `hooks/`
    - `useAuth.js`
    - `useAxiosPrivate.js`
  - `pages/`
    - `NotFoundPage.jsx`
    - `UnauthorizedPage.jsx`
  - `utils/`
    - `constants.js`
    - `validators.js`
    - `formatting.js`
  - `App.jsx`
  - `main.jsx`
  - `index.css`

## Routing structure

Use React Router v7 with a protected layout for authenticated pages.

### Route map

- `/login` → `LoginPage`
- `/register` → `RegisterPage`
- `/` → redirect to `/dashboard` when authenticated
- `/dashboard` → `DashboardPage`
- `/clients` → `ClientsPage`
- `/clients/:clientId` → `ClientDetailPage`
- `/projects` → `ProjectsPage`
- `/projects/:projectId` → `ProjectDetailPage`
- `/tasks` → `TasksPage`
- `/tasks/:taskId` → `TaskDetailPage`
- `/tasks/:taskId/attachments` → `AttachmentsPage`
- `*` → `NotFoundPage`

### Route layering

- Public routes: `/login`, `/register`
- Private routes: `/dashboard`, `/clients`, `/projects`, `/tasks`, `/attachments`
- Use a wrapper like `RequireAuth` to check auth state and redirect to `/login`
- Keep layout components for header, sidebar, and page content in `components/layout`

## Redux architecture

Use Redux Toolkit with slices and async thunks. Prefer `createEntityAdapter` for normalized resource state.

### Store setup

- `app/store.js`
  - configure store with these slices:
    - `authSlice`
    - `clientsSlice`
    - `projectsSlice`
    - `tasksSlice`
    - `attachmentsSlice`

### Slice responsibilities

- `authSlice`
  - state: `user`, `accessToken`, `refreshToken`, `status`, `error`
  - actions: `login`, `register`, `refreshToken`, `logout`, `setCredentials`
  - thunks: `loginAsync`, `registerAsync`, `refreshTokenAsync`, `fetchCurrentUser`

- `clientsSlice`
  - state: `entities`, `ids`, `status`, `error`, `search`, `ordering`
  - thunks: `fetchClients`, `createClient`, `updateClient`, `deleteClient`, `fetchClientById`

- `projectsSlice`
  - state: `entities`, `ids`, `status`, `error`, `clientFilter`, `search`, `ordering`
  - thunks: `fetchProjects`, `createProject`, `updateProject`, `deleteProject`, `fetchProjectById`

- `tasksSlice`
  - state: `entities`, `ids`, `status`, `error`, `filters`, `search`, `ordering`
  - thunks: `fetchTasks`, `createTask`, `updateTask`, `deleteTask`, `fetchTaskById`

- `attachmentsSlice`
  - state: `entities`, `ids`, `status`, `error`
  - thunks: `fetchAttachments`, `uploadAttachment`, `deleteAttachment`, `fetchAttachmentById`

### Data flow

- Use selectors to derive lists and filtered views.
- Keep resource loading state separate from auth state.
- Use slices to manage form-related metadata only when needed.

## Authentication flow

### Login/register

1. `LoginPage` sends `POST /auth/token/`.
2. On success store `access` and `refresh` tokens in Redux state and localStorage.
3. Immediately call `GET /auth/me/` to populate `user`.
4. `RegisterPage` sends `POST /auth/register/`, then optionally redirects to login or auto-login.

### Persisting auth

- On app start, read tokens from `localStorage`.
- If tokens exist, dispatch a refresh or `fetchCurrentUser` to validate.
- If validation fails, clear storage and redirect to `/login`.

### Token refresh

- Store refresh token persistently; keep access token in Redux and optionally localStorage.
- Use refresh token to call `/auth/token/refresh/` before access expiry.
- After refresh, update stored access token and retry the failed request.
- On refresh failure, logout the user and clear stored tokens.

### Logout

- Clear `auth` state and localStorage entries.
- Redirect to `/login`.

## Axios interceptor strategy

### Axios instances

- `api/axios.js` should export a configured base instance.
- Use `VITE_API_BASE_URL` from `.env` with fallback `http://localhost:8000`.
- Create a separate plain `axios` or `authAxios` for auth endpoints to avoid refresh logic loops.

### Request interceptor

- Attach `Authorization: Bearer <accessToken>` when access token exists.
- Ensure auth headers are not added for `/auth/token/` and `/auth/token/refresh/`.

### Response interceptor

- Catch 401 responses for protected requests.
- Attempt a single refresh via `/auth/token/refresh/` using the stored refresh token.
- If refresh succeeds, update auth state and retry the original request.
- If refresh fails or refresh token missing, dispatch logout.

### Error handling

- Normalize API errors in each slice.
- Capture validation errors from create/update responses.
- Show user-facing feedback in forms and page alerts.

## Module breakdown

### Auth module

- Pages: `LoginPage`, `RegisterPage`
- Forms: `LoginForm`, `RegisterForm`
- Slice: `authSlice`
- API: `authApi.js`
- Components: `RequireAuth`, `AuthLayout`
- Behavior: token-based auth, route guard, user session persistence

### Dashboard module

- Page: `DashboardPage`
- Display summary cards for `clients`, `projects`, `tasks`
- Use slices to compute counts and recent items
- Provide quick navigation to clients, projects, and task lists

### Clients module

- Pages: `ClientsPage`, `ClientDetailPage`
- Form: `ClientForm`
- Features:
  - list clients
  - search by `name`, `email`, `phone`
  - sort by `name`
  - create/update/delete clients
- API: `GET /clients/`, `POST /clients/`, `PUT/PATCH /clients/{id}/`, `DELETE /clients/{id}/`

### Projects module

- Pages: `ProjectsPage`, `ProjectDetailPage`
- Form: `ProjectForm`
- Features:
  - list projects
  - filter by client via `client` query param
  - search by `title` and `description`
  - sort by `title`
  - assign project to authenticated user's client
- API: `GET /projects/`, `POST /projects/`, `PUT/PATCH /projects/{id}/`, `DELETE /projects/{id}/`

### Tasks module

- Pages: `TasksPage`, `TaskDetailPage`
- Form: `TaskForm`
- Features:
  - list tasks under `/tasks/list/`
  - filter by `status` and `priority`
  - search by `title` and `description`
  - sort by `title`, `status`, `priority`
  - assign tasks to authenticated user's project
- API: `GET /tasks/list/`, `POST /tasks/list/`, `PUT/PATCH /tasks/list/{id}/`, `DELETE /tasks/list/{id}/`

### Attachments module

- Pages: `AttachmentsPage`
- Form: `AttachmentForm`
- Features:
  - list attachments for the user-owned tasks
  - upload files for a task using multipart/form-data
  - delete attachments
  - optionally show attachments inside task detail views
- API: `GET /tasks/attachments/`, `POST /tasks/attachments/`, `DELETE /tasks/attachments/{id}/`

## Notes on implementation

- Backend data is scoped to the authenticated user, so all list requests should use the current auth context.
- Project creation requires a valid `client` ID from the current user.
- Task creation requires a valid `project` ID from the current user.
- File upload must be implemented with form-data and the `file` field.
- DRF pagination is enabled, so list pages should respect `limit`/`offset` and load more or paging controls.
- Keep UI state decoupled from API state; use slices and selectors to avoid unnecessary refetches.

## Recommended next steps

1. Add routing and layout structure in `App.jsx`.
2. Configure `app/store.js` and `src/api/axios.js`.
3. Implement the auth slice and login/register flows.
4. Build clients, projects, and tasks pages with API integration.
5. Add attachments upload support and task detail attachment views.
