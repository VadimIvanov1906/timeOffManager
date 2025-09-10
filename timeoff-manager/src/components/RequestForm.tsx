import { useState } from "react";
import { PTORequest, TimeOffType } from "../types/timeOffTypes";
import { uid } from "../utils/timeOffUtils";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonDatetime, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";

export type RequestFormProps = {
  onSubmit: (r: PTORequest) => void;
  currentUser: string;
};

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, currentUser }) => {
  const [type, setType] = useState<TimeOffType | undefined>();
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  function validate(): boolean {
    const e: string[] = [];
    if (!currentUser.trim()) e.push("Employee name is required.");
    if (!type) e.push("Time off type is required.");
    if (!start) e.push("Start date is required.");
    if (!end) e.push("End date is required.");
    if (start && end && start > end) e.push("Start date must be before or equal to End date.");
    setErrors(e);
    return e.length === 0;
  }

  function reset() {
    setType(undefined);
    setStart("");
    setEnd("");
    setNotes("");
    setErrors([]);
  }

  function handleSubmit() {
    if (!validate()) return;
    const req: PTORequest = {
      id: uid(),
      employee: currentUser,
      startDate: start.slice(0, 10),
      endDate: end.slice(0, 10),
      type: type!,
      notes: notes.trim() || undefined,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    onSubmit(req);
    reset();
  }

  return (
    <IonCard className="rounded-2xl">
      <IonCardHeader>
        <IonCardTitle className="text-lg">Request Time Off</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked" style={{marginBottom: 5}}>Start Date</IonLabel>
            <IonDatetime
              presentation="date"
              value={start}
              onIonChange={(e) => setStart(e.detail.value as string)}
              className="w-full"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked" style={{marginBottom: 5}}>End Date</IonLabel>
            <IonDatetime
              presentation="date"
              value={end}
              onIonChange={(e) => setEnd(e.detail.value as string)}
              className="w-full"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Time Off Type</IonLabel>
            <IonSelect
              placeholder="Select type"
              value={type}
              onIonChange={(e) => setType(e.detail.value)}
            >
              {["Vacation", "Sick", "Personal", "Unpaid"].map((t) => (
                <IonSelectOption key={t} value={t}>{t}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Notes (optional)</IonLabel>
            <IonTextarea
              value={notes}
              onIonChange={(e) => setNotes(e.detail.value as string)}
              autoGrow
              placeholder="Context for your supervisor"
            />
          </IonItem>
        </IonList>
        {errors.length > 0 && (
          <div className="p-3 text-[14px] rounded-xl bg-red-50 text-red-700 mt-3">
            <ul className="list-disc ml-5">
              {errors.map((er, i) => <li key={i}>{er}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <IonButton expand="block" onClick={handleSubmit}>Submit Request</IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};