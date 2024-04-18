import { type Request } from "express";
import { logger } from "./utils/logger";
import { processUserIP } from "./utils/userIP";

const HEADER_TXMA = "txma-audit-encoded";
const OUTBOUND_FORWARDED_HEADER = "x-forwarded-for";

/**
 * This function extracts request headers that should be passed through
 * to INTERNAL backends. These headers contain Personal Data. They should NEVER
 * be forwarded to external services.
 *
 * @param {string} url - The downstream url this request is being sent on to.
 * @param {object} req - A node HTTP/Express type request.
 * @returns {object}
 */
export function createPersonalDataHeaders(url: string, req: Request) {
  const domain = new URL(url).hostname;
  const personalDataHeaders: { [key: string]: string | string[] } = {};

  const txmaAuditEncodedHeader = req.headers[HEADER_TXMA];
  if (txmaAuditEncodedHeader) {
    personalDataHeaders[HEADER_TXMA] = txmaAuditEncodedHeader;
    logger.trace(
      `Personal Data header "${HEADER_TXMA}" is being forwarded to domain "${domain}"`
    );
  }

  const userIP = processUserIP(req);
  if (userIP) {
    personalDataHeaders[OUTBOUND_FORWARDED_HEADER] = userIP;
    logger.trace(
      `Personal Data header "${OUTBOUND_FORWARDED_HEADER}" is being forwarded to domain "${domain}"`
    );
  }

  return personalDataHeaders;
}
