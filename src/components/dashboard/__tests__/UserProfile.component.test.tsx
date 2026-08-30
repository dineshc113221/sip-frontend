import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfilePhoto from "../UserProfilePhoto";
import { useGlobaldata } from "../../../contexts/masterData/DataContext";

jest.mock("../../../contexts/masterData/DataContext", () => ({
  useGlobaldata: jest.fn(),
}));

const mockUseGlobaldata = useGlobaldata as jest.Mock;

describe("UserProfilePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGlobaldata.mockReturnValue({
      loggedInUser: {
        accessToken: "mock-token",
        displayName: "Jain, Amit [Non-Kenvue]",
      },
    });

    global.fetch = jest.fn();

    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: jest.fn(() => "blob:test-url"),
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders user display name when open is true", () => {
    render(<UserProfilePhoto open={true} />);

    expect(screen.getByText("Jain, Amit")).toBeInTheDocument();
  });

  it("does not render display name when open is false", () => {
    render(<UserProfilePhoto open={false} />);

    expect(screen.queryByText("Jain, Amit")).not.toBeInTheDocument();
  });

  it("renders formatted display name with ellipsis when middle name exists", () => {
    mockUseGlobaldata.mockReturnValue({
      loggedInUser: {
        accessToken: "mock-token",
        displayName: "Agharkar, Ankita Suhas [Non-Kenvue]",
      },
    });

    render(<UserProfilePhoto open />);

    expect(
      screen.getByText("Agharkar, Ankita...")
    ).toBeInTheDocument();
  });

  it("renders display name without ellipsis when no middle name exists", () => {
    mockUseGlobaldata.mockReturnValue({
      loggedInUser: {
        accessToken: "mock-token",
        displayName: "Jain, Amit [Non-Kenvue]",
      },
    });

    render(<UserProfilePhoto open />);

    expect(screen.getByText("Jain, Amit")).toBeInTheDocument();
  });

  it("removes bracketed text from display name", () => {
    render(<UserProfilePhoto open />);

    expect(
      screen.queryByText(/\[Non-Kenvue]/i)
    ).not.toBeInTheDocument();
  });

  it("renders initials using last name and first name only", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    mockUseGlobaldata.mockReturnValue({
      loggedInUser: {
        accessToken: "mock-token",
        displayName: "Agharkar, Ankita Suhas [Non-Kenvue]",
      },
    });

    render(<UserProfilePhoto open />);

    expect(await screen.findByText("AA")).toBeInTheDocument();
  });

  it("renders correct initials when no middle name exists", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<UserProfilePhoto open />);

    expect(await screen.findByText("JA")).toBeInTheDocument();
  });

  it("renders avatar with correct aria label", () => {
    render(<UserProfilePhoto open />);

    expect(
      screen.getByLabelText(/Profile picture of/i)
    ).toBeInTheDocument();
  });

  it("calls Microsoft Graph photo endpoint", async () => {
    const mockBlob = new Blob();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    render(<UserProfilePhoto open />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer mock-token",
          },
        })
      );
    });
  });

  it("creates object URL when photo fetch succeeds", async () => {
    const mockBlob = new Blob();

    const createObjectURLSpy = jest.spyOn(
      URL,
      "createObjectURL"
    );

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    render(<UserProfilePhoto open />);

    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalled();
    });
  });

  it("handles fetch error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    render(<UserProfilePhoto open />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("does not call fetch when token is missing", () => {
    mockUseGlobaldata.mockReturnValue({
      loggedInUser: {
        accessToken: "",
        displayName: "Jain, Amit [Non-Kenvue]",
      },
    });

    render(<UserProfilePhoto open />);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders avatar fallback when display name is empty", () => {
    mockUseGlobaldata.mockReturnValue({
      loggedInUser: {
        accessToken: "mock-token",
        displayName: "",
      },
    });

    render(<UserProfilePhoto open />);

    expect(
      screen.getByLabelText("Profile picture of")
    ).toBeInTheDocument();
  });
});