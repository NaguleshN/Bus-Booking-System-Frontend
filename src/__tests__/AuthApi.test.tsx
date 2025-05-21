import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import {
  myApi,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from '../services/loginApiSlice';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('myApi endpoints', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [myApi.reducerPath]: myApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(myApi.middleware),
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('calls login endpoint correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true, token: 'abc123' }));

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    await act(async () => {
      const [login] = result.current;
      const res = await login({ email: 'test@test.com', password: '123456' }).unwrap();
      expect(res).toEqual({ success: true, token: 'abc123' });
    });

    const [request] = fetchMock.mock.calls[0] as [Request, any];
    const bodyText = await request.text();
    console.log('Request body:', bodyText);
    const symbols = Object.getOwnPropertySymbols(request);
    
    const requestInternalsSymbol = symbols.find(sym => sym.toString().includes('Request internals'));
    
    if (requestInternalsSymbol) {
      const internals = (request as any)[requestInternalsSymbol];
    
      console.log("URL:", internals.parsedURL.href);
      console.log("Method:", internals.method);
    
      expect(internals.parsedURL.href).toBe('http://localhost:5001/api/auth/login');
      expect(internals.method).toBe('POST');
      expect(bodyText).toBe(JSON.stringify({ email: 'test@test.com', password: '123456' }));
    }

  });

  it('calls register endpoint correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    const { result } = renderHook(() => useRegisterMutation(), { wrapper });

    const payload = {
      name: 'John',
      lastName: 'Paul',
      email: 'new@test.com',
      phone: '1234567890',
      password: 'newpass',
      confirmPassword: 'newpass',
      role: 'user',
      companyName: '',
    };

    await act(async () => {
      const [register] = result.current;
      const res = await register(payload).unwrap();
      expect(res).toEqual({ success: true });
    });

    const [request] = fetchMock.mock.calls[0] as [Request, any]; 

    const bodyText = await request.text(); 

    console.log('Request body:', bodyText);

    const symbols = Object.getOwnPropertySymbols(request);
    const requestInternalsSymbol = symbols.find(sym => sym.toString().includes('Request internals'));
    if (requestInternalsSymbol) {
      const internals = (request as any)[requestInternalsSymbol];
    //   console.log("URL:", internals.parsedURL.href);
    //   console.log("Method:", internals.method);
    //   console.log("Body:", internals);
      expect(internals.parsedURL.href).toBe('http://localhost:5001/api/auth/register');
      expect(internals.method).toBe('POST');
      expect(bodyText).toBe(JSON.stringify(payload));
    }

  });

  it('calls logout endpoint correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    await act(async () => {
      const [logout] = result.current;
      const res = await logout().unwrap();
      expect(res).toEqual({ success: true });
    });

    const [request] = fetchMock.mock.calls[0] as [Request, any]; 

    const symbols = Object.getOwnPropertySymbols(request);
    
    const requestInternalsSymbol = symbols.find(sym => sym.toString().includes('Request internals'));
    
    if (requestInternalsSymbol) {
      const internals = (request as any)[requestInternalsSymbol];
    
      console.log("URL:", internals.parsedURL.href);
      console.log("Method:", internals.method);
      
    
      expect(internals.parsedURL.href).toBe('http://localhost:5001/api/auth/logout');
      expect(internals.method).toBe('POST');
    }
    

  });
});
