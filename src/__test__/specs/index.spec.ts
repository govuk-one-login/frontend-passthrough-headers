import { type Request } from "express";
import { createPersonalDataHeaders } from "../../index";

describe("createPersonalDataHeaders", () => {
  it("should return an object with the txma-audit-encoded header if there is one present", () => {
    const headers = createPersonalDataHeaders({
      headers: { ["txma-audit-encoded"]: "dummy-txma-header" },
    } as unknown as Request);

    expect(headers).toEqual({
      ["txma-audit-encoded"]: "dummy-txma-header",
    });
  });

  it("should return an empty object if there is no txma-audit-encoded present", () => {
    const headers = createPersonalDataHeaders({
      headers: {},
    } as unknown as Request);

    expect(headers).toEqual({});
  });
});
