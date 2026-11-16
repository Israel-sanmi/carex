"use client";

import { use, Suspense } from "react";
import AuthCard from "@/components/auth/auth-card";
import { VerifyEmailContent } from "../page";

function TokenResolver({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  return <VerifyEmailContent tokenProp={resolvedParams.token} />;
}

export default function VerifyEmailTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <AuthCard
      title="Email Verification"
      subtitle="Please verify your email and wait for authorization from admin to sign in"
      badge="Verification Portal"
    >
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-ink/50">
            Validating verification token...
          </div>
        }
      >
        <TokenResolver params={params} />
      </Suspense>
    </AuthCard>
  );
}
