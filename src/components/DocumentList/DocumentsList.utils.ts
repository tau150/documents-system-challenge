import { Status, Document } from "@/domain";

export function getBadgeColor(status: Status): string {
  switch (status) {
    case Status.INITIAL:
      return "purple";
    case Status.SIGNED:
      return "green";
    case Status.PENDING:
      return "yellow";
    case Status.DECLINED:
      return "red";
    default:
      return "orange";
  }
}

export function getDocumentToVerify(
  prevDocumentIds: string[],
  currentDocument: Document,
): Document | null {
  const isDocToCheck =
    prevDocumentIds.includes(currentDocument.id) &&
    (currentDocument.status === Status.DECLINED || currentDocument.status === Status.SIGNED);

  return isDocToCheck ? currentDocument : null;
}
