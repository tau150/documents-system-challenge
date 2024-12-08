import { Status } from "./Status";

export interface Document {
  id: string;
  name: string;
  status: Status;
  signatories: string[] | null;
}
