# Firebase / Firestore Setup

1) **Enable Firestore** in your Firebase project (Native mode).
2) **Create a service account key** (Project Settings → Service accounts → Generate key).
3) **Dev (file-based)**:
   - Save JSON to `services/resolver-next/keys/sa.json` and add `keys/` to `.gitignore`.
   - Set `GOOGLE_APPLICATION_CREDENTIALS=./keys/sa.json` in `.env.local`.
4) **Install peer dep**:
   ```bash
   cd services/resolver-next
   npm i @opentelemetry/api
   ```
5) **Run**:
   ```bash
   npm run dev
   ```

### Optional: Emulator
```bash
npm i -g firebase-tools
firebase emulators:start --only firestore
# in another terminal:
export FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
npm run dev
```
