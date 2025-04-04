import React from "react";
import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders with default props", () => {
    render(<EmptyState />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find any NFTs/)).toBeInTheDocument();
  });

  it("renders with custom title and message", () => {
    const customTitle = "Custom Title";
    const customMessage = "Custom message for testing";

    render(<EmptyState title={customTitle} message={customMessage} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;

    render(<EmptyState icon={customIcon} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByText("No results found")).toBeInTheDocument();
  });
});
