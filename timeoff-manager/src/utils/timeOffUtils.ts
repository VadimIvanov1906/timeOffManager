import { PTORequest } from "../types/timeOffTypes";

export const LS_KEY = "pto_requests_v1";
export const LS_USER_KEY = "pto_user_v1";

export function loadRequests(): PTORequest[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PTORequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRequests(reqs: PTORequest[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(reqs));
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
