import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/loginApiSlice";
import Toast from '../../Components/Toast';
import { loginResponse } from "../../Types/AuthData";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const toastMsg = localStorage.getItem("toastMessage");
    if (toastMsg) {
      setToastMsg(toastMsg);
      localStorage.removeItem("toastMessage"); 
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // console.log(formData.email)
      const response: loginResponse = await login(formData);
      // console.log("Login response:", response);
      // console.log("Data",response.data)
      if ("data" in response && response.data != undefined && response.data.data != undefined) {
        const { token, user } = response.data.data;
        // console.log("Data.data",response.data.data)

        
        const expiry = new Date().getTime() + 60 * 60 * 1000; 
      
        const authData = {
          token,
          role: user.role,
          expiry
        };
      
        localStorage.setItem("AuthToken", JSON.stringify(authData));
      
        alert(response.data.message);
        navigate("/");
      } else if ("error" in response) {
        const errorMessage = "User not Found";
        alert(errorMessage);
        console.log("Login error:", errorMessage);
      }
      else{
        const errorMessage = "An unexpected error occurred";
        alert(errorMessage);
        console.log("Login error:", errorMessage);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
       {toastMsg && (
        <Toast
          message={toastMsg}
          type="error"
          onClose={
            () => setToastMsg(null)
 }
        />
      )}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                data-testid="toggle-password"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

         
          {isLoading && (
            <div className="flex justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
              data-testid="spinner"  />
            </div>
          )}
        </form>

       
        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline cursor-pointer font-medium"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
