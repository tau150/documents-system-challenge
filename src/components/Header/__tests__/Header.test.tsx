import { describe, it, expect } from "vitest";
import { Header } from "../Header";
import { render, screen } from "@/tests";

describe("Header Component", () => {
  it("renders correctly", () => {
    render(<Header />);

    expect(screen.getByText("Document Management System")).toBeInTheDocument();
  });
});
