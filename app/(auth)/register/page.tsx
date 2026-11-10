"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import {
  Building2,
  ShieldCheck,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Organisation & Care Home
    organisation: "St. Jude Care Services Group",
    preferredCareHome: "Meadow View Lodge",
    desiredIntakeDate: "",
    applicantType: "representative", // 'self' | 'representative'

    // Step 2: Resident Details
    residentFullName: "",
    residentDob: "",
    residentGender: "Female",
    residentCurrentAddress: "",

    // Step 3: Emergency Contact / Next of Kin
    contactName: "",
    contactRelationship: "Son / Daughter",
    contactPhone: "",
    contactEmail: "",
    hasPowerOfAttorney: true,

    // Step 4: Care Notes & Security
    knownAllergies: "",
    dietaryRequirements: "Regular Texture",
    mobilityNotes: "",
    password: "",
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
      const queryParams = new URLSearchParams({
        ref: generatedRef,
        name: formData.residentFullName || "Applicant",
        email: formData.contactEmail || "applicant@example.com",
        home: formData.preferredCareHome,
      });

      router.push(`/register/confirmation?${queryParams.toString()}`);
    }, 800);
  };

  return (
    <AuthCard
      title="Resident Self-Registration"
      subtitle="Submit resident details and care preferences to begin the admissions pipeline."
      // badge="Stage 1: Intake Registration"
      maxWidth="max-w-2xl"
      footer={
        <p>
          Already registered?{" "}
          <a
            href="/login"
            className="font-semibold text-teal-brand hover:text-teal-deep underline decoration-teal-brand/40 underline-offset-4"
          >
            Sign in to your portal
          </a>
        </p>
      }
    >
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-ink/60 mb-2">
          <span className="text-teal-brand">Step {currentStep} of 4</span>
          <span>
            {currentStep === 1 && "Care Home Context"}
            {currentStep === 2 && "Resident Information"}
            {currentStep === 3 && "Emergency Contacts"}
            {currentStep === 4 && "Care Directives & Password"}
          </span>
        </div>
        <div className="w-full bg-cream rounded-full h-2 overflow-hidden border border-ink/5">
          <div
            className="bg-teal-brand h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6 text-xs sm:text-sm">
        {/* STEP 1: CARE HOME SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-ink">
                Care Organisation & Facility
              </h2>
              <p className="text-xs text-ink/65 mt-0.5">
                Select the care provider and preferred facility for placement.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">
                Care Organisation
              </label>
              <select
                value={formData.organisation}
                onChange={(e) =>
                  setFormData({ ...formData, organisation: e.target.value })
                }
                className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              >
                <option value="St. Jude Care Services Group">
                  St. Jude Care Services Group
                </option>
                <option value="Oakridge Healthcare Ltd">
                  Oakridge Healthcare Ltd
                </option>
                <option value="Meadow View Residential Trust">
                  Meadow View Residential Trust
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">
                Preferred Care Home
              </label>
              <select
                value={formData.preferredCareHome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredCareHome: e.target.value,
                  })
                }
                className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              >
                <option value="Meadow View Lodge">
                  Meadow View Lodge (Residential & Dementia)
                </option>
                <option value="Oakridge Manor">
                  Oakridge Manor (Nursing & Assisted Living)
                </option>
                <option value="Willow Creek Court">
                  Willow Creek Court (Independent Supported)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink">
                  Desired Admission Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.desiredIntakeDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desiredIntakeDate: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink">
                  I am registering as
                </label>
                <select
                  value={formData.applicantType}
                  onChange={(e) =>
                    setFormData({ ...formData, applicantType: e.target.value })
                  }
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                >
                  <option value="representative">
                    Next of Kin / Family Representative
                  </option>
                  <option value="self">Resident Self-Registering</option>
                  <option value="social_worker">
                    Social Worker / Care Coordinator
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: RESIDENT DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-ink">
                Resident Information
              </h2>
              <p className="text-xs text-ink/65 mt-0.5">
                Personal records are securely encrypted and kept at the center
                of care.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">
                Resident Full Name
              </label>
              <input
                type="text"
                required
                value={formData.residentFullName}
                onChange={(e) =>
                  setFormData({ ...formData, residentFullName: e.target.value })
                }
                placeholder="e.g. Eleanor Vance"
                className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.residentDob}
                  onChange={(e) =>
                    setFormData({ ...formData, residentDob: e.target.value })
                  }
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink">Gender</label>
                <select
                  value={formData.residentGender}
                  onChange={(e) =>
                    setFormData({ ...formData, residentGender: e.target.value })
                  }
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">
                Current Residence Address
              </label>
              <textarea
                required
                value={formData.residentCurrentAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    residentCurrentAddress: e.target.value,
                  })
                }
                placeholder="14 Orchard Lane, Harrogate, HG1 2PQ"
                className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3: EMERGENCY CONTACT */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-ink">
                Emergency Contact & Next of Kin
              </h2>
              <p className="text-xs text-ink/65 mt-0.5">
                This contact will receive the verification email and admission
                updates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink">
                  Contact Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  placeholder="e.g. David Vance"
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink">
                  Relationship to Resident
                </label>
                <select
                  value={formData.contactRelationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactRelationship: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                >
                  <option value="Son / Daughter">Son / Daughter</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                  <option value="Friend / Advocate">Friend / Advocate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  placeholder="+44 7700 900821"
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="david.vance@example.co.uk"
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-md border border-ink/10 bg-cream/40 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasPowerOfAttorney}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hasPowerOfAttorney: e.target.checked,
                  })
                }
                className="mt-0.5 h-4 w-4 rounded border-ink/20 text-teal-brand accent-teal-brand"
              />
              <div className="text-xs">
                <span className="font-semibold text-ink">
                  Authorized Power of Attorney / Medical Guardian
                </span>
                <p className="text-ink/65 mt-0.5">
                  Authorizes access to resident clinical transparency updates.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* STEP 4: CARE DIRECTIVES & ACCOUNT SETUP */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-ink">
                Care Directives & Account Password
              </h2>
              <p className="text-xs text-ink/65 mt-0.5">
                Help our clinical team prepare room directives and secure your
                portal account.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Known Allergies</label>
              <textarea
                value={formData.knownAllergies}
                onChange={(e) =>
                  setFormData({ ...formData, knownAllergies: e.target.value })
                }
                placeholder="e.g. Penicillin, Tree Nuts, Latex (or None)"
                className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>

            <div className="">
              <label className="font-semibold text-ink">
                Dietary Requirements
              </label>
              <select
                value={formData.dietaryRequirements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dietaryRequirements: e.target.value,
                  })
                }
                className="w-full rounded-md border border-ink/15 bg-cream/30 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              >
                <option value="Regular Texture">Regular Texture</option>
                <option value="Soft / Moistened">
                  Soft / Moistened Texture
                </option>
                <option value="Diabetic-Friendly">Diabetic-Friendly</option>
                <option value="Low Sodium / Cardiac">
                  Low Sodium / Cardiac
                </option>
                <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">
                Create Account Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-md border border-ink/15 bg-cream/30 pl-3.5 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
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

           
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 flex items-center justify-between gap-3 border-t border-ink/10">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink hover:bg-cream transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep shadow-sm transition-all cursor-pointer disabled:opacity-50 ml-auto"
          >
            <span>
              {currentStep === 4
                ? loading
                  ? "Submitting..."
                  : "Submit Registration"
                : "Continue"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
