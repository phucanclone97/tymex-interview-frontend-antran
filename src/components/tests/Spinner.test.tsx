import React from "react";
import { render, screen } from "@testing-library/react";
import Spinner from "../Spinner";

describe("Spinner", () => {
  it("renders with default props", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeVisible();
    expect(spinner.firstChild).toHaveClass("w-8 h-8"); // md size
    expect(spinner.firstChild).toHaveClass("text-purple-600"); // primary color
  });

  it("renders with small size", () => {
    render(<Spinner size="sm" />);

    const spinner = screen.getByRole("status");
    expect(spinner.firstChild).toHaveClass("w-4 h-4");
  });

  it("renders with large size", () => {
    render(<Spinner size="lg" />);

    const spinner = screen.getByRole("status");
    expect(spinner.firstChild).toHaveClass("w-12 h-12");
  });

  it("renders with white color", () => {
    render(<Spinner color="white" />);

    const spinner = screen.getByRole("status");
    expect(spinner.firstChild).toHaveClass("text-white");
  });

  it("renders with gray color", () => {
    render(<Spinner color="gray" />);

    const spinner = screen.getByRole("status");
    expect(spinner.firstChild).toHaveClass("text-gray-400");
  });

  it("renders with custom className", () => {
    render(<Spinner className="my-custom-class" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("my-custom-class");
  });

  it("has accessible text for screen readers", () => {
    render(<Spinner />);

    const srText = screen.getByText("Loading...");
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass("sr-only");
  });
});
