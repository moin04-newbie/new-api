import { db, auth } from "./firebase"
import {
	collection,
	getDocs,
	getDoc,
	query,
	where,
	orderBy,
	limit,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    Timestamp,
    
} from "firebase/firestore"

export type Project = {
	id: string
	name: string
	description?: string
	team?: string
	members?: number
	apiKeys?: number
	status?: string
	createdAt?: string
	lastActivity?: string
	ownerId?: string
}

export type Member = {
	id: string
	name: string
	email: string
	role: string
	avatar?: string
	joinedAt?: string
	lastActive?: string
	projects?: string[]
	ownerId?: string
}

export type ApiKey = {
	id: string
	name: string
	description?: string
	key: string
	project?: string
	projectId?: string
	userId?: string
	status?: string
	createdAt?: string
	lastUsed?: string
	expiresAt?: string
	requests?: number
	environment?: string
    serviceName?: string
    website?: string
    docsUrl?: string
    monthlyLimit?: number
    monthlyCost?: number
    tags?: string[]
}

function toIso(value: unknown): string | undefined {
    if (!value) return undefined
    if (typeof value === "string") return value
    // Firestore Timestamp
    if (value instanceof Timestamp) return value.toDate().toISOString()
    if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
        const ms = (value.seconds as number) * 1000 + Math.floor((value.nanoseconds as number) / 1e6)
        return new Date(ms).toISOString()
    }
    if (value instanceof Date) return value.toISOString()
    return String(value)
}

function normalizeProject(data: Record<string, unknown>): Project {
    const d = data as Record<string, any>
    return {
        id: String(d.id),
        name: String(d.name),
        description: typeof d.description === "string" ? d.description : undefined,
        team: typeof d.team === "string" ? d.team : undefined,
        members: typeof d.members === "number" ? d.members : undefined,
        apiKeys: typeof d.apiKeys === "number" ? d.apiKeys : undefined,
        status: typeof d.status === "string" ? d.status : undefined,
        createdAt: toIso(d.createdAt),
        lastActivity: toIso(d.lastActivity),
        ownerId: typeof d.ownerId === "string" ? d.ownerId : undefined,
    }
}

function normalizeMember(data: Record<string, unknown>): Member {
    const d = data as Record<string, any>
    return {
        id: String(d.id),
        name: String(d.name),
        email: String(d.email),
        role: String(d.role),
        avatar: typeof d.avatar === "string" ? d.avatar : undefined,
        joinedAt: toIso(d.joinedAt),
        lastActive: toIso(d.lastActive),
        projects: Array.isArray(d.projects) ? (d.projects as string[]) : [],
        ownerId: typeof d.ownerId === "string" ? d.ownerId : undefined,
    }
}

function normalizeApiKey(data: Record<string, unknown>): ApiKey {
    const d = data as Record<string, any>
    return {
        id: String(d.id),
        name: String(d.name),
        description: typeof d.description === "string" ? d.description : undefined,
        key: String(d.key),
        project: typeof d.project === "string" ? d.project : undefined,
        projectId: typeof d.projectId === "string" ? d.projectId : undefined,
        userId: typeof d.userId === "string" ? d.userId : undefined,
        status: typeof d.status === "string" ? d.status : undefined,
        createdAt: toIso(d.createdAt),
        lastUsed: toIso(d.lastUsed),
        expiresAt: toIso(d.expiresAt),
        requests: typeof d.requests === "number" ? d.requests : undefined,
        environment: typeof d.environment === "string" ? d.environment : undefined,
        serviceName: typeof d.serviceName === "string" ? d.serviceName : undefined,
        website: typeof d.website === "string" ? d.website : undefined,
        docsUrl: typeof d.docsUrl === "string" ? d.docsUrl : undefined,
        monthlyLimit: typeof d.monthlyLimit === "number" ? d.monthlyLimit : undefined,
        monthlyCost: typeof d.monthlyCost === "number" ? d.monthlyCost : undefined,
        tags: Array.isArray(d.tags) ? (d.tags as string[]) : undefined,
    }
}

export async function fetchProjects(): Promise<Project[]> {
	const base = collection(db, "projects")
	const currentUserId = typeof window !== "undefined" ? auth.currentUser?.uid : undefined
	// If the user is not yet known on the client, avoid returning other users' data.
	if (!currentUserId) return []
	const q = query(base, where("ownerId", "==", currentUserId), orderBy("name"))
	const snapshot = await getDocs(q)
	return snapshot.docs.map((d) => normalizeProject({ id: d.id, ...(d.data() as Record<string, unknown>) }))
}

export async function createProject(input: { name: string; description?: string; team?: string }) {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(db, "projects"), {
        name: input.name,
        description: input.description || "",
        team: input.team || "",
        members: 0,
        apiKeys: 0,
        status: "active",
        createdAt: now,
        lastActivity: now,
        ownerId: typeof window !== "undefined" ? auth.currentUser?.uid || "" : "",
    })
    return ref.id
}

export async function getProject(id: string): Promise<Project | null> {
    const snapshot = await getDoc(doc(db, "projects", id))
    if (!snapshot.exists()) return null
    return normalizeProject({ id: snapshot.id, ...(snapshot.data() as Record<string, unknown>) })
}

