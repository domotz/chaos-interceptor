import { createErrorResponse } from "./enhanceError";
import { defaultErrors } from "./errors";

const random = (min: number, max: number) => Math.random() * (max - min) + min;
const percent = (percent: number) => random(0, 100) <= percent;
const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));
const DEFAULT_ERROR_RATE = 20;
const DEFAULT_ERROR_MESSAGE = "Error caused by chaos-interceptor";

// Keep reference to original fetch in case of override 
const _fetch = fetch;

export const createChaosFetch = 
  (errors = defaultErrors, options: {logError?: boolean} = {}) =>
  (input: RequestInfo, init?: RequestInit) => {
    return _fetch(input, init)
    .then(async res => {
      for (const error of errors) {
        if (percent(error.rate ?? DEFAULT_ERROR_RATE)) {
          if(options.logError){
            console.log(`Network request failure because Chaos Interceptor with error code ${error.status} - `, input, init)
          }
          await sleep(error.delay ?? random(10, 1000));
  
          throw createErrorResponse({
            response: res,
            status: error.status,
            statusText: DEFAULT_ERROR_MESSAGE
          });
        }
      }
      return res;
    });
  };
