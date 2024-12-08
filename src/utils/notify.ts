import { toaster } from "@/components/ui/toaster";

export function notifySuccess(description: string, title = "Great!"): void {
  toaster.create({
    title,
    description,
    type: "success",
  });
}

export function notifyError(message: string): void {
  toaster.create({
    title: "Oops!",
    description: message,
    type: "error",
  });
}
