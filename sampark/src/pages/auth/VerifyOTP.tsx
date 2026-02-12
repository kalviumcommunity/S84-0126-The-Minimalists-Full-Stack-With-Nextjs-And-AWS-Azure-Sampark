import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { buildApiUrl } from '@/lib/api';

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const name = location.state?.name || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resending, setResending] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email in state
  if (!email) {
    navigate("/signup");
    return null;
  }

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('Verifying OTP:', { 
        email, 
        emailType: typeof email,
        otp: otpCode, 
        otpType: typeof otpCode,
        otpLength: otpCode.length 
      });
      
      const response = await fetch(buildApiUrl('/api/auth/verify-otp'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();
      console.log('Verify OTP response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Store user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccess("Email verified successfully! Redirecting...");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      console.log('Resending OTP to:', email); // Debug log
      
      const response = await fetch(buildApiUrl('/api/auth/resend-otp'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      setSuccess("New verification code sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle decorative elements - optional */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[#007ea7]/20 dark:bg-[#007ea7]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#00a8e8]/20 dark:bg-[#00a8e8]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/95 dark:bg-[#00171f]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#007ea7]/20 relative z-10"
      >
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Signup
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#007ea7] to-[#00a8e8] rounded-full mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-[#007ea7] dark:text-[#00a8e8] font-semibold mt-1">
            {email}
          </p>
        </motion.div>

        {/* OTP Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#007ea7] dark:focus:border-[#00a8e8] focus:ring-2 focus:ring-[#007ea7]/20 dark:focus:ring-[#00a8e8]/20 bg-white dark:bg-[#003459] text-gray-900 dark:text-white transition-all outline-none"
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center mb-4"
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-500 text-sm text-center mb-4"
            >
              {success}
            </motion.p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || otp.some((d) => !d)}
            className="w-full py-3 bg-gradient-to-r from-[#007ea7] to-[#00a8e8] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </motion.div>

        {/* Resend OTP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-2 text-[#007ea7] dark:text-[#00a8e8] hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <p>Code expires in 10 minutes</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