export async function deleteProject(id: string) {
    // Cascade delete API keys that belong to this project for the current user
    try {
        const currentUserId = typeof window !== "undefined" ? auth.currentUser?.uid : undefined
        const base = collection(db, "apiKeys")
        let q = query(base, where("projectId", "==", id))
        if (currentUserId) {
            q = query(base, where("projectId", "==", id), where("userId", "==", currentUserId))
        }
        const snapshot = await getDocs(q)
        await Promise.all(snapshot.docs.map((d) => deleteDoc(doc(db, "apiKeys", d.id))))
    } catch {
        // Ignore cascading delete errors; primary delete still proceeds
    }
    await deleteDoc(doc(db, "projects", id))
}

export async function getMember(id: string): Promise<Member | null> {
    const snapshot = await getDoc(doc(db, "teamMembers", id))
    if (!snapshot.exists()) return null
    return normalizeMember({ id: snapshot.id, ...(snapshot.data() as Record<string, unknown>) })
}

export async function deleteMember(id: string) {
    await deleteDoc(doc(db, "teamMembers", id))
}

export async function updateMemberRole(id: string, role: string) {
    await updateDoc(doc(db, "teamMembers", id), { role })
}

export async function fetchMembers(projectId?: string): Promise<Member[]> {
	const base = collection(db, "teamMembers")
	const currentUserId = typeof window !== "undefined" ? auth.currentUser?.uid : undefined
	let qRef: ReturnType<typeof query>
	if (projectId && currentUserId) {
		qRef = query(base, where("projects", "array-contains", projectId), where("ownerId", "==", currentUserId))
	} else if (currentUserId) {
		qRef = query(base, where("ownerId", "==", currentUserId))
	} else if (projectId) {
		qRef = query(base, where("projects", "array-contains", projectId))
	} else {
		qRef = query(base)
	}
	const snapshot = await getDocs(qRef)
	return snapshot.docs.map((d) => normalizeMember({ id: d.id, ...(d.data() as Record<string, unknown>) }))
}

export async function fetchApiKeys(input?: { projectId?: string; userId?: string } | string): Promise<ApiKey[]> {
	const base = collection(db, "apiKeys")
	let projectId: string | undefined
	let userId: string | undefined

	if (typeof input === "string") {
		projectId = input
	} else if (input) {
		projectId = input.projectId
		userId = input.userId
	}

	// Default to current authenticated user if available
	if (!userId && typeof window !== "undefined") {
		userId = auth.currentUser?.uid || undefined
	}

	let qRef: ReturnType<typeof query>
	if (projectId && userId) {
		qRef = query(base, where("projectId", "==", projectId), where("userId", "==", userId))
	} else if (userId) {
		qRef = query(base, where("userId", "==", userId))
	} else if (projectId) {
		qRef = query(base, where("projectId", "==", projectId))
	} else {
		qRef = query(base)
	}

	const snapshot = await getDocs(qRef)
	return snapshot.docs.map((d) => normalizeApiKey({ id: d.id, ...(d.data() as Record<string, unknown>) }))
}

export async function createApiKey(input: {
    name: string
    serviceName?: string
    description?: string
    key: string
    project?: string
    projectId?: string
    userId?: string
    environment?: string
    status?: string
    expiresAt?: string
    website?: string
    docsUrl?: string
    monthlyLimit?: number
    monthlyCost?: number
    tags?: string[]
}) {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(db, "apiKeys"), {
        name: input.name,
        serviceName: input.serviceName || "",
        description: input.description || "",
        key: input.key,
        project: input.project || "",
        projectId: input.projectId || "",
        userId: input.userId || (typeof window !== "undefined" ? auth.currentUser?.uid || "" : ""),
        createdBy: typeof window !== "undefined" ? auth.currentUser?.uid || "" : "",
        uid: typeof window !== "undefined" ? auth.currentUser?.uid || "" : "",
        workspaceId: "", // Will be set by the workspace context
        status: input.status || "active",
        createdAt: now,
        lastUsed: now,
        expiresAt: input.expiresAt || "",
        requests: 0,
        environment: input.environment || "development",
        website: input.website || "",
        docsUrl: input.docsUrl || "",
        monthlyLimit: typeof input.monthlyLimit === "number" ? input.monthlyLimit : 0,
        monthlyCost: typeof input.monthlyCost === "number" ? input.monthlyCost : 0,
        tags: Array.isArray(input.tags) ? input.tags : [],
    })
    return ref.id
}

export async function deleteApiKey(id: string) {
    await deleteDoc(doc(db, "apiKeys", id))
}

export async function fetchMembersPreview(limitCount = 4): Promise<Member[]> {
	const base = collection(db, "teamMembers")
	const currentUserId = typeof window !== "undefined" ? auth.currentUser?.uid : undefined
	if (!currentUserId) return []
	const q = query(base, where("ownerId", "==", currentUserId), orderBy("name"), limit(limitCount))
	const snapshot = await getDocs(q)
	return snapshot.docs.map((d) => normalizeMember({ id: d.id, ...(d.data() as Record<string, unknown>) }))
}

export async function addMember(input: { name?: string; email: string; role: string; projects?: string[] }) {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(db, "teamMembers"), {
        name: input.name || input.email.split("@")[0],
        email: input.email,
        role: input.role,
        avatar: "",
        joinedAt: now,
        lastActive: "just now",
        projects: input.projects || [],
        ownerId: typeof window !== "undefined" ? auth.currentUser?.uid || "" : "",
    })
    return ref.id
}


