"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { useRegisterMutation } from "@/lib/hooks/use-auth-mutations";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Male",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setValidationError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Password validation
    if (formData.password.length < 12) {
      setValidationError("Password must be at least 12 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!formData.dateOfBirth) {
      setValidationError("Date of birth is required.");
      return;
    }

    registerMutation.mutate(
      {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim() || undefined,
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        password: formData.password,
      },
      {
        onSuccess: (response) => {
          const resData = response?.data;

          const email = resData?.email || formData.email;

          toast.success(
            `Registration Completed, Verification link sent to this ${email}`,
          );
        },
      },
    );
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Register independently to initiate residential care placement and account verification."
      badge="Self Registration"
      maxWidth="max-w-xl"
      footer={
        <div className="space-y-2">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-teal-brand hover:text-teal-deep underline decoration-teal-brand/40 underline-offset-4"
            >
              Sign in
            </a>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Error Alert from Validation or Backend API */}
        {(validationError || registerMutation.isError) && (
          <div className="p-3.5 rounded-md border border-coral/30 bg-coral-soft/50 text-ink space-y-1 animate-fade-in">
            <p className="font-semibold text-coral flex items-center gap-1.5 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {validationError ||
                registerMutation.error?.message ||
                "Registration failed"}
            </p>
          </div>
        )}

        {/* Name Fields (First, Middle, Last) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">First Name *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full rounded-md border border-ink/15 bg-cream/30 pl-9 pr-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Last Name *</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full rounded-md border border-ink/15 bg-cream/30 px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
            />
          </div>{" "}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full rounded-md border border-ink/15 bg-cream/30 px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40">
                <Phone className="h-4 w-4" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+44 7123 456789"
                className="w-full rounded-md border border-ink/15 bg-cream/30 pl-9 pr-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="font-semibold text-ink">Email Address *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="resident@example.co.uk"
              className="w-full rounded-md border border-ink/15 bg-cream/30 pl-9 pr-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
            />
          </div>
        </div>
        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Date of Birth *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                max="2030-12-31"
                className="w-full rounded-md border border-ink/15 bg-cream/30 pl-9 pr-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-md border border-ink/15 bg-cream/30 px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              {/* <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option> */}
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="font-semibold text-ink">Current Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none text-ink/40">
              <MapPin className="h-4 w-4" />
            </div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 14 Highfield Avenue, London, SW1"
              className="w-full rounded-md border border-ink/15 bg-cream/30 pl-9 pr-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
            />
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Password *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={12}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 12 characters"
                className="w-full rounded-md border border-ink/15 bg-cream/30 pl-9 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Confirm Password *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={12}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full rounded-md border border-ink/15 bg-cream/30 pl-9 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink cursor-pointer"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3.5 rounded-full bg-teal-brand text-white font-medium text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>
              {registerMutation.isPending ? (
                <Loader2 className="animate-spin " />
              ) : (
                "Complete Registration"
              )}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
