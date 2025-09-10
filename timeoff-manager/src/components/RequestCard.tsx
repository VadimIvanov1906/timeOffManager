import { IonButton, IonIcon, IonCardHeader, IonCardTitle, IonCard, IonNote, IonCardContent } from "@ionic/react";
import { PTORequest } from "../types/timeOffTypes";
import { StatusBadge } from "./StatusBadge";
import { RowLabel } from "./RowLabel";
import { closeCircle, checkmarkCircle } from 'ionicons/icons';
import "./style/RequestCard.css";

export type RequestCardProps = {
  req: PTORequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  compact?: boolean;
};

export const RequestCard: React.FC<RequestCardProps> = ({ req, onApprove, onReject }) => {
  return (
    <IonCard className="rounded-2xl shadow-md">
      <IonCardHeader>
        <div className="flex items-center gap-2">
          <IonCardTitle className="text-lg flex items-center gap-2">
            <StatusBadge status={req.status} />
            <span style={{marginLeft: 5}}>{req.type}</span>
          </IonCardTitle>
        </div>
        <IonNote className="mt-1">Requested by <b>{req.employee}</b> on {new Date(req.createdAt).toLocaleDateString()}</IonNote>
      </IonCardHeader>
      <IonCardContent>
        <RowLabel label="Dates" value={`${req.startDate} → ${req.endDate}`} />
        {req.notes ? <RowLabel label="Employee note: " value={req.notes} /> : null}
        {req.status !== "Pending" && (
          <div className="mt-2 p-2 rounded-xl bg-[var(--ion-color-light-shade)]">
            <RowLabel label="Decision" value={`${req.status}${req.decidedAt ? ` · ${new Date(req.decidedAt).toLocaleDateString()}` : ""}`} />
            {req.decisionNote ? <RowLabel label="Supervisor note: " value={req.decisionNote} /> : null}
          </div>
        )}

        {(onApprove || onReject) && req.status === "Pending" && (
          <div className="decision-buttons">
            {onReject && (
              <IonButton  className="decision-btn" color="medium" expand="block" onClick={() => onReject!(req.id)}>
                <IonIcon icon={closeCircle} slot="start" /> Reject
              </IonButton>
            )}
            {onApprove && (
              <IonButton  className="decision-btn" color="success" expand="block" onClick={() => onApprove!(req.id)}>
                <IonIcon icon={checkmarkCircle} slot="start" /> Approve
              </IonButton>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};