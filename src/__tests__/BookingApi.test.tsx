import { store } from '../store';
import { renderHook, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { bookingApiSlice } from '../services/bookingsApiSlice';
import fetchMock from 'jest-fetch-mock';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const baseUrl = 'http://localhost:5001/api/user';

beforeAll(() => {
  fetchMock.enableMocks();
  // Mock localStorage
  Storage.prototype.getItem = jest.fn(() => 
    JSON.stringify({ token: 'test-token' })
  );
});

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('bookingApiSlice', () => {
  describe('getBookings', () => {
    it('should make a GET request to fetch bookings', async () => {
      const mockResponse = {
        bookings: [
          { id: '1', busNumber: 'BUS-001', seats: ['A1', 'A2'] }
        ]
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const { result } = renderHook(
        () => bookingApiSlice.endpoints.getBookings.useQuery(),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      
      const [requests] = fetchMock.mock.calls[0] as [Request, any]; 

      const bodyText = await requests.text(); 
  
      console.log('Request body:', bodyText);
  
      const symbols = Object.getOwnPropertySymbols(requests);
      const requestInternalsSymbol = symbols.find(sym => sym.toString().includes('Request internals'));
      if (requestInternalsSymbol) {
        const internals = (requests as any)[requestInternalsSymbol];
        expect(internals.parsedURL.href).toBe('http://localhost:5001/api/user/bookings');
        expect(internals.method).toBe('GET');
      }

    });
  });

  describe('getBookingById', () => {
    it('should make a GET request to fetch specific booking', async () => {
      const bookingId = '123';
      const mockResponse = {
        id: bookingId,
        busNumber: 'BUS-001',
        seats: ['A1']
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const { result } = renderHook(
        () => bookingApiSlice.endpoints.getBookingById.useQuery(bookingId),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      
      const [requests] = fetchMock.mock.calls[0] as [Request, any]; 

      const bodyText = await requests.text(); 
  
      console.log('Request body:', bodyText);
  
      const symbols = Object.getOwnPropertySymbols(requests);
      const requestInternalsSymbol = symbols.find(sym => sym.toString().includes('Request internals'));
      if (requestInternalsSymbol) {
        const internals = (requests as any)[requestInternalsSymbol];
        expect(internals.parsedURL.href).toBe('http://localhost:5001/api/user/bookings/123');
        expect(internals.method).toBe('GET');
      }

    });
  });

  describe('cancelBooking', () => {
    it('should make a DELETE request to cancel entire booking', async () => {
      const request = { bookingId: '123' };
      const mockResponse = { success: true };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const { result } = renderHook(
        () => bookingApiSlice.endpoints.cancelBooking.useMutation(),
        { wrapper }
      );

      const [mutate] = result.current;

      await act(async () => {
        await mutate(request);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      
      const [requests] = fetchMock.mock.calls[0] as [Request, any]; 
      const bodyText = await requests.text(); 
      console.log('Request body:', bodyText);
  
      const symbols = Object.getOwnPropertySymbols(requests);
      const requestInternalsSymbol = symbols.find(sym => sym.toString().includes('Request internals'));
      if (requestInternalsSymbol) {
        const internals = (requests as any)[requestInternalsSymbol];
        expect(internals.parsedURL.href).toBe('http://localhost:5001/api/user/bookings/123');
        expect(internals.method).toBe('DELETE');
      }

    });
  });

  describe('cancelTickets', () => {
    it('should make a DELETE request to cancel tickets', async () => {
      const request = { bookingId: '123' ,seat: 1};
      const mockResponse = { success: true };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
      const { result } = renderHook(
        () => bookingApiSlice.endpoints.cancelSeats.useMutation(),
        { wrapper }
      );

      const [mutate] = result.current;

      await act(async () => {
        await mutate(request);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      
      const [requests] = fetchMock.mock.calls[0] as [Request, any]; 
      const bodyText = await requests.text(); 
      console.log('Request body:', bodyText);
  
      const symbols = Object.getOwnPropertySymbols(requests);
      const requestInternalsSymbol = symbols.find(sym => sym.toString().includes('Request internals'));
      if (requestInternalsSymbol) {
        const internals = (requests as any)[requestInternalsSymbol];
      //   console.log("URL:", internals.parsedURL.href);
      //   console.log("Method:", internals.method);
      //   console.log("Body:", internals);
        expect(internals.parsedURL.href).toBe('http://localhost:5001/api/user/tickets/123');
        expect(internals.method).toBe('DELETE');
      }

    });
  });

});