import { type Request, type Response } from "express";
import axios, { AxiosInstance } from "axios";
import { getPersonalDataHeadersMiddleware } from "../../index";
import { server } from "../../__mocks__/node";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getPersonalDataHeadersMiddleware", () => {
  it("should allowlist a url by string", () => {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use((config) => {
      expect(config.headers["txma-audit-encoded"]).toBe("dummy-txma-header");
      return config;
    });

    const personalDataHeadersMiddleware = getPersonalDataHeadersMiddleware([
      "http://accounts.gov.uk",
    ]);
    personalDataHeadersMiddleware(
      {
        axios: axiosInstance,
        headers: {
          "txma-audit-encoded": "dummy-txma-header",
        },
      } as unknown as Request & { axios: AxiosInstance },
      {} as unknown as Response,
      () => {}
    );

    // @ts-ignore
    axiosInstance.request = () => {};
    axiosInstance.get("http://accounts.gov.uk");
  });

  it("should allowlist a url by string/regex", () => {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use((config) => {
      expect(config.headers["txma-audit-encoded"]).toBe("dummy-txma-header");
      return config;
    });

    const personalDataHeadersMiddleware = getPersonalDataHeadersMiddleware([
      `/.*\.gov\.uk/`,
    ]);
    personalDataHeadersMiddleware(
      {
        axios: axiosInstance,
        headers: {
          "txma-audit-encoded": "dummy-txma-header",
        },
      } as unknown as Request & { axios: AxiosInstance },
      {} as unknown as Response,
      () => {}
    );

    axiosInstance.get("http://accounts.gov.uk");
  });

  it("should denylist all urls if no allowlist is provided", () => {
    const axiosInstance = axios.create();
    const personalDataHeadersMiddleware = getPersonalDataHeadersMiddleware();
    personalDataHeadersMiddleware(
      {
        axios: axiosInstance,
        headers: {
          "txma-audit-encoded": "dummy-txma-header",
        },
      } as unknown as Request & { axios: AxiosInstance },
      {} as unknown as Response,
      () => {}
    );

    axiosInstance.interceptors.request.use((config) => {
      expect(config.headers["txma-audit-encoded"]).toBe(undefined);
      return config;
    });

    axiosInstance.get("http://accounts.gov.uk");
  });
});
