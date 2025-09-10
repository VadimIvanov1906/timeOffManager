export type TimeOffType = "Vacation" | "Sick" | "Personal" | "Unpaid";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface PTORequest {
  id: string;
  employee: string;
  startDate: string;
  endDate: string;
  type: TimeOffType;
  notes?: string;
  status: RequestStatus;
  decisionNote?: string;
  createdAt: string;
  decidedAt?: string;
}
