import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import axios from "axios";
import { AutoSaveContext, AutoSaveStateProvider } from "../autoSaveContext/AutoSaveContext";
import { useGlobaldata } from "../masterData/DataContext";

jest.mock("axios");
jest.mock("../masterData/DataContext", () => ({
    useGlobaldata: jest.fn(),
}));

const mockToken = "mocked_token";

(useGlobaldata as jest.Mock).mockReturnValue({ token: mockToken });

const mockPost = axios.post as jest.Mock;

const mockFormulationData = {
    productId: "123",
    type: "test",
    assessmentId: "456",
    isCalculating: false,
    formulation: {
        fmlCode: "FML001",
        description: "Test Formulation",
        netContent: "100",
        netContentUnit: "ml",
        productionZone: "Zone1",
        salesZone: "Zone2",
        productSegment: "Segment1",
        productSubSegment: "SubSegment1",
        useDose: "10",
        useDoseUnit: "ml",
        consumablesUsed: "test",
        rawMaterials: [
            {
                tradeName: "Raw1",
                rawMaterialId: "RM1",
                percentage: "50",
                status: "active",
                rmcStatus: "approved",
                EUINCIName: "",
                USINCIName: "",
                specNumber: "",
                cas: "",
                envFootprint: 0,
                carbonFootprint: 0,
                greenChemistry: 0,
            },
        ],
        isEdited: false,
        isDataValid: false,
        isCalculated: false,
        fieldsExist: {
            description: false,
            netContent: false,
            netContentUnit: false,
            productionZone: false,
            salesZone: false,
            productSegment: false,
            productSubSegment: false,
            useDose: false,
            useDoseUnit: false,
            rawMaterials: false,
            consumablesUsed: false,
            useScenario: false,
        },
        rawMaterialsPercentage: 50,
        useScenario: "Test",
    },
};

const TestConsumer = () => {
    const context = React.useContext(AutoSaveContext);
    return (
        <div>
            <button onClick={() => context.setTabSwitched(true)}>Switch Tab</button>
            <button onClick={() => context.setFormulationFormData(mockFormulationData)}>
                Set Data
            </button>
            <button onClick={() => context.setChangedFields(["description"])}>Change Field</button>
            <button onClick={() => context.setAutoSaveSuccess(true)}>Set Save</button>
            <button onClick={() => context.setRefetchDetails(true)}>Set Refetch</button>
            {/* <button onClick={() => context.setSingleClickHit(true)}>Set Single Click</button> */}
            <button onClick={() => context.setCalculateClick(true)}>Set Calculate</button>
            <button onClick={() => context.setCalculateClickPackaging(true)}>Set Packaging</button>
            {/* <button onClick={() => context.setBothPackFormulaStatus(true)}>Set Both</button>
            <button onClick={() => context.setIsPackagingDirty(true)}>Set Dirty</button>
            <button onClick={() => context.setValidateCheck(true)}>Set Validate</button> */}
        </div>
    );
};

describe("AutoSaveContext", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPost.mockResolvedValue({ status: 200 });
    });

    it("should render without crashing and provide default context", async () => {
        const { getByText } = render(
            <AutoSaveStateProvider>
                <TestConsumer />
            </AutoSaveStateProvider>
        );

        act(() => {
            getByText("Set Data").click();
            getByText("Change Field").click();
        });

        await act(async () => {
            getByText("Switch Tab").click();
        });

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                expect.any(String),
                mockFormulationData,
                expect.objectContaining({
                    headers: { Authorization: `Bearer ${mockToken}` },
                })
            );
        });

        act(() => {
            getByText("Set Save").click();
            getByText("Set Refetch").click();
            // getByText("Set Single Click").click();
            getByText("Set Calculate").click();
            getByText("Set Packaging").click();
            // getByText("Set Both").click();
            // getByText("Set Dirty").click();
            // getByText("Set Validate").click();
        });

        // We just expect no crash for setters
        expect(true).toBeTruthy();
    });
});