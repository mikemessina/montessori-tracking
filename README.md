# Montessori Tracking

An offline-capable classroom progress tracker for Montessori teachers. The app
tracks children, curriculum areas, lessons, lesson status history, observations,
and the teacher who recorded each update.

## Technology

- React, TypeScript, and Vite
- Firebase Authentication (email/password)
- Cloud Firestore with persistent offline cache and real-time synchronization
- Vitest and Oxlint

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy `.env.example` to `.env.local` and enter the Firebase web app config.

3. In Firebase Console, enable **Authentication > Sign-in method >
   Email/Password**.

4. Create teacher accounts under **Authentication > Users**. Public account
   creation is intentionally not exposed by the app.

5. Publish `firestore.rules` through **Firestore Database > Rules**.

6. Start the app:

   ```powershell
   npm run dev
   ```

## Validation

```powershell
npm run build
npm run lint
npm test
node scripts/verify-firestore.mjs
```

The Firestore verification script confirms that unauthenticated requests are
rejected by the deployed rules.

## Teacher access

All authenticated teacher accounts currently share the same classroom data.
To add or remove a teacher, manage users in Firebase Console. Firestore access
is denied to signed-out users.

Because the app supports offline use, Firestore caches classroom data on the
device. Use only school-controlled or otherwise trusted devices, and protect
each device with a passcode.
