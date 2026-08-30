import axios from 'axios';
import { 
  useProductService, 
  useProductResultData, 
  useAdminVersionHistory 
} from "../Api";

// Mocking Axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking useGlobaldata
const mockUseGlobalData = jest.fn();
jest.mock("../../contexts/masterData/DataContext", () => ({
  useGlobaldata: () => mockUseGlobalData(),
}));

describe("Api.ts Hook Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Default Behavior: Valid User with Token
    mockUseGlobalData.mockReturnValue({
      loggedInUser: { accessToken: "mocked_token" },
    });
  });

  describe("useProductService", () => {
    
    it("should handle case where loggedInUser or accessToken is missing (Branch Coverage)", async () => {
      mockUseGlobalData.mockReturnValue({ loggedInUser: null });
      const productService = useProductService();      
      const mockResponse = { data: { result: "ok" } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await productService.getProductDetailByID("123");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything()
      );
    });

    it("should test `getProductDetailsAllList` with search", async () => {
      const productService = useProductService();
      const mockResponse = { data: { result: "mock" } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await productService.getProductDetailsAllList("test", "all");
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/search/test?type=all"), 
        expect.anything()
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductDetailsAllList` WITHOUT search", async () => {
      const productService = useProductService();
      const mockResponse = { data: { result: "mock" } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await productService.getProductDetailsAllList("", "all");
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.not.stringContaining("/search/"), 
        expect.anything()
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductDetailByID`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { id: "1" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getProductDetailByID("1");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductDetailAuditReport`", async () => {
      const productService = useProductService();
      const mockBlob = new Blob(["audit data"]);
      mockedAxios.get.mockResolvedValue({ data: mockBlob });
      const result = await productService.getProductDetailAuditReport("id1", true);
      expect(result).toEqual({ data: mockBlob });
    });

    it("should test `getProductAssessmentDetailByID`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { id: "assessment" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getProductAssessmentDetailByID("id1", "type1");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getAssessmentDetailBySipID`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { id: "sip-1" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getAssessmentDetailBySipID("sip-1");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getExperimentalAssementDetails`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { exp: "assessment" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getExperimentalAssementDetails("expId");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getExperimentalDetails`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { exp: "details" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getExperimentalDetails();
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductDetailsMyProduct` with search", async () => {
      const productService = useProductService();
      const mockResponse = { data: { myProduct: true } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getProductDetailsMyProduct("test", "myproduct");
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/search/test?type=myproduct"), 
        expect.anything()
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductDetailsMyProduct` WITHOUT search", async () => {
      const productService = useProductService();
      const mockResponse = { data: { myProduct: true } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getProductDetailsMyProduct("", "myproduct");
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.not.stringContaining("/search/"), 
        expect.anything()
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getRawMaterialDataByKeyword`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { materials: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getRawMaterialDataByKeyword("chem", 1);
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductAssessmentResultByID`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { result: "assessment" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getProductAssessmentResultByID("pid", "aid", "type");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductBaselineAssessmentResultByID`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { baseline: true } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getProductBaselineAssessmentResultByID("pid", "aid", "type");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getUseDoseValue`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { dose: 10 } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      const result = await productService.getUseDoseValue("segment", "subSegment");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getProductDetailLogReport`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { logs: "report" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getProductDetailLogReport("pid", "aid");
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `getLogsInputsDetails`", async () => {
      const productService = useProductService();
      const mockResponse = { data: { input: "details" } };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await productService.getLogsInputsDetails("logid");
      expect(result).toEqual(mockResponse.data);
    });

    it("should skip `getProductDetailLogReport` if missing params", async () => {
      const productService = useProductService();
      const result = await productService.getProductDetailLogReport("", "");
      expect(result).toBeNull();
    });

    it("should skip `getLogsInputsDetails` if missing log id", async () => {
      const productService = useProductService();
      const result = await productService.getLogsInputsDetails("");
      expect(result).toBeNull();
    });
  });

  describe("useProductResultData", () => {
    
    it("should test `getVersionBasedResult`", async () => {
      const resultDataService = useProductResultData();
      const mockResponse = { data: { versionResult: "ok" } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const payload = {
        productId: "p1",
        assessmentId: "a1",
        assessmentType: "quality",
        versionNumber: "1.0"
      };

      const result = await resultDataService.getVersionBasedResult(payload);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/quality/p1/a1/1.0"),
        expect.anything()
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("useAdminVersionHistory", () => {

    it("should test `getVersionHistory`", async () => {
      const adminHistoryService = useAdminVersionHistory();
      const mockResponse = { data: ["v1", "v2"] };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await adminHistoryService.getVersionHistory();
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `postVersionHistory`", async () => {
      const adminHistoryService = useAdminVersionHistory();
      const mockResponse = { success: true };
      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const payload = { version: "2.0" };
      const result = await adminHistoryService.postVersionHistory(payload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.anything(),
        payload,
        expect.anything()
      );
      expect(result).toEqual(mockResponse); 
    });

    it("should test `getUserAcknowledgedVersion`", async () => {
      const adminHistoryService = useAdminVersionHistory();
      const mockResponse = { data: { ack: true } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await adminHistoryService.getUserAcknowledgedVersion("user-1");
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining("/user-1"),
          expect.anything()
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should test `postUserAcknowledgedVersion`", async () => {
      const adminHistoryService = useAdminVersionHistory();
      const mockResponse = { success: true };
      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const payload = { date: "2023-01-01" };
      const result = await adminHistoryService.postUserAcknowledgedVersion("user-1", payload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/user-1"),
        payload,
        expect.anything()
      );
      expect(result).toEqual(mockResponse);
    });
  });
 
  describe("useProductResultData", () => {
    
    it("should execute `getVersionBasedResult` and cover return statement", async () => {
      const hookResult = useProductResultData();

      expect(hookResult).toBeDefined();
      expect(hookResult).toHaveProperty("getVersionBasedResult");

      const mockResponse = { data: { versionResult: "success" } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const inputData = {
        productId: "prod-123",
        assessmentId: "assess-456",
        assessmentType: "quality",
        versionNumber: "v1.0"
      };

      const result = await hookResult.getVersionBasedResult(inputData);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/quality/prod-123/assess-456/v1.0"),
        expect.anything()
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle missing user token inside useProductResultData", async () => {
        mockUseGlobalData.mockReturnValue({ loggedInUser: null });

        const hookResult = useProductResultData();
        
        mockedAxios.get.mockResolvedValue({ data: "ok" });

        await hookResult.getVersionBasedResult({
            productId: "1", assessmentId: "1", assessmentType: "type", versionNumber: "1"
        });

        expect(mockedAxios.get).toHaveBeenCalled();
    });
  });
});