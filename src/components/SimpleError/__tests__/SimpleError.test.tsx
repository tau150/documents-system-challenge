import { describe, it, expect } from "vitest";
import { SimpleError } from "../SimpleError";
import { render, screen } from "@/tests";

describe("SimpleError Component", () => {
  it("renders correctly with default message", () => {
    render(<SimpleError />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders correctly with a custom message", () => {
    render(<SimpleError message="Custom error message" />);
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });
});
