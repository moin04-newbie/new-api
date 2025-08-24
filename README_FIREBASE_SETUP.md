Firebase setup

Create a Firebase project and enable Auth (Email/Password and Google) and Firestore.

Create `.env.local` in the project root and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Collections expected:
- projects: name, description, team, members (number), apiKeys (number), status, createdAt, lastActivity
- members: name, email, role, avatar, joinedAt, lastActive, projects (array of projectIds)
- apiKeys: name, description, key, project, projectId, status, createdAt, lastUsed, expiresAt, requests (number), environment

Run the app:

```
pnpm dev
```

