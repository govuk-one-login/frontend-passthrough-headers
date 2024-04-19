import { type NextFunction, type Request, type Response } from "express";
import { type AxiosInstance } from "axios";
import { createPersonalDataHeaders } from "./createPersonalDataHeaders";

function urlIsInAllowList(url: string, urlAllowList: string[]) {
  const allowListRegexes = urlAllowList.map((url) => {
    const pattern = url.match(/\/.+\//)
      ? url.substring(1, url.length - 1)
      : `^${url}$`;
    return new RegExp(pattern);
  });
  const matchingUrl = allowListRegexes.find((allowedUrl) =>
    allowedUrl.test(url)
  );
  return !!matchingUrl;
}

/**
 *
 * @param axiosInstance - axiosInstance to attach the interceptor to
 * @param urlAllowList - an array of downstream urls (must be INTERNAL) that are allowlisted to receive Personal Data headers.
 *  If any of these strings match the URL the headers will be included.
 *  These strings can contain regex notation.
 * @param req - an express request object
 */
function addPersonalDataHeadersAxiosInterceptor(
  axiosInstance: AxiosInstance,
  urlAllowList: string[],
  req: Request
) {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (!config.url || !urlIsInAllowList(config.url, urlAllowList))
        return config;

      const personalDataHeaders = createPersonalDataHeaders(config.url, req);
      for (const [key, value] of Object.entries(personalDataHeaders)) {
        config.headers[key] = value;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

/**
 *
 * @param urlAllowList - an array of downstream urls (must be INTERNAL) that are allowlisted to receive Personal Data headers.
 *  If any of these strings match the URL the headers will be included.
 *  These strings can contain regex notation.
 * @returns
 */
export function getPersonalDataHeadersMiddleware(urlAllowList: string[] = []) {
  return function personalDataHeadersMiddleware(
    req: Request & { axios: AxiosInstance },
    _res: Response,
    next: NextFunction
  ) {
    if (!req.axios) {
      next();
      return;
    }
    addPersonalDataHeadersAxiosInterceptor(req.axios, urlAllowList, req);
    next();
  };
}
