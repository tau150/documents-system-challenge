import { describe, it, expect } from "vitest";
import { DocumentUpload } from "../DocumentUpload";
import { render, screen, userEvent, waitFor } from "@/tests";
import { API } from "@/services/documentsApi";
import { Status } from "@/domain";

vi.mock("@/services/documentsApi", () => ({
  API: {
    save: vi.fn(),
  },
}));

describe("DocumentUpload Component", () => {
  it("renders the Toaster and Uploader components initially", () => {
    render(<DocumentUpload />);

    expect(screen.getByText(/Upload Documents/i)).toBeInTheDocument();

    expect(screen.queryByText(/assign signatories/i)).not.toBeInTheDocument();
  });

  it("displays DocumentsToAssign when documents are uploaded", async () => {
    const user = userEvent.setup();

    vi.mocked(API.save).mockResolvedValue([
      { name: "document1.pdf", signatories: null, status: Status.PENDING, id: "124" },
    ]);

    render(<DocumentUpload />);

    const uploadInput = screen.getByTestId("upload-file");
    const mockFile = new File(["content"], "document1.pdf", { type: "application/pdf" });
    const uploadButton = screen.getByRole("button", { name: "Upload Documents" });

    await user.upload(uploadInput, mockFile);
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText("Assign signatories")).toBeInTheDocument();
    });

    expect(screen.getByText("document1.pdf")).toBeInTheDocument();
  });

  it("appends new documents when more are uploaded", async () => {
    const user = userEvent.setup();

    render(<DocumentUpload />);

    const uploadInput = screen.getByTestId("upload-file");
    const mockFile1 = new File(["content"], "document1.pdf", { type: "application/pdf" });
    const uploadButton = screen.getByRole("button", { name: "Upload Documents" });

    vi.mocked(API.save).mockResolvedValueOnce([
      { name: "document1.pdf", signatories: null, status: Status.PENDING, id: "124" },
    ]);

    await user.upload(uploadInput, mockFile1);
    await user.click(uploadButton);
    await waitFor(() => {
      expect(screen.getByText("Assign signatories")).toBeInTheDocument();
    });

    vi.mocked(API.save).mockResolvedValueOnce([
      { name: "document2.pdf", signatories: null, status: Status.PENDING, id: "124" },
    ]);

    const mockFile2 = new File(["content"], "document2.pdf", { type: "application/pdf" });

    await user.upload(uploadInput, mockFile2);
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText("document1.pdf")).toBeInTheDocument();
      expect(screen.getByText("document2.pdf")).toBeInTheDocument();
    });
  });
});
