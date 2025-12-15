# Copilot / AI agent instructions — Document Analysis App

This file gives concise, actionable guidance for AI coding agents working on this Angular 17 SPA.

1) Big picture
- Architecture: Angular 17 single-page app. Core pieces:
  - Routing + bootstrap: [src/app/app.module.ts](src/app/app.module.ts)
  - Authentication & core pages: [src/app/core](src/app/core)
  - Feature area: `document-analysis` module with upload + view: [src/app/features/document-analysis](src/app/features/document-analysis)
  - Services: API/business logic lives in [src/app/services](src/app/services)
  - Mock API: development HTTP mock lives in [src/app/interceptors/mock.interceptor.ts](src/app/interceptors/mock.interceptor.ts)

2) Data flow & service boundaries
- API surface uses `/api/` prefixes. Services call these endpoints:
  - `/api/auth/*` for login/profile ([AuthService in src/app/services/api.service.ts](src/app/services/api.service.ts)).
  - `/api/documents`, `/api/documents/upload`, `/api/documents/{id}/analyze` handled by the mock interceptor when enabled.
- `DocumentService` owns document state (signals) and provides methods: `uploadDocument`, `analyzeDocument`, `setCurrentDocument` — see [src/app/services/document.service.ts](src/app/services/document.service.ts).
- UI components use signals/computed values (not RxJS Subjects directly). Examples: `DocumentViewComponent` and `DocumentUploadComponent` under the feature folder.

3) Important patterns & conventions (project-specific)
- State: The codebase prefers Angular `signal` + `computed` (see `document.service.ts` and `api.service.ts`) and exposes read-only signals (`asReadonly()`). Return signals or use `toObservable` in AuthService when needed.
- Interceptors order matters: `AuthInterceptor`, `LoadingInterceptor`, then `MockInterceptor` are provided in `AppModule` — mock responses will short-circuit API calls when `environment.useMockApi` is true.
- File uploads use `FormData` with keys `file`, `fileName`, `fileSize`, `fileType` (see `uploadDocument` in `DocumentService`).
- Tests: spec files live next to their implementation (e.g., `auth.service.spec.ts`, `document.service.spec.ts`). Use `ng test --include='**/file.spec.ts'` for targeted runs (see README).

4) Dev & debug workflows (commands discovered in README)
- Install: `npm i`
- Serve: `ng s` (development server)
- Run all tests: `npm test` (or `ng test`)
- Run a single test: `ng test --include='**/auth.service.spec.ts'`
- Use the mock API by setting `environment.useMockApi` in [src/environments/environment.ts](src/environments/environment.ts).

5) Files to inspect first for most tasks
- App bootstrap & providers: [src/app/app.module.ts](src/app/app.module.ts)
- Auth logic and cookie handling: [src/app/services/api.service.ts](src/app/services/api.service.ts)
- Document business logic: [src/app/services/document.service.ts](src/app/services/document.service.ts)
- Mock API endpoints & example payloads: [src/app/interceptors/mock.interceptor.ts](src/app/interceptors/mock.interceptor.ts)
- Mock data samples: [src/assets/mock-data/documents.json](src/assets/mock-data/documents.json) and [src/assets/mock-data/users.json](src/assets/mock-data/users.json)
- Feature entry: [src/app/features/document-analysis/document-analysis.module.ts](src/app/features/document-analysis/document-analysis.module.ts)

6) Typical change patterns & examples
- Adding new API flows: update mock endpoints in `mock.interceptor.ts` (add to `initializeMockEndpoints()`), and mirror changes in `DocumentService` with new methods that call `/api/...`.
- To add UI controls, follow existing structure: component (TS/HTML/SCSS) under the feature folder, wire to service methods and use `MatSnackBar` for feedback (see `document-upload.component.ts`).

7) Safety checks & common pitfalls
- Mock interceptor blocks network calls when `environment.useMockApi` is true and the URL contains `/api/` — tests or runtime issues often come from this setting.
- Auth token is stored in a cookie key (see `AUTH_TOKEN_KEY` in `api.service.ts`), not localStorage. Interceptor attaches `Authorization` header only for `/api/` URLs.
- Signals vs Observables: components use `computed(() => service.signal())` patterns; avoid converting signals back into Subjects unless necessary.

8) When to ask the human
- If an endpoint shape is required but not present in `mock.interceptor.ts` or `assets/mock-data`, ask for backend contract or example response.

If any part of this is unclear or you'd like me to include more code examples or line-linked citations, tell me which area to expand. I can iterate.
