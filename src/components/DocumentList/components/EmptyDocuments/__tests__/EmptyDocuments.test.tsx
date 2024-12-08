import { describe, it, expect } from "vitest";
import { EmptyDocuments } from "../EmptyDocuments";
import { render, screen } from "@/tests";

describe("EmptyDocuments Component", () => {
  it("renders correctly", () => {
    render(<EmptyDocuments />);

    expect(screen.getByText("There are no documents yet.")).toBeInTheDocument();
  });
});
