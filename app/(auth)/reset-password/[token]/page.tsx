"use client";

import { use, Suspense } from "react";
import AuthCard from "@/components/auth/auth-card";
import { ResetPasswordContent } from "../page";

function TokenResolver({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  return <ResetPasswordContent tokenProp={resolvedParams.token} />;
}

export default function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <AuthCard
      title="Create New Password"
      subtitle="Ensure your new password is at least 12 characters long."
      badge="Security Protocol"
    >
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-ink/50">
            Loading reset parameters...
          </div>
        }
      >
        <TokenResolver params={params} />
      </Suspense>
    </AuthCard>
  );
}
