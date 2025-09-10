import { useMemo, useState } from "react";
import { loadRequests, LS_KEY, LS_USER_KEY, saveRequests, uid } from "../utils/timeOffUtils";
import { PTORequest } from "../types/timeOffTypes";

export type Role = "Employee" | "Supervisor";

export const usePTOManager = () => {
    const [currentRole, setCurrentRole] = useState<Role>(() =>
        localStorage.getItem(LS_USER_KEY)?.includes("Supervisor:") ? "Supervisor" : "Employee"
    );

    const [currentUserName, setCurrentUserName] = useState<string>(() => {
        const savedUser = localStorage.getItem(LS_USER_KEY);
        if (!savedUser) return "";
        const parts = savedUser.split(":");
        return parts[1] || "";
    });

    const [timeOffRequests, setTimeOffRequests] = useState<PTORequest[]>(() => {
        const existingRequests = loadRequests();
        if (existingRequests.length > 0) return existingRequests;

        const seedRequests: PTORequest[] = [
            { id: uid(), employee: "Alex Johnson", startDate: "2025-09-15", endDate: "2025-09-20", type: "Vacation", notes: "Family trip", status: "Pending", createdAt: new Date().toISOString() },
            { id: uid(), employee: "Sam Lee", startDate: "2025-09-10", endDate: "2025-09-11", type: "Sick", status: "Approved", decisionNote: "Feel better!", createdAt: new Date().toISOString(), decidedAt: new Date().toISOString() },
            { id: uid(), employee: "Riley Chen", startDate: "2025-08-28", endDate: "2025-08-30", type: "Personal", notes: "Move apartments", status: "Rejected", decisionNote: "Blackout period", createdAt: new Date().toISOString(), decidedAt: new Date().toISOString() },
        ];

        saveRequests(seedRequests);
        return seedRequests;
    });

    const [toastMessage, setToastMessage] = useState("");
    const [decisionModal, setDecisionModal] = useState<{ requestId: string | null; mode: "Approve" | "Reject" | null }>({ requestId: null, mode: null });

    const userRequests = useMemo(
        () => timeOffRequests.filter(r => r.employee.toLowerCase() === currentUserName.trim().toLowerCase()),
        [timeOffRequests, currentUserName]
    );

    const sortedRequests = (requests: PTORequest[]) => [...requests].sort((a, b) => a.startDate.localeCompare(b.startDate));

    const changeRole = (role: Role) => {
        setCurrentRole(role);
        localStorage.setItem(LS_USER_KEY, `${role}:${currentUserName}`);
    };

    const changeUserName = (name: string) => {
        setCurrentUserName(name);
        localStorage.setItem(LS_USER_KEY, `${currentRole}:${name}`);
    };

    const submitRequest = (request: PTORequest) => {
        setTimeOffRequests(prev => [request, ...prev]);
        setToastMessage("Request submitted.");
        saveRequests([request, ...timeOffRequests]);
    };

    const openDecisionModal = (requestId: string, mode: "Approve" | "Reject") => setDecisionModal({ requestId, mode });

    const decideRequest = (decisionNote: string) => {
        if (!decisionModal.requestId || !decisionModal.mode) return;
        setTimeOffRequests(prev => prev.map(r => r.id === decisionModal.requestId
            ? { ...r, status: decisionModal.mode === "Approve" ? "Approved" : "Rejected", decisionNote: decisionNote || undefined, decidedAt: new Date().toISOString() }
            : r
        ));
        setToastMessage(`Request ${decisionModal.mode.toLowerCase()}d.`);
        setDecisionModal({ requestId: null, mode: null });
    };

    const resetAllRequests = () => {
        setTimeOffRequests([]);
        localStorage.removeItem(LS_KEY);
        setToastMessage("All requests cleared (demo reset).");
    };
    
    return {
        currentRole,
        currentUserName,
        timeOffRequests,
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
    };
}