import { useMemo, useState } from "react";
import { PTORequest, RequestStatus } from "../types/timeOffTypes";
import { IonButton, IonCard, IonCardContent, IonSegment, IonSegmentButton } from "@ionic/react";
import { EmptyState } from "./EmptyState";
import { RequestCard } from "../components/RequestCard";

export const SupervisorView: React.FC<{
  requests: PTORequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReset: () => void;
}> = ({ requests, onApprove, onReject, onReset }) => {
  const [filter, setFilter] = useState<"All" | RequestStatus>("All");

  const filtered = useMemo(() =>
    filter === "All" ? requests : requests.filter(r => r.status === filter)
  , [requests, filter]);

  return (
    <div>
      <IonCard className="rounded-2xl">
        <IonCardContent>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="opacity-70">Filter:</span>
              <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value as RequestStatus)}>
                <IonSegmentButton value="All">All</IonSegmentButton>
                <IonSegmentButton value="Pending">Pending</IonSegmentButton>
                <IonSegmentButton value="Approved">Approved</IonSegmentButton>
                <IonSegmentButton value="Rejected">Rejected</IonSegmentButton>
              </IonSegment>
            </div>
            <IonButton fill="outline" size="small" onClick={onReset}>
              Clear All
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      {filtered.length === 0 && (
        <EmptyState title="No requests" subtitle="Nothing to review right now." />
      )}

      {filtered.map((r) => (
        <RequestCard key={r.id} req={r} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  );
};