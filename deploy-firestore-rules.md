# Deploy Firestore Rules

## Step 1: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase
```bash
firebase login
```

## Step 3: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## What the Updated Rules Do:

### 🔒 **User Isolation**
- **Users Collection**: Users can only access their own profile data
- **Workspaces**: Users can only access workspaces they own or are members of
- **Projects**: Users can only access projects in their workspaces
- **API Keys**: Users can only access their own API keys
- **Team Members**: Users can only access members in their workspaces
- **Sources**: Users can only access sources in their workspaces
- **Chat Messages**: Users can only access messages in their workspaces
- **Progress Goals**: Users can only access their own goals
- **Activities**: Users can only access activities in their workspaces

### 🆕 **New User Experience**
- New users get a completely fresh, empty workspace
- Each user starts with their own isolated environment
- No shared data between different user accounts

### 🛡️ **Security Benefits**
- Prevents users from accessing other users' data
- Enforces proper data boundaries
- Maintains privacy and security

## Testing the Rules:

1. **Sign in with your account** - You should see all your existing data
2. **Sign in with a different account** - You should see a completely empty workspace
3. **Try to access data from another user** - Should be denied by Firestore rules

## Important Notes:

- **Existing Users**: Your account will continue to work as before
- **New Users**: Will start with completely fresh, empty workspaces
- **Data Migration**: No existing data will be lost
- **Backup**: Consider backing up your data before deploying

## Rollback (if needed):
```bash
git checkout HEAD~1 firestore.rules
firebase deploy --only firestore:rules
```
