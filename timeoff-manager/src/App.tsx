import { useEffect, useMemo, useState } from "react";
import { DecisionModal } from "./components/DecisionModal";
import { PTORequest } from "./types/timeOffTypes";
import { loadRequests, LS_KEY, LS_USER_KEY, saveRequests, uid } from "./utils/timeOffUtils";
import { IonApp, IonCard, IonCardContent, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonSegment, IonSegmentButton, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { EmployeeView } from "./views/EmployeeView";
import { SupervisorView } from "./views/SupervisorView";
import { personCircle, shieldCheckmark } from 'ionicons/icons';

type Role = "Employee" | "Supervisor";

export const App: React.FC = () => {
  const [role, setRole] = useState<Role>(() => (localStorage.getItem(LS_USER_KEY)?.includes("Supervisor:") ? "Supervisor" : "Employee"));
  const [name, setName] = useState<string>(() => {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (!raw) return "";
    const parts = raw.split(":");
    return parts[1] || "";
  });

  const [requests, setRequests] = useState<PTORequest[]>(() => {
    const existing = loadRequests();
    if (existing.length) return existing;
    const seed: PTORequest[] = [
      {
        id: uid(), employee: "Alex Johnson", startDate: "2025-09-15", endDate: "2025-09-20", type: "Vacation",
        notes: "Family trip", status: "Pending", createdAt: new Date(Date.now() - 1000*60*60*24*3).toISOString()
      },
      {
        id: uid(), employee: "Sam Lee", startDate: "2025-09-10", endDate: "2025-09-11", type: "Sick",
        status: "Approved", decisionNote: "Feel better!", createdAt: new Date(Date.now() - 1000*60*60*24*7).toISOString(), decidedAt: new Date(Date.now() - 1000*60*60*24*6).toISOString()
      },
      {
        id: uid(), employee: "Riley Chen", startDate: "2025-08-28", endDate: "2025-08-30", type: "Personal",
        notes: "Move apartments", status: "Rejected", decisionNote: "Blackout period", createdAt: new Date(Date.now() - 1000*60*60*24*14).toISOString(), decidedAt: new Date(Date.now() - 1000*60*60*24*13).toISOString()
      },
    ];
    saveRequests(seed);
    return seed;
  });

  useEffect(() => { saveRequests(requests); }, [requests]);

  const [toastMsg, setToastMsg] = useState<string>("");

  const myRequests = useMemo(
    () => requests.filter(r => r.employee.toLowerCase() === name.trim().toLowerCase()),
    [requests, name]
  );

  const upcomingFirst = (list: PTORequest[]) =>
    [...list].sort((a, b) => a.startDate.localeCompare(b.startDate));

  const [modal, setModal] = useState<{ id: string | null; mode: "Approve" | "Reject" | null }>({ id: null, mode: null });

  function fakeLogin(newRole: Role) {
    setRole(newRole);
    const label = newRole === "Supervisor" ? "Supervisor" : "Employee";
    localStorage.setItem(LS_USER_KEY, `${label}:${name || ""}`);
  }

  function saveName(n: string) {
    setName(n);
    const label = role === "Supervisor" ? "Supervisor" : "Employee";
    localStorage.setItem(LS_USER_KEY, `${label}:${n}`);
  }

  function submitRequest(r: PTORequest) {
    setRequests((prev) => [r, ...prev]);
    setToastMsg("Request submitted.");
  }

  function openDecision(id: string, mode: "Approve" | "Reject") {
    setModal({ id, mode });
  }

  function decide(note: string) {
    if (!modal.id || !modal.mode) return;
    setRequests(prev => prev.map(r => r.id === modal.id
      ? { ...r, status: modal.mode === "Approve" ? "Approved" : "Rejected", decisionNote: note || undefined, decidedAt: new Date().toISOString() }
      : r
    ));
    setToastMsg(`Request ${modal.mode.toLowerCase()}d.`);
    setModal({ id: null, mode: null });
  }

  function resetDemoData() {
    localStorage.removeItem(LS_KEY);
    const cleared: PTORequest[] = [];
    setRequests(cleared);
    setToastMsg("All requests cleared (demo reset).");
  }

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <div className="flex items-center justify-between w-full">
            <IonTitle>PTO Manager</IonTitle>
            <div className="flex items-center gap-2 pr-2">
              <IonSegment value={role} onIonChange={(e) => fakeLogin(e.detail.value as Role)}>
                <IonSegmentButton value="Employee">
                  <IonIcon icon={personCircle} />
                  <IonLabel>Employee</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="Supervisor">
                   <IonIcon icon={shieldCheckmark} />
                  <IonLabel>Supervisor</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding h-full w-full">
        <IonCard className="rounded-2xl mb-3">
          <IonCardContent>
            <IonItem lines="none">
              <IonLabel position="stacked">{role} Name</IonLabel>
              <IonInput
                placeholder={`Enter ${role.toLowerCase()} name`}
                value={name}
                onIonChange={(e) => saveName(e.detail.value || "")}
              />
            </IonItem>
            {role === "Employee" && (
              <IonNote className="mt-2 block">Your requests are associated with this name.</IonNote>
            )}
          </IonCardContent>
        </IonCard>

        {role === "Employee" ? (
          <EmployeeView
            currentUser={name}
            requests={upcomingFirst(myRequests)}
            onSubmit={submitRequest}
          />
        ) : (
          <SupervisorView
            requests={upcomingFirst(requests)}
            onApprove={(id) => openDecision(id, "Approve")}
            onReject={(id) => openDecision(id, "Reject")}
            onReset={resetDemoData}
          />
        )}

        <DecisionModal
          isOpen={!!modal.id}
          mode={modal.mode}
          onDismiss={() => setModal({ id: null, mode: null })}
          onConfirm={decide}
        />

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={1600}
          onDidDismiss={() => setToastMsg("")}
        />
      </IonContent>

      <IonFooter className="ion-padding">
        <div className="text-center text-[12px] opacity-70">
          Ionic + React • Local-only demo • {new Date().getFullYear()}
        </div>
      </IonFooter>
    </IonApp>
  );
};
