import { DecisionModal } from "./components/DecisionModal";
import { IonApp, IonCard, IonCardContent, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonSegment, IonSegmentButton, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { EmployeeView } from "./views/EmployeeView";
import { SupervisorView } from "./views/SupervisorView";
import { personCircle, shieldCheckmark } from 'ionicons/icons';
import { Role, usePTOManager } from "./hooks/usePTOManager";

export const App: React.FC = () => {
  const {
    currentRole,
    timeOffRequests,
    currentUserName,
    userRequests,
    sortedRequests,
    toastMessage,
    decisionModal,
    changeRole,
    changeUserName,
    submitRequest,
    openDecisionModal,
    decideRequest,
    resetAllRequests,
    setToastMessage,
    setDecisionModal
  } = usePTOManager();

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <div className="flex items-center justify-between w-full">
            <IonTitle style={{ marginTop: 10 }}>PTO Manager</IonTitle>
            <div className="flex items-center gap-2 pr-2">
              <IonSegment value={currentRole} onIonChange={e => changeRole(e.detail.value as Role)}>
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
              <IonLabel position="stacked">{currentRole} Name</IonLabel>
              <IonInput
                placeholder={`Enter ${currentRole.toLowerCase()} name`}
                value={currentUserName}
                onIonChange={e => changeUserName(e.detail.value || "")}
              />
            </IonItem>
            {currentRole === "Employee" && <IonNote className="mt-2 block">Your requests are associated with this name.</IonNote>}
          </IonCardContent>
        </IonCard>

        {currentRole === "Employee" ? (
          <EmployeeView currentUser={currentUserName} requests={sortedRequests(userRequests)} onSubmit={submitRequest} />
        ) : (
          <SupervisorView
            requests={sortedRequests(timeOffRequests)}
            onApprove={id => openDecisionModal(id, "Approve")}
            onReject={id => openDecisionModal(id, "Reject")}
            onReset={resetAllRequests}
          />
        )}

        <DecisionModal
          isOpen={!!decisionModal.requestId}
          mode={decisionModal.mode}
          onDismiss={() => setDecisionModal({ requestId: null, mode: null })}
          onConfirm={decideRequest}
        />

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={1600}
          onDidDismiss={() => setToastMessage("")}
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