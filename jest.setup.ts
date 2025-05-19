import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

if (typeof global.TextEncoder === 'undefined') {
  // @ts-ignore 
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}
