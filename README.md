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

## Deploy to Firebase Hosting

Build and deploy the PWA:

```powershell
npm run build
npx firebase-tools deploy --only hosting
```

The default production URL is:

```text
https://montessori-tracking.web.app
```

On iPad, open the production URL in Safari, choose **Share**, then
**Add to Home Screen**. The app shell is cached for offline launches, while
Firestore maintains its own persistent offline cache for classroom data.

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
Public account creation is intentionally unavailable in the app. A Firebase
project administrator must create each teacher login.

### Add a teacher login

1. Open the
   [Firebase Authentication users page](https://console.firebase.google.com/project/montessori-tracking/authentication/users).
2. Sign in with an account that can administer the `montessori-tracking`
   Firebase project.
3. Select **Authentication > Users**.
4. Click **Add user**.
5. Enter the teacher's email address and an initial password of at least six
   characters.
6. Click **Add user**.
7. Give the teacher the production app URL and initial password using a secure
   method:

   ```text
   https://montessori-tracking.web.app
   ```

8. Have the teacher sign in on their device. On iPad, they can then choose
   **Share > Add to Home Screen**.

The new teacher immediately has access to the same classroom roster, lesson
catalog, progress records, and observations as every other authenticated
teacher.

### Reset or revoke teacher access

- To reset a password, open **Authentication > Users**, locate the teacher,
  open the user's action menu, and choose the password-reset option.
- To revoke access, delete or disable the teacher's account in Firebase
  Authentication. A deleted or disabled account can no longer obtain valid
  credentials for Firestore.
- Removing an account does not delete classroom records previously entered by
  that teacher.

Firestore access is denied to signed-out users.

Because the app supports offline use, Firestore caches classroom data on the
device. Use only school-controlled or otherwise trusted devices, and protect
each device with a passcode.
