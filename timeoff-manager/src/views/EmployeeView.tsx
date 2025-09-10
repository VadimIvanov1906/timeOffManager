import { RequestCard } from "../components/RequestCard";
import { RequestForm } from "../components/RequestForm";
import { PTORequest } from "../types/timeOffTypes";
import { EmptyState } from "./EmptyState";

export const EmployeeView: React.FC<{
    currentUser: string;
    requests: PTORequest[];
    onSubmit: (r: PTORequest) => void;
}> = ({ currentUser, requests, onSubmit }) => {
    return (
        <div>
            <RequestForm onSubmit={onSubmit} currentUser={currentUser} />
            <section className="my-requests mt-4">
                <h3 className="requests-title text-lg font-semibold mb-3" style={{marginLeft: 15}}>My Requests</h3>
                <div className="requests-list">
                    {(!requests || requests.length === 0) && (
                        <EmptyState title="No requests yet" subtitle="Submit your first time-off request above." />
                    )}
                    {requests.map((r) => (
                        <RequestCard key={r.id} req={r} />
                    ))}
                </div>
            </section>
        </div>
    );
};
