import { describe, it, expect, vi } from "vitest";
import { DocumentsToAssign } from "../DocumentsToAssign";
import { render, screen, userEvent, waitFor } from "@/tests";
import { Document, Status } from "@/domain";

vi.mock("@/components", () => ({
  SignatoriesAssignment: ({
    document,
    onCancel,
  }: {
    document: Document;
    onCancel: VoidFunction;
  }) => (
    <div data-testid="signatories-assignment">
      <p>Assign signatories for {document.name}</p>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe("DocumentsToAssign Component", () => {
  const mockDocuments: Document[] = [
    { id: "1", name: "Document 1", status: Status.PENDING, signatories: [] },
    { id: "2", name: "Document 2", status: Status.SIGNED, signatories: [] },
  ];

  it("renders the heading and the list of documents", () => {
    render(<DocumentsToAssign documents={mockDocuments} />);

    expect(screen.getByRole("heading", { name: /assign signatories/i })).toBeInTheDocument();

    expect(screen.getByText("Document 1")).toBeInTheDocument();
    expect(screen.getByText("Document 2")).toBeInTheDocument();
  });

  it("renders the UserPlus icon for each document", () => {
    render(<DocumentsToAssign documents={mockDocuments} />);

    const userPlusIcons = screen.getAllByTestId("assign-icon");

    expect(userPlusIcons).toHaveLength(mockDocuments.length);
  });

  it("shows the SignatoriesAssignment component when a document is selected", async () => {
    const user = userEvent.setup();

    render(<DocumentsToAssign documents={mockDocuments} />);

    const userPlusIcon = screen.getAllByTestId("assign-icon")[0];

    await user.click(userPlusIcon);

    await waitFor(() => expect(screen.getByTestId("signatories-assignment")).toBeInTheDocument());

    expect(screen.getByText(/assign signatories for document 1/i)).toBeInTheDocument();
  });

  it("hides the SignatoriesAssignment component when cancel is clicked", async () => {
    const user = userEvent.setup();

    render(<DocumentsToAssign documents={mockDocuments} />);

    const userPlusIcon = screen.getAllByTestId("assign-icon")[0];

    await user.click(userPlusIcon);

    await waitFor(() => expect(screen.getByTestId("signatories-assignment")).toBeInTheDocument());

    await user.click(screen.getByText("Cancel"));

    await waitFor(() =>
      expect(screen.queryByTestId("signatories-assignment")).not.toBeInTheDocument(),
    );
  });

  it("renders an empty state if there are no documents", () => {
    render(<DocumentsToAssign documents={[]} />);

    expect(screen.queryByText("Document 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Document 2")).not.toBeInTheDocument();
  });
});
