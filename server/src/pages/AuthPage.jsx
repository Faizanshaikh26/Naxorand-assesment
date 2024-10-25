import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { server } from "../constants/server";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const response = await axios.post(`${server}/api/auth/v1/login`, data);
        if (response.data.success) {
          login(response.data.token);
          
          localStorage.setItem("email", data.email);
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Signup process
        const response = await axios.post(`${server}/api/auth/v1/register`, data);
        if (response.data.success) {
          toast.success("Registration Successful! Please log in.");
          setIsLogin(true); 
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="bg-gray-50 min-h-screen flex items-center justify-center text-black">
        <Link to="/">
          <div className="w-[50px] h-[50px] rounded-full bg-green-500 text-center absolute top-10 left-10">
            <i className="fa-solid fa-arrow-left text-[22px] mt-3 cursor-pointer"></i>
          </div>
        </Link>
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-[#002D74]">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <p className="text-xs mt-4 text-[#002D74]">
              {isLogin
                ? "If you are already a member, easily log in"
                : "Create your account to get started"}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {!isLogin && (
                <>
                  <input
                    className="p-2 mt-4 rounded-xl border"
                    type="text"
                    {...register("firstName", { required: "First name is required" })}
                    placeholder="First Name"
                  />
                  {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

                  <input
                    className="p-2 rounded-xl border"
                    type="text"
                    {...register("lastName", { required: "Last name is required" })}
                    placeholder="Last Name"
                  />
                  {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

                  <input
                    className="p-2 rounded-xl border"
                    type="text"
                    {...register("username", { required: "Username is required" })}
                    placeholder="Username"
                  />
                  {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                </>
              )}

              <input
                className="p-2 mt-4 rounded-xl border"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Email"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}

              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                  placeholder="Password"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="gray"
                  className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  viewBox="0 0 16 16"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}

              <button className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center text-[#002D74]">
              <span>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  className="font-bold ml-2"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </span>
            </div>
          </div>

          <div className="hidden md:block md:w-1/2">
            <img
              className="rounded-2xl"
              src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Auth Illustration"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthPage;
