import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionHeading } from "@/components/section-heading";

describe("SectionHeading", () => {
  it("renders eyebrow, title, and description with the requested heading level", () => {
    render(<SectionHeading eyebrow="Selected work" title="Case studies" description="Three platforms." as="h1" id="work" />);

    const heading = screen.getByRole("heading", { level: 1, name: "Case studies" });
    expect(heading).toHaveAttribute("id", "work");
    expect(screen.getByText("Selected work")).toBeInTheDocument();
    expect(screen.getByText("Three platforms.")).toBeInTheDocument();
  });

  it("renders an optional action slot", () => {
    render(<SectionHeading eyebrow="Technical writing" title="Writing" action={<button type="button">All articles</button>} />);
    expect(screen.getByRole("button", { name: "All articles" })).toBeInTheDocument();
  });
});
