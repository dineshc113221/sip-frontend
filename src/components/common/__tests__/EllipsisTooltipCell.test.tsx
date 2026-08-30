import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EllipsisTooltipCell from "../EllipsisTooltipCell";

// Mock CustomTooltip to behave like normal Tooltip
jest.mock("../../consumer-packaging-tab/TableViewPackaging.component", () => ({
  CustomTooltip: ({ children, title }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));

// Helper to wrap in MUI theme
const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("EllipsisTooltipCell", () => {
  const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth');
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

  afterEach(() => {
    // Restore defaults after each test
    if (originalScrollWidth)
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth);
    if (originalClientWidth)
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  });

  it("renders tooltip when content is truncated", async () => {
    // Mock scrollWidth > clientWidth before render
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 200,
    });

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 100,
    });

    const text = "This is a long text that will definitely truncate in small width";

    renderWithTheme(
      <EllipsisTooltipCell maxWidth={50}>{text}</EllipsisTooltipCell>
    );

    await waitFor(() => {
      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("title", expect.stringContaining(text));
    });
  });

  it("does not show tooltip when content is not truncated", async () => {
    // scrollWidth <= clientWidth
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 100,
    });

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 200,
    });

    renderWithTheme(
      <EllipsisTooltipCell maxWidth={300}>Short text</EllipsisTooltipCell>
    );

    await waitFor(() => {
      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("title", "");
    });
  });

  it("applies align and custom sx", () => {
    const { container } = renderWithTheme(
      <EllipsisTooltipCell align="center" sx={{ backgroundColor: "red" }}>
        Styled text
      </EllipsisTooltipCell>
    );

    const cell = container.querySelector("td");
    expect(cell).toHaveStyle("text-align: center");
    expect(cell).toHaveStyle("background-color: red");
  });
});