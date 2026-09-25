import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { SessionGate } from "@/components/SessionGate";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <SessionGate>
        <Suspense
          fallback={
            <div className="text-sm text-zinc-500" role="status">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </SessionGate>
    </main>
  );
}
