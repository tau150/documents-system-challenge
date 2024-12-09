import { describe, it, expect, vi } from "vitest";
import { API } from "../documentsApi";
import { client } from "@/lib";
import { Status } from "@/domain";

vi.mock("@/lib", () => ({
  client: {
    from: vi.fn(),
  },
}));

describe("API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("save", () => {
    it("should save documents and return them", async () => {
      const mockDocuments = [{ id: "1", name: "Doc 1", signatories: [], status: Status.PENDING }];

      vi.mocked(client.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: mockDocuments, error: null }),
      } as never);

      const result = await API.save(mockDocuments);

      expect(result).toEqual(mockDocuments);
      expect(client.from).toHaveBeenCalledWith("documents");
    });

    it("should throw an error if saving fails", async () => {
      vi.mocked(client.from).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: null, error: new Error("Save error") }),
      } as never);

      await expect(API.save([])).rejects.toThrow("Error saving documents");
    });
  });

  describe("getAll", () => {
    it("should retrieve all documents", async () => {
      const mockDocuments = [{ id: "1", name: "Doc 1", signatories: [], status: Status.PENDING }];

      vi.mocked(client.from).mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: mockDocuments, error: null }),
      } as never);

      const result = await API.getAll();

      expect(result).toEqual(mockDocuments);
      expect(client.from).toHaveBeenCalledWith("documents");
    });

    it("should throw an error if retrieving documents fails", async () => {
      vi.mocked(client.from).mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: new Error("Get error") }),
      } as never);

      await expect(API.getAll()).rejects.toThrow("Error saving documents");
    });
  });

  describe("deleteDocumentById", () => {
    it("should delete a document by ID", async () => {
      vi.mocked(client.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      } as never);

      const result = await API.deleteDocumentById("1");

      expect(result).toBe("1");
      expect(client.from).toHaveBeenCalledWith("documents");
    });

    it("should throw an error if deletion fails", async () => {
      vi.mocked(client.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: new Error("Delete error") }),
      } as never);

      await expect(API.deleteDocumentById("1")).rejects.toThrow("Error deleting the document");
    });
  });

  describe("assignSignatories", () => {
    it("should assign signatories to a document", async () => {
      const mockDocument = { id: "1", name: "Doc 1", signatories: [], status: Status.PENDING };

      vi.mocked(client.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [mockDocument], error: null }),
      } as never);

      vi.mocked(client.from).mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockDocument, signatories: ["test@example.com"] },
          error: null,
        }),
      } as never);

      const result = await API.assignSignatories("1", ["test@example.com"]);

      expect(result).toEqual({ ...mockDocument, signatories: ["test@example.com"] });
      expect(client.from).toHaveBeenCalledWith("documents");
    });

    it("should throw an error if assigning signatories fails", async () => {
      vi.mocked(client.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: new Error("Fetch error") }),
      } as never);

      await expect(API.assignSignatories("1", ["test@example.com"])).rejects.toThrow(
        "Error getting the document",
      );
    });
  });
});
