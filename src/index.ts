import { type Request } from "express";
import { logger } from "./utils/logger";
import { processUserIP } from "./utils/userIP";


const HEADERS = {
  HEADER_TXMA: 'txma-audit-encoded',
  OUTBOUND_FORWARDED_HEADER: 'x-forwarded-for'
} as const

interface PersonalDataHeaders {
  [HEADERS.HEADER_TXMA]?: string | string [],
  [HEADERS.OUTBOUND_FORWARDED_HEADER]?: string | string []
}

/**
 * This function extracts request headers that should be passed through
 * to INTERNAL backends. These headers contain Personal Data. They should NEVER
 * be forwarded to external services.
 *
 * @param {string} url - The downstream url this request is being sent on to.
 * @param {object} req - A node HTTP/Express type request.
 * @returns {PersonalDataHeaders}
 */
export function createPersonalDataHeaders(url: string, req: Request):PersonalDataHeaders {
  const domain = new URL(url).hostname;
  const personalDataHeaders: PersonalDataHeaders = {}

  const txmaAuditEncodedHeader = req.headers[HEADERS.HEADER_TXMA];
  if (txmaAuditEncodedHeader) {
    personalDataHeaders[HEADERS.HEADER_TXMA]= txmaAuditEncodedHeader;
    logger.trace(
      `Personal Data header "${HEADERS.HEADER_TXMA}" is being forwarded to domain "${domain}"`
    );
  }

  const userIP = processUserIP(req);
  if (userIP) {
    personalDataHeaders[HEADERS.OUTBOUND_FORWARDED_HEADER] = userIP;
    logger.trace(
      `Personal Data header "${HEADERS.OUTBOUND_FORWARDED_HEADER}" is being forwarded to domain "${domain}"`
    );
  }

  return personalDataHeaders;
}
