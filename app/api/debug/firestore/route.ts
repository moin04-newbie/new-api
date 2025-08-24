import { NextResponse } from "next/server"
import { fetchProjects, fetchMembers, fetchApiKeys } from "@/lib/firestore"

export async function GET() {
  try {
    const [projects, members, apiKeys] = await Promise.all([
      fetchProjects(),
      fetchMembers(),
      fetchApiKeys(),
    ])

    return NextResponse.json({
      ok: true,
      counts: {
        projects: projects.length,
        members: members.length,
        apiKeys: apiKeys.length,
      },
      sample: {
        project: projects[0] || null,
        member: members[0] || null,
        apiKey: apiKeys[0] || null,
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 },
    )
  }
}


