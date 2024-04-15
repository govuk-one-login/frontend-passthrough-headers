import { type Request } from "express";

/**
 * This function extracts request headers that should be passed through
 * to INTERNAL backends. These headers contain Personal Data. They should NEVER
 * be forwarded to external services.
 *
 * @param {object} req - A node HTTP/Express type request.
 * @returns {object}
 */
export function createPersonalDataHeaders(req: Request) {
  const personalDataHeaders: { [key: string]: string | string[] } = {};

  const txmaAuditEncodedHeader = req.headers["txma-audit-encoded"];
  if (txmaAuditEncodedHeader) {
    personalDataHeaders["txma-audit-encoded"] = txmaAuditEncodedHeader;
  }

  return personalDataHeaders;
}
