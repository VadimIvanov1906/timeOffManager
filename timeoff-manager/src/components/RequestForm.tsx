import { useState, useEffect } from "react";
import { PTORequest, TimeOffType } from "../types/timeOffTypes";
import { uid } from "../utils/timeOffUtils";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";

export type RequestFormProps = {
  onSubmit: (r: PTORequest) => void;
  currentUser: string;
};

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, currentUser }) => {
  const [type, setType] = useState<TimeOffType | undefined>();
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time validation on field change
  useEffect(() => {
    const e: Record<string, string> = {};
    if (!currentUser.trim()) e.employee = "Employee name is required.";
    if (!type) e.type = "Time off type is required.";
    if (!start) e.start = "Start date is required.";
    if (!end) e.end = "End date is required.";
    if (start && end && start > end) e.dateOrder = "Start date must be before or equal to End date.";
    setErrors(e);
  }, [currentUser, type, start, end]);

  const reset = () => {
    setType(undefined);
    setStart("");
    setEnd("");
    setNotes("");
    setErrors({});
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) return;

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
  };

  const inputClass = (field: string) =>
    errors[field] ? "border border-red-500 rounded-lg" : "";

  return (
    <IonCard className="rounded-2xl shadow-md">
      <IonCardHeader>
        <IonCardTitle className="text-lg font-semibold">Request Time Off</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList inset>
          <IonItem className={inputClass("start")}>
            <IonLabel position="stacked">Start Date</IonLabel>
            <IonDatetime
              presentation="date"
              value={start}
              onIonChange={(e) => setStart(e.detail.value as string)}
            />
            {errors.start && <p className="text-sm mt-1" style={{color: "red"}}>{errors.start}</p>}
            {errors.dateOrder && <p className="text-sm mt-1" style={{color: "red"}}>{errors.dateOrder}</p>}
          </IonItem>

          <IonItem className={inputClass("end")}>
            <IonLabel position="stacked">End Date</IonLabel>
            <IonDatetime
              presentation="date"
              value={end}
              onIonChange={(e) => setEnd(e.detail.value as string)}
            />
            {errors.end && <p className="text-sm mt-1" style={{color: "red"}}>{errors.end}</p>}
          </IonItem>

          <IonItem className={inputClass("type")}>
            <IonLabel position="stacked">Time Off Type</IonLabel>
            <IonSelect
              placeholder="Select type"
              value={type}
              onIonChange={(e) => setType(e.detail.value)}
            >
              {["Vacation", "Sick", "Personal", "Unpaid"].map((t) => (
                <IonSelectOption key={t} value={t}>
                  {t}
                </IonSelectOption>
              ))}
            </IonSelect>
            {errors.type && <p className="text-sm mt-1" style={{color: "red"}}>{errors.type}</p>}
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

        <div className="mt-4">
          <IonButton expand="block" onClick={handleSubmit} disabled={Object.keys(errors).length > 0}>
            Submit Request
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};
