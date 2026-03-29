import React, { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const serverUrl = "http://localhost:8000"; // update with your backend URL

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      console.log(result);
      setLoading(false);
      setErr("");
      setStep(2);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
      console.log(result);
      setErr("");
      setStep(3);
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return null;
    }
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
      setErr("");
      console.log(result);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button
              className="w-full font-semibold py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323]"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">{err}</p>}
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                OTP
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>
            <button
              className="w-full font-semibold py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323]"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">{err}</p>}
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>
            <button
              className="w-full font-semibold py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323]"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
            </button>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="mt-16 mb-4 text-center text-gray-600 text-sm font-medium">
        <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
        <p className="flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
          ✨ MADE BY{" "}
          <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
        </p>
      </footer>
    </div>
  );
}

export default ForgotPassword;
