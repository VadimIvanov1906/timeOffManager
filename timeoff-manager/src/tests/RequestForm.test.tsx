import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { RequestForm } from "../components/RequestForm";

describe("RequestForm", () => {
  it("renders form inputs", () => {
    render(<RequestForm currentUser="Vadim" onSubmit={vi.fn()} />);
    expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Off Type/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Context for your supervisor/i)).toBeInTheDocument();
  });

  it("submits the form with input values", () => {
    const onSubmit = vi.fn();
    render(<RequestForm currentUser="Vadim" onSubmit={onSubmit} />);

    const startDate = screen.getByText(/Start Date/i).closest("ion-item")?.querySelector("ion-datetime");
    const endDate = screen.getByText(/End Date/i).closest("ion-item")?.querySelector("ion-datetime");
    const typeSelect = screen.getByText(/Time Off Type/i).closest("ion-item")?.querySelector("ion-select");
    const notes = screen.getByPlaceholderText(/Context for your supervisor/i).closest("ion-textarea");

    if (startDate) {
      startDate.value = "2025-10-10";
      fireEvent(startDate, new CustomEvent("ionChange", { detail: { value: "2025-10-10" } }));
    }

    if (endDate) {
      endDate.value = "2025-10-15";
      fireEvent(endDate, new CustomEvent("ionChange", { detail: { value: "2025-10-15" } }));
    }

    if (typeSelect) {
      typeSelect.value = "Vacation";
      fireEvent(typeSelect, new CustomEvent("ionChange", { detail: { value: "Vacation" } }));
    }

    if (notes) {
      notes.value = "Family trip";
      fireEvent(notes, new CustomEvent("ionChange", { detail: { value: "Family trip" } }));
    }
    const submitBtn = screen.getByText(/Submit Request/i);
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        employee: "Vadim",
        startDate: "2025-10-10",
        endDate: "2025-10-15",
        type: "Vacation",
        notes: "Family trip",
      })
    );
  });
});
