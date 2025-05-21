import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoginPage from '../pages/Credentials/LoginPage';
import { useLoginMutation } from '../services/loginApiSlice';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../services/loginApiSlice');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('../Components/Toast', () => ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div data-testid="toast" onClick={onClose}>
    {message}
  </div>
));


const mockUseLoginMutation = useLoginMutation as jest.MockedFunction<typeof useLoginMutation>;

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeAll(() => {
    window.alert = jest.fn();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    
  });

  beforeEach(() => {
    mockUseLoginMutation.mockReturnValue([mockLogin, {}] as any);
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    localStorageMock.clear.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Login to Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Register here')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: '👁️' });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByRole('button', { name: '🙈' })).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('updates form data on input change', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email address') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('successfully logs in and stores auth token', async () => {
    const mockResponse = {
      data: {
        data: {
          token: 'mock-token',
          user: { 
            role: 'user',
            id: '123',
            name: 'Test User'
          }
        },
        message: 'Login successful'
      }
    };
  
    mockLogin.mockResolvedValue(mockResponse);
    localStorageMock.setItem.mockClear();
  
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByLabelText('Email address'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
  
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
  
      const setItemCall = localStorageMock.setItem.mock.calls.find(call => call[0] === 'AuthToken');
      expect(setItemCall).toBeTruthy();
  
      const storedValue = JSON.parse(setItemCall[1]);
  
      expect(storedValue.token).toBe('mock-token');
      expect(storedValue.role).toBe('user');
      expect(typeof storedValue.expiry).toBe('number');
      expect(storedValue.expiry).toBeGreaterThan(Date.now());
    });
  
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  

  it('handles API errors properly', async () => {
    const errorMessage = 'User not Found';
    mockLogin.mockResolvedValue({ 
      error: { 
        data: { message: errorMessage } 
      } 
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email address'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'wrongpassword' } 
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('shows loading state during form submission', async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email address'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Logging in...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
  });

  it('displays toast message from localStorage on mount', async() => {
    const toastMessage = 'Session expired';
    localStorageMock.getItem.mockImplementationOnce((key: string) => 
      key === 'toastMessage' ? toastMessage : null
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(toastMessage)).toBeInTheDocument();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('toastMessage');

  });

  it('navigates to register page when register link is clicked', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Register here'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('navigates back when cancel button is clicked', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('handles unexpected API response structure', async () => {
    mockLogin.mockResolvedValue({ data: { invalid: 'structure' } });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email address'), { 
      target: { value: 'tester@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('An unexpected error occurred');
    });
  });

  
});