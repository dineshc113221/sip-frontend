/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { get, getFileBlob, post, put } from "../index"; // Update path if needed
import { IHeadersType } from "../../models/Common.model"; // Update path if needed

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Utility Functions", () => {
    const mockUrl = "https://api.example.com";
    const mockToken = "mocked_token";
    const mockHeaders: IHeadersType = {
        "x-consumer-correlationId": "test-correlation-id",
        "x-consumer-userId": "test-user-id",
        "x-consumer-timestamp": new Date().toISOString(),
        "x-consumer-system": "test-system",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("get", () => {
        it("should fetch data successfully", async () => {
            const mockData = { data: { message: "Success" } };
            mockedAxios.get.mockResolvedValueOnce(mockData as any);

            const result = await get(mockUrl, mockHeaders, mockToken);

            expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl, {
                method: "GET",
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`,
                    ...mockHeaders,
                }),
            });
            expect(result).toEqual(mockData.data);
        });
    });

    describe("getFileBlob", () => {
        it("should fetch file blob successfully", async () => {
            const mockBlob = new Blob(["mock content"], { type: "application/pdf" });
            const mockResponse = { data: mockBlob };
            mockedAxios.get.mockResolvedValueOnce(mockResponse as any);

            const result = await getFileBlob(mockUrl, mockHeaders, mockToken);

            expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl, expect.objectContaining({
                responseType: "blob",
            }));
            expect(result).toEqual(mockResponse);
        });
    });

    describe("post", () => {
        it("should post data successfully", async () => {
            const mockBody = { name: "Test" };
            const mockResponse = { data: { id: 1, ...mockBody } };
            mockedAxios.post.mockResolvedValueOnce(mockResponse as any);

            const result = await post(mockUrl, mockHeaders, mockBody, mockToken);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                mockUrl, 
                mockBody, 
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${mockToken}`,
                        "Content-Type": "application/json"
                    })
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should handle post error response (Covers Line 47)", async () => {
            const mockBody = { key: "value" };
            const mockError = { 
                response: { status: 400, data: "Bad Request" } 
            };
            
            mockedAxios.post.mockRejectedValueOnce(mockError);

            const result = await post(mockUrl, mockHeaders, mockBody, mockToken);

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockError.response);
        });
    });

    describe("put", () => {
        it("should put (update) data successfully", async () => {
            const mockBody = { name: "Updated" };
            const mockResponse = { data: { id: 1, ...mockBody } };
            mockedAxios.put.mockResolvedValueOnce(mockResponse as any);

            const result = await put(mockUrl, mockHeaders, mockBody, mockToken);

            expect(mockedAxios.put).toHaveBeenCalledWith(
                mockUrl, 
                mockBody, 
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${mockToken}`,
                    })
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should handle put error response", async () => {
            const mockBody = { key: "value" };
            const mockError = { 
                response: { status: 500, data: "Server Error" } 
            };
            mockedAxios.put.mockRejectedValueOnce(mockError);

            const result = await put(mockUrl, mockHeaders, mockBody, mockToken);

            expect(mockedAxios.put).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockError.response);
        });
    });
});