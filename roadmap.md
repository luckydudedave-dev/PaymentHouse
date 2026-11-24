# PaymentHouse roadmap

Backend: Firebase only (Auth, Firestore, Cloud Functions, Storage). No Lovable Cloud.

- [x] Step 1 — Design system, logo, public website (13 pages), live CoinGecko ticker
- [x] Step 1 — Login / Register / Forgot password pages wired to Firebase Auth (inactive until config added)
- [ ] Step 2 — Connect Firebase project (needs the user's Firebase web config) — blocked on user
- [ ] Step 2 — Auth state, user/admin roles via custom claims, protected /dashboard and /admin, login activity logging, KYC upload
- [ ] Step 3 — User dashboard: overview, deposit (crypto + US bank), send, withdraw, history (filters/CSV), portfolio, settings, support
- [ ] Step 4 — Admin dashboard: overview, users + user detail tabs, deposit/withdrawal review, transactions, audit logs, settings, sub-admins
- [ ] Step 5 — functions/ (Cloud Functions with Zod), firestore.rules, storage.rules, firestore.indexes.json, seed + first-admin scripts, setup guide
