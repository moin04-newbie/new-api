import { db, auth } from './firebase'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: string
  updatedAt: string
  isNewUser: boolean
  defaultWorkspaceId?: string
}

export interface UserWorkspace {
  id: string
  name: string
  description: string
  slug: string
  createdAt: string
  updatedAt: string
  createdBy: string
  members: Array<{
    userId: string
    role: 'admin' | 'member' | 'viewer'
    joinedAt: string
    permissions: string[]
  }>
  settings: {
    allowGuestAccess: boolean
    defaultProjectVisibility: 'private' | 'public'
    requireApprovalForProjects: boolean
  }
}

// Create or update user profile
export async function createOrUpdateUserProfile(userData: Partial<UserProfile>): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  const userRef = doc(db, 'users', auth.currentUser.uid)
  const userDoc = await getDoc(userRef)

  if (userDoc.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    })
  } else {
    // Create new user
    const newUser: UserProfile = {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email || '',
      displayName: auth.currentUser.displayName || undefined,
      photoURL: auth.currentUser.photoURL || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewUser: true,
      ...userData
    }
    await setDoc(userRef, newUser)
  }
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile | null> {
  if (!auth.currentUser) {
    return null
  }

  const userRef = doc(db, 'users', auth.currentUser.uid)
  const userDoc = await getDoc(userRef)

  if (userDoc.exists()) {
    return userDoc.data() as UserProfile
  }
  return null
}

// Create default workspace for new user
export async function createDefaultWorkspace(): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  console.log('Creating default workspace for user:', auth.currentUser.uid)

  const userProfile = await getUserProfile()
  if (!userProfile) {
    throw new Error('User profile not found')
  }

  // Create default workspace
  const workspaceData: Omit<UserWorkspace, 'id'> = {
    name: 'My Workspace',
    description: 'Your personal workspace for managing projects and API keys',
    slug: 'my-workspace',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: auth.currentUser.uid,
    members: [
      {
        userId: auth.currentUser.uid,
        role: 'admin',
        joinedAt: new Date().toISOString(),
        permissions: ['*']
      }
    ],
    settings: {
      allowGuestAccess: false,
      defaultProjectVisibility: 'private',
      requireApprovalForProjects: false
    }
  }

  console.log('Workspace data to create:', workspaceData)

  const workspaceRef = await addDoc(collection(db, 'workspaces'), workspaceData)
  console.log('Default workspace created with ID:', workspaceRef.id)
  
  // Update user profile with default workspace
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    defaultWorkspaceId: workspaceRef.id,
    isNewUser: false,
    updatedAt: new Date().toISOString()
  })
  console.log('User profile updated with default workspace')

  return workspaceRef.id
}

// Get user's workspaces
export async function getUserWorkspaces(): Promise<UserWorkspace[]> {
  if (!auth.currentUser) {
    console.log('getUserWorkspaces: No authenticated user')
    return []
  }

  console.log('getUserWorkspaces: Querying workspaces for user:', auth.currentUser.uid)

  const workspacesRef = collection(db, 'workspaces')
  const q = query(
    workspacesRef,
    where('createdBy', '==', auth.currentUser.uid)
  )

  const snapshot = await getDocs(q)
  console.log('getUserWorkspaces: Found workspaces:', snapshot.docs.length)
  
  const workspaces = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UserWorkspace[]
  
  console.log('getUserWorkspaces: Workspaces data:', workspaces)
  return workspaces
}

// Check if user is new (first time signing in)
export async function isNewUser(): Promise<boolean> {
  const userProfile = await getUserProfile()
  return userProfile?.isNewUser ?? true
}

// Initialize new user with default data
export async function initializeNewUser(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  const userProfile = await getUserProfile()
  if (userProfile && !userProfile.isNewUser) {
    return // User already initialized
  }

  // Create user profile if it doesn't exist
  if (!userProfile) {
    await createOrUpdateUserProfile({
      uid: auth.currentUser.uid,
      email: auth.currentUser.email || '',
      displayName: auth.currentUser.displayName || undefined,
      photoURL: auth.currentUser.photoURL || undefined
    })
  }

  // Create default workspace
  await createDefaultWorkspace()
}
