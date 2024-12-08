import { describe, it, vi, expect } from "vitest";
import { DocumentList } from "../DocumentList";
import { render, screen, userEvent, waitFor } from "@/tests";
import { API } from "@/services/documentsApi";
import { Document, Status } from "@/domain";

vi.mock("@/services/documentsApi", () => ({
  API: {
    getAll: vi.fn(),
    deleteDocumentById: vi.fn(),
  },
}));

vi.mock("@/utils/notify", () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

describe("DocumentList Component", () => {
  const mockDocuments: Document[] = [
    {
      id: "1",
      name: "Document 1",
      status: Status.PENDING,
      signatories: ["Alice", "Bob"],
    },
    {
      id: "2",
      name: "Document 2",
      status: Status.SIGNED,
      signatories: [],
    },
  ];

  it("renders the loading spinner when isLoading is true", async () => {
    vi.spyOn(API, "getAll").mockImplementation(() => new Promise(() => {}));
    render(<DocumentList />);

    expect(screen.getByTestId("loading-documents")).toBeInTheDocument();
  });

  it("renders an error message when there is an error", async () => {
    vi.spyOn(API, "getAll").mockRejectedValue(new Error("Test Error"));

    render(<DocumentList />);

    await waitFor(() => expect(screen.getByText("Something went wrong")).toBeInTheDocument());
  });

  it("renders the list of documents when API call is successful", async () => {
    vi.spyOn(API, "getAll").mockResolvedValue(mockDocuments);

    render(<DocumentList />);

    await waitFor(() => expect(screen.getByText("Documents Status")).toBeInTheDocument());

    expect(screen.getByText("Document 1")).toBeInTheDocument();
    expect(screen.getByText("Document 2")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Not signatories assigned")).toBeInTheDocument();
  });

  it("handles document deletion correctly", async () => {
    const user = userEvent.setup();

    vi.spyOn(API, "getAll").mockResolvedValue(mockDocuments);
    vi.spyOn(API, "deleteDocumentById").mockResolvedValue("1");

    render(<DocumentList />);

    await waitFor(() => expect(screen.getByText("Document 1")).toBeInTheDocument());

    const deleteButton = screen.getAllByTestId("delete-button")[0];

    await user.click(deleteButton);

    await waitFor(() => expect(API.deleteDocumentById).toHaveBeenCalledWith("1"));
    await waitFor(() => expect(screen.queryByText("Document 1")).not.toBeInTheDocument());
  });

  it("handles the assign signatories flow correctly", async () => {
    const user = userEvent.setup();

    vi.spyOn(API, "getAll").mockResolvedValue(mockDocuments);

    render(<DocumentList />);

    await waitFor(() => expect(screen.getByText("Document 1")).toBeInTheDocument());

    const assignButton = screen.getAllByTestId("assign-button")[0];

    await user.click(assignButton);

    await waitFor(() => expect(screen.getByText("Assign signatories")).toBeInTheDocument());
  });

  it("renders an empty state when there are no documents", async () => {
    vi.spyOn(API, "getAll").mockResolvedValue([]);

    render(<DocumentList />);

    await waitFor(() =>
      expect(screen.getByText("There are no documents yet.")).toBeInTheDocument(),
    );
  });
});
