import { vi, describe, it, expect } from "vitest";
import { useService } from "../useService";
import { renderHook, act } from "@/tests";

describe("useService Hook", () => {
  const mockRequest = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call the request on load when callOnLoad is true", async () => {
    mockRequest.mockResolvedValueOnce("Success");

    const { result } = renderHook(() => useService(mockRequest, { callOnLoad: true }));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {});

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBe("Success");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should not call the request on load when callOnLoad is false", () => {
    const { result } = renderHook(() => useService(mockRequest, { callOnLoad: false }));

    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors correctly", async () => {
    mockRequest.mockRejectedValueOnce(new Error("Test error"));

    const { result } = renderHook(() => useService(mockRequest, { callOnLoad: true }));

    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Test error");
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it("should invoke onSuccess callback when request succeeds", async () => {
    const onSuccess = vi.fn();

    mockRequest.mockResolvedValueOnce("Success");

    renderHook(() => useService(mockRequest, { callOnLoad: true, onSuccess }));

    await act(async () => {});

    expect(onSuccess).toHaveBeenCalledWith("Success");
  });

  it("should invoke onError callback when request fails", async () => {
    const onError = vi.fn();

    mockRequest.mockRejectedValueOnce(new Error("Test error"));

    renderHook(() => useService(mockRequest, { callOnLoad: true, onError }));

    await act(async () => {});

    expect(onError).toHaveBeenCalledWith("Test error");
  });

  it("should handle polling correctly", async () => {
    vi.useFakeTimers();
    mockRequest.mockResolvedValue("Polling Success");

    const { result } = renderHook(() => useService(mockRequest, { pollingInterval: 1000 }));

    expect(mockRequest).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(result.current.data).toBe("Polling Success");

    vi.useRealTimers();
  });
});
