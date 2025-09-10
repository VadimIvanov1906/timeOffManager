import { IonBadge } from "@ionic/react";
import { RequestStatus } from "../types/timeOffTypes";

export const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const color = status === "Approved" ? "success" : status === "Rejected" ? "danger" : "warning";
  return <IonBadge color={color} className="text-sm">{status}</IonBadge>;
};