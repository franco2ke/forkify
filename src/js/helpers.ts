import { TIMEOUT_SEC } from './config.ts';
import type { ApiRecipeData, ApiSearchData } from './types.ts';

const timeout = function (s: number): Promise<never> {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Refactoring getJSON and sendJSON to one function
export const AJAX = async function <T = ApiRecipeData | ApiSearchData>(
  url: string,
  uploadData: object | undefined = undefined
): Promise<T> {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Promise.race() returns as soon as one promise fulfills or rejects
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = (await res.json()) as T;

    // Custom error, guard clause
    if (!res.ok) throw new Error(`${(data as { message?: string }).message} (${res.status})`);
    return data;
  } catch (err) {
    // console.log(err);
    // Because async await return fulfilled promises even when an error occurs, to return the error we have to throw a new error
    // Now the promise returned from getJSON() will actually reject --> We have propagated the error
    throw err;
  }
};

/*
// async before a function makes it return a promise
// await makes a function wait for a promise
 export const getJSON = async function (url) {
  try {
    // Promise.race() returns as soon as one promise fulfills or rejects
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // Custom error, guard clause
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // console.log(err);
    // Because async await return fulfilled promises even when an error occurs, to return the error we have to throw a new error
    // Now the promise returned from getJSON() will actually reject --> We have propagated the error
    throw err;
  }
};

// Send / Upload data
// NOTE forkify api return same data as sent data
export const sendJSON = async function (url, uploadData) {
  try {
    // To send data use fetch() with additional parameters to create a fetch request
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    // Promise.race() returns as soon as one promise fulfills or rejects
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // Custom error, guard clause
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // console.log(err);
    // Because async await return fulfilled promises even when an error occurs, to return the error we have to throw a new error
    // Now the promise returned from getJSON() will actually reject --> We have propagated the error
    throw err;
  }
};
*/
