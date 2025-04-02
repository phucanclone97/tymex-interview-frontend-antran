import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial value", 500));
    expect(result.current).toBe("initial value");
  });

  it("should debounce the value change", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } }
    );

    // Change the value
    rerender({ value: "changed value", delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe("initial value");

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe("changed value");
  });

  it("should handle multiple changes within the delay period", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } }
    );

    // Change the value multiple times
    rerender({ value: "changed value 1", delay: 500 });

    // Fast-forward time but not enough to trigger update
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Change again
    rerender({ value: "changed value 2", delay: 500 });

    // Value should still be the initial one
    expect(result.current).toBe("initial value");

    // Fast-forward enough time to trigger the update
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // The value should be the latest change
    expect(result.current).toBe("changed value 2");
  });

  it("should clear timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");

    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
