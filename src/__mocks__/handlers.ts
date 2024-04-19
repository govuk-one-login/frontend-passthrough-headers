import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://accounts.gov.uk", () => {
    return HttpResponse.json({});
  }),
];
