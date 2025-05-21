import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from "../../services/loginApiSlice";  
import { registerResponse } from "../../Types/AuthData";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchMsg, setPasswordMatchMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [register] = useRegisterMutation(); 
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
    companyName: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchMsg("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      
      const response2 : registerResponse = await register(formData);
      console.log("response", response2);
      const data = response2;
      console.log(data);
      if (response2.data) {
        alert(response2.data.message);
        console.log("Success:", response2.data.message);
        navigate("/");
      } else if (response2.error)  {
        
        let errorMessage = "Unknown error occurred.";

        if ("error" in response2) {
          const error = response2.error;

          if (typeof error === "object" && error !== null && "data" in error) {
            const errData = (error as FetchBaseQueryError).data;

            if (typeof errData === "object" && errData !== null && "message" in errData) {
              errorMessage = (errData as { message: string }).message;
            }
          }
        }
        alert(errorMessage);
        console.log("Error:", errorMessage);
      }
    } catch (err) {
      // console.log(err);
    }finally {
        setIsLoading(false); 
    }
  };

  const handleChange = (e: 	React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "confirmPassword") {
      setPasswordMatchMsg(
        value === formData.password ? "Passwords match" : "Passwords do not match"
      );
    }

    if (name === "password" && formData.confirmPassword) { setPasswordMatchMsg(
        value === formData.confirmPassword ? "Passwords match" : "Passwords do not match"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-10 my-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h1 className="text-2xl font-semibold text-gray-900 text-center">Register</h1>

              <div className="sm:col-span-3 mt-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                  Role:
                </label>
                <div className="mt-2">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  >
                    <option value="user">user</option>
                    <option value="operator">operator</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                    First name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    required
                    className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>

                {formData.role === "Operator" && (
                  <div className="sm:col-span-6">
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-900">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                )}

                <div className="sm:col-span-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                    <button
                      type="button"
                      data-testid="toggle-password"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                    Confirm Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                    <button
                      type="button"
                      data-testid="toggle-confirm-password"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {passwordMatchMsg && (
                    <p
                      className={`mt-1 text-sm font-medium transition-opacity duration-300 ${
                        passwordMatchMsg === "Passwords match"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordMatchMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button type="button" className="text-sm font-semibold text-gray-900">
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
          {isLoading && (
            <div className="flex justify-center mt-4 ">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
            )}

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
