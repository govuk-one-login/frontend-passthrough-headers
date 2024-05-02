import { type Request } from "express";
import forwardedParse from "forwarded-parse";
import { logger } from "./logger";

const HEADER_CLOUDFRONT_VIEWER = "cloudfront-viewer-address";
const HEADER_FORWARDED = "forwarded";
const HEADER_X_FORWARDED = "x-forwarded-for";

enum IPSources {
  Cloudfront,
  Forwarded,
  None,
  XForwardedFor,
}

function parseIP(ip: string) {
  const url = new URL(`http://${ip}`);
  return url.hostname.replace(/[[\]]/gi, "");
}

function getFirstOrOnly(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getUserIPSource(req: Request): IPSources {
  if (req.headers[HEADER_CLOUDFRONT_VIEWER]) return IPSources.Cloudfront;
  if (req.headers[HEADER_FORWARDED]) return IPSources.Forwarded;
  if (req.headers[HEADER_X_FORWARDED]) return IPSources.XForwardedFor;
  return IPSources.None;
}

export function processUserIP(req: Request): string | null {
  const userIPSource = getUserIPSource(req);

  switch (userIPSource) {
    case IPSources.Cloudfront: {
      try {
        logger.trace(
          `Sourcing User IP from "${HEADER_CLOUDFRONT_VIEWER}" header.`
        );
        const header = req.headers[HEADER_CLOUDFRONT_VIEWER];
        if (!header) return null;
        const firstIP = getFirstOrOnly(header);
        return parseIP(firstIP);
      } catch (e) {
        logger.warn(
          `Request received with invalid content in "${HEADER_CLOUDFRONT_VIEWER}" header.`
        );
        return null;
      }
    }
    case IPSources.Forwarded: {
      try {
        logger.trace(`Sourcing User IP from "${HEADER_FORWARDED}" header.`);
        const header = req.headers[HEADER_FORWARDED];
        if (!header) return null;
        const firstEntry = forwardedParse(header)[0];
        return parseIP(firstEntry.for);
      } catch (e) {
        logger.warn(
          `Request received with invalid content in "${HEADER_FORWARDED}" header.`
        );
        return null;
      }
    }
    case IPSources.XForwardedFor: {
      logger.trace(`Sourcing User IP from "${HEADER_X_FORWARDED}" header.`);
      return req.ip ?? null;
    }
    case IPSources.None:
    default:
      return null;
  }
}
