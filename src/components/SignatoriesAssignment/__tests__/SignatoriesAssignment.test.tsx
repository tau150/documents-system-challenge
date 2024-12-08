import { describe, it, vi, expect } from "vitest";
import { SignatoriesAssignment } from "../SignatoriesAssignment";
import { render, screen, userEvent, waitFor } from "@/tests";
import { useService } from "@/hooks";

vi.mock("@/hooks", () => ({
  useService: vi.fn(() => ({
    callRequest: vi.fn(),
  })),
}));

vi.mock("@/services/mailerApi", () => ({
  MAILER: {
    sendEmail: vi.fn(),
  },
}));

vi.mock("@/utils/notify", () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

vi.mock("./SignatoriesAssignment.utils", () => ({
  validateEmailArray: vi.fn(() => true),
}));

describe("SignatoriesAssignment Component", () => {
  const mockDocument = { name: "Test Document", id: "123" };
  const mockSetDocument = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnAssign = vi.fn();

  it("renders correctly", () => {
    render(
      <SignatoriesAssignment
        document={mockDocument}
        setDocument={mockSetDocument}
        onAssign={mockOnAssign}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Assign signatories to:")).toBeInTheDocument();
    expect(screen.getByText("Test Document")).toBeInTheDocument();
    expect(
      screen.getByText("Separate signatories email by coma without spaces"),
    ).toBeInTheDocument();
  });

  it.only("shows validation error for invalid emails", async () => {
    const user = userEvent.setup();

    render(
      <SignatoriesAssignment
        document={mockDocument}
        setDocument={mockSetDocument}
        onAssign={mockOnAssign}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByRole("textbox");

    await user.type(input, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /Assign/i });

    await user.click(submitButton);

    expect(screen.getByText("Invalid format")).toBeInTheDocument();
  });

  it("submits valid emails and calls assignSignatories", async () => {
    const user = userEvent.setup();
    const mockAssignSignatories = vi.fn();

    vi.mocked(useService).mockReturnValue({
      callRequest: mockAssignSignatories,
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(
      <SignatoriesAssignment
        document={mockDocument}
        setDocument={mockSetDocument}
        onAssign={mockOnAssign}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByRole("textbox");

    await user.type(input, "test1@example.com,test2@example.com");

    const submitButton = screen.getByRole("button", { name: /Assign/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAssignSignatories).toHaveBeenCalledWith("123", [
        "test1@example.com",
        "test2@example.com",
      ]);
    });
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <SignatoriesAssignment
        document={mockDocument}
        setDocument={mockSetDocument}
        onAssign={mockOnAssign}
        onCancel={mockOnCancel}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledWith(null);
  });
});
