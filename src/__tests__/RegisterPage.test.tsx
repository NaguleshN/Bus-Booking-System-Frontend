import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../pages/Credentials/RegisterPage';
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";
import * as loginApi from "../services/loginApiSlice";


jest.mock("../services/loginApiSlice", () => {
  const originalModule = jest.requireActual("../services/loginApiSlice");
  return {
    __esModule: true,
    ...originalModule,
    useRegisterMutation: jest.fn(),
  };
});
beforeAll(() => {
    window.alert = jest.fn();
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function renderComponent() {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    </Provider>
  );
}

describe("RegisterPage", () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    (loginApi.useRegisterMutation as jest.Mock).mockReturnValue([mockRegister]);
  });

  it("renders all form fields", () => {
    renderComponent();

    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  it("shows password mismatch message", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: "Password2" },
    });

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it("submits form when passwords match", async () => {
    mockRegister.mockResolvedValue({
      data: { message: "Registration successful" },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "Nagulesh" },
    });
    fireEvent.change(screen.getByLabelText(/^Last name$/i), {
      target: { value: "Kumar" },
    });
    fireEvent.change(screen.getByLabelText(/^Email address$/i), {
      target: { value: "nagulesh@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Phone Number$/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Nagulesh",
          lastName: "Kumar",
          email: "nagulesh@example.com",
          phone: "1234567890",
          password: "Password123",
          confirmPassword: "Password123",
          role: "user",
          companyName: "",
        })
      );
      expect(window.alert).toHaveBeenCalledWith("Registration successful");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });


  it("doesnot submits form when passwords mis-match", async () => {
    mockRegister.mockResolvedValue({
      data: { message: "Registration successful" },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "Nagulesh" },
    });
    fireEvent.change(screen.getByLabelText(/^Last name$/i), {
      target: { value: "Kumar" },
    });
    fireEvent.change(screen.getByLabelText(/^Email address$/i), {
      target: { value: "nagulesh@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Phone Number$/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: "Password124" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
    
  });

  test("should log error message when registerUser returns error", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  
    mockRegister.mockResolvedValue({
      error: {
        data: {
          message: "Email already in use"
        }
      }
    });
  
    render(<RegisterPage />);
  
    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "Nagulesh" },
    });
    fireEvent.change(screen.getByLabelText(/^Last name$/i), {
      target: { value: "Kumar" },
    });
    fireEvent.change(screen.getByLabelText(/^Email address$/i), {
      target: { value: "nagulesh@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Phone Number$/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: "Password123" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error:", "Email already in use");
    });
  
    consoleSpy.mockRestore();
  });
  

  test('toggle password visibility', () => {
    render(<RegisterPage />);
    const toggleBtn = screen.getByTestId('toggle-password');
    const confirmPasswordInput = screen.getByLabelText('Password');
    
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn!);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  test('toggle confirm password visibility', () => {
    render(<RegisterPage />);
    const toggleBtn = screen.getByTestId('toggle-confirm-password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn!);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

//   it("shows error message on API error", async () => {
//     mockRegister.mockResolvedValue({
//       error: {
//         data: { message: "Email already exists" },
//       },
//     });

//     renderComponent();

//     fireEvent.change(screen.getByLabelText(/First name/i), {
//       target: { value: "Nagulesh" },
//     });
//     fireEvent.change(screen.getByLabelText(/Last name/i), {
//       target: { value: "Kumar" },
//     });
//     fireEvent.change(screen.getByLabelText(/Email address/i), {
//       target: { value: "nagulesh@example.com" },
//     });
//     fireEvent.change(screen.getByLabelText(/Phone Number/i), {
//       target: { value: "1234567890" },
//     });
//     fireEvent.change(screen.getByLabelText(/^Password$/i), {
//       target: { value: "Password123" },
//     });
//     fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
//       target: { value: "Password123" },
//     });

//     fireEvent.click(screen.getByRole("button", { name: /Register/i }));

//     await waitFor(() => {
//       expect(mockRegister).toHaveBeenCalled();
//       expect(screen.getByText("Email already exists")).toBeInTheDocument();
//     });
//   });
});
