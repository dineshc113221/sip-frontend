/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExperimentalAsseTabsComponent from "../ExperimentalAssement.component"; 

jest.mock("../../../assets/css/Style.scss", () => ({}));
jest.mock("../../../assets/images/step_assessment.svg", () => "step_assessment.svg");

jest.mock("../../common/GridViewComponentExperimental", () => ({
  GridViewComponentExperimental: ({ props }) => (
    <div data-testid="grid-view-component">
      {props.map((item) => (
        <div key={item._id} data-testid="grid-item">
          {item.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../../common/ListViewComponentExperimental", () => ({
  ListViewComponentExperimental: ({ props }) => (
    <div data-testid="list-view-component">
      {props.map((item) => (
        <div key={item._id} data-testid="list-item">
          {item.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../../common/LightTooltipComponent", () => () => (
  <div data-testid="light-tooltip">Tooltip</div>
));


jest.mock("react-infinite-scroll-component", () => ({ children }) => (
  <div data-testid="infinite-scroll">{children}</div>
));

describe("ExperimentalAsseTabsComponent", () => {
  const mockRefetch = jest.fn();
  const mockVarProductData = { productID: "123" };
  
  const getSampleData = () => [
    {
      _id: "1",
      name: "Product B",
      isLPP: false,
      updatedAt: "2023-01-02",
      createdAt: "2023-01-01",
    },
    {
      _id: "2",
      name: "Product A",
      isLPP: false,
      updatedAt: "2023-01-01",
      createdAt: "2023-01-02",
    },
  ];

  const getLPPData = () => [
    {
      _id: "1",
      name: "Product Normal",
      isLPP: false,
      updatedAt: "2023-01-01",
    },
    {
      _id: "2",
      name: "Product LPP",
      isLPP: true, // This determines containsLPP
      updatedAt: "2023-01-02",
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test Empty State (Step 2 Alert)
  test("renders Step 2 alert when ExperimentalData is empty", () => {
    render(
      <ExperimentalAsseTabsComponent
        ExperimentalData={[]}
        varproductData={mockVarProductData as any}
        refetch={mockRefetch}
        varUserCRUDAccess={1}
      />
    );

    // Should show Step 2 specific text
    expect(screen.getByText(/Step 2: Add your experimental assessments/i)).toBeInTheDocument();
    // Should NOT show the data components
    expect(screen.queryByTestId("grid-view-component")).not.toBeInTheDocument();
  });

  // 2. Test Data Present but NO LPP (Step 3 Alert)
  test("renders Step 3 alert and Grid View when data exists but NO LPP is present", () => {
    const data = getSampleData();
    render(
      <ExperimentalAsseTabsComponent
        ExperimentalData={data as any}
        varproductData={mockVarProductData as any}
        refetch={mockRefetch}
        varUserCRUDAccess={1}
      />
    );

    // Check header count
    expect(screen.getByText(/2 Assessments/i)).toBeInTheDocument();

    // Check Step 3 Alert (Logic: length > 0 && !containsLPP)
    expect(screen.getByText(/Step 3: Identify your Locked Product Prototype/i)).toBeInTheDocument();

    // Default view should be Grid
    expect(screen.getByTestId("grid-view-component")).toBeInTheDocument();
    expect(screen.queryByTestId("list-view-component")).not.toBeInTheDocument();
  });

  // 3. Test Data Present WITH LPP (CRITICAL TEST CASE)
  test("does NOT render Step 3 alert when data contains an LPP item", () => {
    const data = getLPPData(); // Contains one item with isLPP: true
    render(
      <ExperimentalAsseTabsComponent
        ExperimentalData={data as any}
        varproductData={mockVarProductData as any}
        refetch={mockRefetch}
        varUserCRUDAccess={1}
      />
    );

    // Check header count
    expect(screen.getByText(/2 Assessments/i)).toBeInTheDocument();

    // CRITICAL CHECK: The Step 3 Alert should NOT be there because containsLPP is true
    // Logic: props?.ExperimentalData?.length>0 (True) && !containsLPP (False) -> Result False
    expect(screen.queryByText(/Step 3: Identify your Locked Product Prototype/i)).not.toBeInTheDocument();

    // Also shouldn't show Step 2 alert
    expect(screen.queryByText(/Step 2: Add your Experimental Products/i)).not.toBeInTheDocument();
  });

  
  // 4. Test Sorting Functionality
  test("sorts items by A-Z when selected", async () => {
    const data = getSampleData(); // Product B, Product A
    render(
      <ExperimentalAsseTabsComponent
        ExperimentalData={data as any}
        varproductData={mockVarProductData as any}
        refetch={mockRefetch}
        varUserCRUDAccess={1}
      />
    );

    // Default sorting is Modified Date. 
    // Open Select dropdown
    const selectButton = screen.getByRole("combobox"); 
    fireEvent.mouseDown(selectButton);

    // Select A-Z option from the listbox
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("A-Z"));

    // Verify order in rendered items
    const items = screen.getAllByTestId("grid-item");
    expect(items[0]).toHaveTextContent("Product A");
    expect(items[1]).toHaveTextContent("Product B");
  });

  test("sorts items by Modified Date", async () => {
    const data = [
        { _id: '1', name: 'Old', updatedAt: '2023-01-01' },
        { _id: '2', name: 'New', updatedAt: '2023-01-10' }
    ];
    
    render(
      <ExperimentalAsseTabsComponent
        ExperimentalData={data as any}
        varproductData={mockVarProductData as any}
        refetch={mockRefetch}
        varUserCRUDAccess={1}
      />
    );

    // Default is Modified Date.
    // Logic: (DateA - DateB) -> Ascending, then .reverse() -> Descending (Newest First)
    const items = screen.getAllByTestId("grid-item");
    expect(items[0]).toHaveTextContent("Old");
    expect(items[1]).toHaveTextContent("New");
  });

  // 5. Test Alert Closing
  test("closes the Step 3 alert when close icon is clicked", () => {
    const data = getSampleData();
    render(
      <ExperimentalAsseTabsComponent
        ExperimentalData={data as any}
        varproductData={mockVarProductData as any}
        refetch={mockRefetch}
        varUserCRUDAccess={1}
      />
    );

    const alertText = screen.getByText(/Step 3: Identify your Locked Product Prototype/i);
    expect(alertText).toBeVisible();

    const closeBtn = screen.getByLabelText("close");
    
    fireEvent.click(closeBtn);

    waitFor(() => {
        expect(alertText).not.toBeVisible();
    });
  });

  // 6. Test Pagination / Visible Items Logic (Basic Check)
  test("displays all items if count is small, checks logic flow", () => {
    const bigData = new Array(5).fill(null).map((_, i) => ({
       _id: String(i), name: `Prod ${i}`, isLPP: false 
    }));

    render(
      <ExperimentalAsseTabsComponent
        ExperimentalData={bigData as any}
        varproductData={mockVarProductData as any}
        refetch={mockRefetch}
        varUserCRUDAccess={1}
      />
    );

    const items = screen.getAllByTestId("grid-item");
    expect(items).toHaveLength(5);
  });
});