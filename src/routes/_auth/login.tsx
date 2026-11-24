import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell, FormField } from "@/components/auth/AuthShell";
import { afterSignIn } from "@/lib/firebase/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { friendlyFirebaseError } from "@/lib/firebase/errors";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_auth/login")({
  head: () => pageMeta("Log in", "Log in to your PaymentHouse account."),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type Values = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });


const onSubmit = async ({ email, password }: Values) => {
  try {
    const [{ signInWithEmailAndPassword }, { firebaseAuth }] = await Promise.all([
      import("firebase/auth"),
      import("@/lib/firebase/client"),
    ]);

    await signInWithEmailAndPassword(firebaseAuth(), email, password);

    const destination = await afterSignIn();

    toast.success("Welcome back!");
    navigate({ to: destination });
  } catch (e) {
    toast.error(friendlyFirebaseError(e));
  }
};

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your crypto and payments."
      footer={<>New to PaymentHouse? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></>}
    >
      <GoogleButton disabled={!isFirebaseConfigured} />
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" className="h-11" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
          hint={<Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>}
        >
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="h-11 pr-11" aria-invalid={!!errors.password} {...register("password")} />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting || !isFirebaseConfigured}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
