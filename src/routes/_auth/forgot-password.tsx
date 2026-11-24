import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AuthShell, FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { friendlyFirebaseError } from "@/lib/firebase/errors";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_auth/forgot-password")({
  head: () => pageMeta("Reset password", "Reset your PaymentHouse password."),
  component: ForgotPage,
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email") });
type Values = z.infer<typeof schema>;

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }: Values) => {
    try {
      const [{ sendPasswordResetEmail }, { firebaseAuth }] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase/client"),
      ]);
      // Firebase hosts the reset form, then returns the user to our login page.
      await sendPasswordResetEmail(firebaseAuth(), email, { url: `${window.location.origin}/login` });
      setSent(true);
    } catch (e) {
      const code = (e as { code?: string })?.code;
      // Don't reveal whether an account exists.
      if (code === "auth/user-not-found") setSent(true);
      else toast.error(friendlyFirebaseError(e));
    }
  };

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Forgot your password?"}
      subtitle={sent ? "If an account exists for that email, a reset link is on its way." : "Enter your email and we'll send you a reset link."}
      footer={<Link to="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> Back to log in</Link>}
    >
      {sent ? (
        <div className="rounded-2xl border bg-surface p-6 text-center">
          <MailCheck className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormField id="email" label="Email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" className="h-11" aria-invalid={!!errors.email} {...register("email")} />
          </FormField>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting || !isFirebaseConfigured}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
