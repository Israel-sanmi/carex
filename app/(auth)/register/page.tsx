"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import {
  Building2,
  Home,
  ShieldCheck,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State adhering to Section 1 of Resident Onboarding Guide
  const [formData, setFormData] = useState({
    // Personal Information (Section 1)
    firstName: "",
    middleName: "", // optional
    lastName: "",
    email: "",
    phone: "",
    password: "",

    // Destination Context
    organisation: "Apex Care Group",
    preferredCareHome: "St. Jude's Residential Home",
    desiredIntakeDate: "",
    applicantType: "self", // 'self' | 'representative'

    // Resident Additional Demographics
    residentDob: "",
    residentGender: "Female",
    residentCurrentAddress: "",

    // Next of Kin / Emergency Contact
    contactName: "",
    contactRelationship: "Son / Daughter",
    contactPhone: "",
    contactEmail: "",
    hasPowerOfAttorney: true,

    // Clinical Preferences
    knownAllergies: "",
    dietaryRequirements: "Regular Texture",
    mobilityNotes: "",
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    // Simulate backend /api/v1/registrations/self-register
    setTimeout(() => {
      setLoading(false);
      const generatedRef = `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + " " : ""}${formData.lastName}`;
      const queryParams = new URLSearchParams({
        ref: generatedRef,
        name: fullName || "Arthur Pendelton",
        email: formData.email || "arthur.pendelton@example.co.uk",
        home: formData.preferredCareHome,
        org: formData.organisation,
      });

      router.push(`/register/confirmation?${queryParams.toString()}`);
    }, 800);
  };

  return (
    <AuthCard
      title="Create Resident Account"
      subtitle="Register independently to join a care home organisation and initiate your admissions dossier."
      maxWidth="max-w-2xl"
      footer={
        <p className="text-ink/70 dark:text-slate-400">
          Already have a CarerLoop account?{" "}
          <a
            href="/login"
            className="font-semibold text-teal-brand dark:text-emerald-400 hover:underline"
          >
            Sign in to your portal
          </a>
        </p>
      }
    >
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-ink/60 dark:text-slate-400 mb-2">
          <span className="text-teal-brand dark:text-emerald-400">Step {currentStep} of 4</span>
          <span>
            {currentStep === 1 && "Personal Information (Section 1)"}
            {currentStep === 2 && "Care Destination & Facility"}
            {currentStep === 3 && "Demographics & Next of Kin"}
            {currentStep === 4 && "Clinical Notes & Security"}
          </span>
        </div>
        <div className="w-full bg-cream dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-ink/5 dark:border-white/10">
          <div
            className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6 text-xs sm:text-sm">
        {/* STEP 1: PERSONAL INFORMATION (SECTION 1 REQUIRED SPEC) */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-ink dark:text-white font-heading">
                Resident Personal Information
              </h2>
              <p className="text-xs text-ink/65 dark:text-slate-400 mt-0.5">
                Provide your identity details to create your CarerLoop account and master resident record.
              </p>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arthur"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Middle Name <span className="text-ink/40 dark:text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. James"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pendelton"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40 dark:text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="resident@example.co.uk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 pl-9 pr-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
                <span className="text-[10px] text-ink/50 dark:text-slate-400">
                  We will send your email verification link here.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40 dark:text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+44 7911 234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 pl-9 pr-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-semibold text-ink dark:text-slate-200">
                Create Account Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink/40 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 pl-9 pr-10 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 dark:text-slate-500 hover:text-ink dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DESTINATION CARE ORGANISATION & CARE HOME */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-ink dark:text-white font-heading">
                Destination Care Facility
              </h2>
              <p className="text-xs text-ink/65 dark:text-slate-400 mt-0.5">
                Select the care organisation and home where you are seeking residential placement.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink dark:text-slate-200">
                Destination Care Organisation
              </label>
              <select
                value={formData.organisation}
                onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              >
                <option value="Apex Care Group">Apex Care Group (4 Homes - South West)</option>
                <option value="Kindred Care Living">Kindred Care Living (Bath & Somerset)</option>
                <option value="Serenity Haven Healthcare">Serenity Haven Healthcare</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink dark:text-slate-200">
                Requested Care Home
              </label>
              <select
                value={formData.preferredCareHome}
                onChange={(e) => setFormData({ ...formData, preferredCareHome: e.target.value })}
                className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              >
                <option value="St. Jude's Residential Home">St. Jude&apos;s Residential Home (Bristol)</option>
                <option value="Meadow View Lodge">Meadow View Lodge (Bath)</option>
                <option value="Oakridge Manor Care Centre">Oakridge Manor Care Centre (Gloucester)</option>
                <option value="Hazelwood House">Hazelwood House (Cheltenham)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Target Admission Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.desiredIntakeDate}
                  onChange={(e) => setFormData({ ...formData, desiredIntakeDate: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  I am completing this as
                </label>
                <select
                  value={formData.applicantType}
                  onChange={(e) => setFormData({ ...formData, applicantType: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                >
                  <option value="self">Prospective Resident (Self)</option>
                  <option value="representative">Next of Kin / Family Representative</option>
                  <option value="social_worker">Hospital / Social Care Coordinator</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DEMOGRAPHICS & NEXT OF KIN */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-ink dark:text-white font-heading">
                Demographics & Next of Kin
              </h2>
              <p className="text-xs text-ink/65 dark:text-slate-400 mt-0.5">
                Emergency contacts and background details for the resident profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.residentDob}
                  onChange={(e) => setFormData({ ...formData, residentDob: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">Gender</label>
                <select
                  value={formData.residentGender}
                  onChange={(e) => setFormData({ ...formData, residentGender: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary / Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-md bg-cream/40 dark:bg-slate-800/50 border border-ink/5 dark:border-white/5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-deep dark:text-emerald-400 block">
                Primary Next of Kin / Emergency Contact
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-xs text-ink dark:text-slate-200">Contact Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Helen Pendelton"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full rounded-md border border-ink/10 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-xs text-ink dark:text-slate-200">Relationship</label>
                  <select
                    value={formData.contactRelationship}
                    onChange={(e) => setFormData({ ...formData, contactRelationship: e.target.value })}
                    className="w-full rounded-md border border-ink/10 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Son / Daughter</option>
                    <option>Spouse / Partner</option>
                    <option>Sibling</option>
                    <option>Legal Guardian</option>
                    <option>Close Friend</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-xs text-ink dark:text-slate-200">Emergency Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+44 7911 884210"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full rounded-md border border-ink/10 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-xs text-ink dark:text-slate-200">Emergency Email</label>
                  <input
                    type="email"
                    placeholder="contact@example.co.uk"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full rounded-md border border-ink/10 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CLINICAL NOTES & CONFIRMATION */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-ink dark:text-white font-heading">
                Care Notes & Directives
              </h2>
              <p className="text-xs text-ink/65 dark:text-slate-400 mt-0.5">
                Vital medical notices for the care home clinical review team.
              </p>
            </div>

           

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Dietary Texture / Regimen
                </label>
                <select
                  value={formData.dietaryRequirements}
                  onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                >
                  <option>Regular Standard Diet</option>
                  <option>Soft Texture / Fork-Mashable</option>
                  <option>Pureed (Dysphagia Diet)</option>
                  <option>Diabetic-Friendly</option>
                  <option>Low Sodium</option>
                  <option>Vegetarian / Vegan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Mobility Assistance Needed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Walker frame, 1-carer assist"
                  value={formData.mobilityNotes}
                  onChange={(e) => setFormData({ ...formData, mobilityNotes: e.target.value })}
                  className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>
            </div>

             <div className="space-y-1.5">
              <label className="font-semibold text-ink dark:text-slate-200">
                Known Drug & Food Allergies
              </label>
              <textarea
                placeholder="e.g. Penicillin, Latex, Peanuts (or 'None known')"
                value={formData.knownAllergies}
                onChange={(e) => setFormData({ ...formData, knownAllergies: e.target.value })}
                className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>
           
          </div>
        )}

        {/* Buttons Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-ink/10 dark:border-white/10">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-ink/10 dark:border-white/10 hover:bg-cream dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-ink dark:text-slate-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Creating Resident Profile...</span>
            ) : currentStep < 4 ? (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Resident Registration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
