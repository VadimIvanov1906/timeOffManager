import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RequestCard } from "../components/RequestCard";
import { PTORequest } from "../types/timeOffTypes";

const mockRequest: PTORequest = {
  id: "1",
  employee: "Vadim",
  startDate: "2025-10-10",
  endDate: "2025-10-15",
  type: "Vacation",
  status: "Pending",
  notes: "Family trip",
  decisionNote: "",
  createdAt: "2025-10-10",
};

describe("RequestCard", () => {
  it("renders request details", () => {
    render(<RequestCard req={mockRequest} />);
    
    expect(screen.getByText(/Vacation/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-10-10 → 2025-10-15/)).toBeInTheDocument();
    expect(screen.getByText(/Employee note:/i)).toBeInTheDocument();
    expect(screen.getByText(/Family trip/i)).toBeInTheDocument();
  });

  it("calls onApprove when Approve button clicked", () => {
    const onApprove = vi.fn();
    render(<RequestCard req={mockRequest} onApprove={onApprove} />);
    
    const approveBtn = screen.getByText(/Approve/i);
    fireEvent.click(approveBtn);

    expect(onApprove).toHaveBeenCalled();
    expect(onApprove.mock.calls[0][0]).toBe("1");
  });

  it("calls onReject when Reject button clicked", () => {
    const onReject = vi.fn();
    render(<RequestCard req={mockRequest} onReject={onReject} />);
    
    const rejectBtn = screen.getByText(/Reject/i);
    fireEvent.click(rejectBtn);
    
    expect(onReject).toHaveBeenCalled();
    expect(onReject.mock.calls[0][0]).toBe("1");
  });
});
