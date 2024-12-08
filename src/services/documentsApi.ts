import { Document, Status } from "@/domain";
import { client } from "@/lib";

async function save(documents: Document[]): Promise<Document[]> {
  const { data: result, error } = await client.from("documents").insert(documents).select();

  if (error) {
    throw new Error("Error saving documents");
  }

  return Promise.resolve(result);
}

async function getAll(): Promise<Document[]> {
  const { data: result, error } = await client.from("documents").select("*");

  if (error) {
    throw new Error("Error saving documents");
  }

  return Promise.resolve(result);
}

async function deleteDocumentById(id: string): Promise<string> {
  const { error } = await client.from("documents").delete().eq("id", id);

  if (error) {
    throw new Error("Error deleting the document");
  }

  return Promise.resolve(id);
}

async function assignSignatories(id: string, signatories: string[]): Promise<Document> {
  const { data: document, error: documentError } = await client
    .from("documents")
    .select("*")
    .eq("id", id);

  if (documentError) {
    throw new Error("Error getting the document");
  }
  const newSignatories =
    document?.[0] && document[0].signatories !== null
      ? [...document[0].signatories, ...signatories]
      : signatories;

  const { error, data } = await client
    .from("documents")
    .update({ signatories: newSignatories, status: Status.PENDING })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Error deleting the document");
  }

  return Promise.resolve(data as Document);
}

export const API = {
  save,
  getAll,
  deleteDocumentById,
  assignSignatories,
};
