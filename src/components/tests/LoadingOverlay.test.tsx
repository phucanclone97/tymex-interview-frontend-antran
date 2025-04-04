import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingOverlay from "../LoadingOverlay";

describe("LoadingOverlay", () => {
  it("renders children when not loading", () => {
    render(
      <LoadingOverlay isLoading={false}>
        <div data-testid="child-content">Child Content</div>
      </LoadingOverlay>
    );

    expect(screen.getByTestId("child-content")).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders loading overlay with children when loading", () => {
    render(
      <LoadingOverlay isLoading={true}>
        <div data-testid="child-content">Child Content</div>
      </LoadingOverlay>
    );

    // Both the children and spinner should be present
    expect(screen.getByTestId("child-content")).toBeVisible();
    expect(screen.getByRole("status")).toBeVisible();

    // The visible loading text should be present
    const loadingText = screen
      .getAllByText("Loading...")
      .find((element) => !element.classList.contains("sr-only"));
    expect(loadingText).toBeVisible();
  });

  it("uses semi-transparent background by default", () => {
    render(
      <LoadingOverlay isLoading={true}>
        <div>Child Content</div>
      </LoadingOverlay>
    );

    // The overlay div should have the default background class
    const overlay = screen.getByRole("status").closest(".absolute");
    expect(overlay).toHaveClass("bg-gray-900/80");
    expect(overlay).not.toHaveClass("bg-gray-900/40");
  });

  it("uses more transparent background when transparent prop is true", () => {
    render(
      <LoadingOverlay isLoading={true} transparent={true}>
        <div>Child Content</div>
      </LoadingOverlay>
    );

    // The overlay div should have the transparent background class
    const overlay = screen.getByRole("status").closest(".absolute");
    expect(overlay).toHaveClass("bg-gray-900/40");
    expect(overlay).not.toHaveClass("bg-gray-900/80");
  });
});
