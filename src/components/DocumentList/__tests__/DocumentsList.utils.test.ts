import { describe, test, expect } from "vitest";
import { getBadgeColor, getDocumentToVerify } from "../DocumentsList.utils";
import { Status, Document } from "@/domain";

describe("Utils Tests", () => {
  describe("getBadgeColor", () => {
    test("should return 'purple' for INITIAL status", () => {
      expect(getBadgeColor(Status.INITIAL)).toBe("purple");
    });

    test("should return 'green' for SIGNED status", () => {
      expect(getBadgeColor(Status.SIGNED)).toBe("green");
    });

    test("should return 'yellow' for PENDING status", () => {
      expect(getBadgeColor(Status.PENDING)).toBe("yellow");
    });

    test("should return 'red' for DECLINED status", () => {
      expect(getBadgeColor(Status.DECLINED)).toBe("red");
    });

    test("should return 'orange' for unknown status", () => {
      expect(getBadgeColor("UNKNOWN" as Status)).toBe("orange");
    });
  });

  describe("getDocumentToVerify", () => {
    const mockDocument: Document = {
      id: "123",
      status: Status.SIGNED,
      name: "Sample Document",
      signatories: null,
    };

    test("should return the document if it matches the conditions", () => {
      const prevDocumentIds = ["123", "456"];
      const result = getDocumentToVerify(prevDocumentIds, mockDocument);

      expect(result).toEqual(mockDocument);
    });

    test("should return null if document ID is not in previous document IDs", () => {
      const prevDocumentIds = ["456", "789"];
      const result = getDocumentToVerify(prevDocumentIds, mockDocument);

      expect(result).toBeNull();
    });

    test("should return null if document status is not SIGNED or DECLINED", () => {
      const prevDocumentIds = ["123", "456"];
      const result = getDocumentToVerify(prevDocumentIds, {
        ...mockDocument,
        status: Status.PENDING,
      });

      expect(result).toBeNull();
    });
  });
});
