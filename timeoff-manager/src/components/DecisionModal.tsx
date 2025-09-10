import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonModal, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";

export const DecisionModal: React.FC<{
  isOpen: boolean;
  mode: "Approve" | "Reject" | null;
  onDismiss: () => void;
  onConfirm: (note: string) => void;
}> = ({ isOpen, mode, onDismiss, onConfirm }) => {
  const [note, setNote] = useState("");
  useEffect(() => { if (!isOpen) setNote(""); }, [isOpen]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.75]}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{mode} Request</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Optional note</IonLabel>
          <IonTextarea value={note} onIonChange={(e) => setNote(e.detail.value as string)} autoGrow />
        </IonItem>
        <div className="mt-4 flex gap-2">
          <IonButton expand="block" color={mode === "Approve" ? "success" : "medium"} onClick={() => onConfirm(note)}>
            {mode}
          </IonButton>
          <IonButton expand="block" fill="outline" onClick={onDismiss}>Cancel</IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};