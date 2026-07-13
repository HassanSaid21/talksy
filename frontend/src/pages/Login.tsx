import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import type { AxiosError } from "axios";
import BorderAnimatedContainer from "../components/BoarderAnimatedContainer";
import { useAuthStore } from "../store/useAuthStore";
import { signupPath } from "../paths";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSigningUp(true);
    // Handle form submission logic here
    try {
      //TODOS: put the real application domain
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );
      login({ accessToken: res.data.accessToken, user: res.data.user });

      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      const errorMessage: { message?: string } = (error as AxiosError).response
        ?.data || { message: "An error occurred" };
      toast.error(errorMessage.message || "An error occurred");
    } finally {
      setIsSigningUp(false);
    }
  }
  return (
    <div className=" w-[90%] max-w-6xl   h-150 flex items-center justify-center p-8 bg-gray-900 rounded-lg     z-10">
      <div className="relative  w-full h-full ">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col lg:flex-row">
            {/* FORM CLOUMN - LEFT SIDE */}
            <div className="lg:w-1/2 p-2 flex items-center justify-center lg:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-2">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Log in to Your Account
                  </h2>
                  <p className="text-slate-400">
                    Sign in to access your account
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* EMAIL INPUT */}
                  <div>
                    <label htmlFor="email" className="auth-input-label">
                      Email
                    </label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="hassansaid@gmail.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label htmlFor="password" className="auth-input-label">
                      Password
                    </label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Log in"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to={signupPath()} className="auth-link">
                    Don't have an account? Sign up
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden lg:w-1/2 lg:flex items-center justify-center p-16  ">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-full object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Connect any time , any where
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
