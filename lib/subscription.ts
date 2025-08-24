export type Plan = "free" | "pro"

const PLAN_KEY = "keynest_plan"

export function getPlan(): Plan {
  if (typeof window === "undefined") return "free"
  const v = localStorage.getItem(PLAN_KEY)
  return v === "pro" ? "pro" : "free"
}

export function setPlan(plan: Plan) {
  if (typeof window === "undefined") return
  localStorage.setItem(PLAN_KEY, plan)
}

export function isPro(): boolean {
  return getPlan() === "pro"
}

export function togglePlan(): Plan {
  const next = isPro() ? "free" : "pro"
  setPlan(next)
  return next
}
