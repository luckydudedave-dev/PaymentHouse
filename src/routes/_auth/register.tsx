import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { AuthShell, FormField } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "@/lib/countries";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { friendlyFirebaseError } from "@/lib/firebase/errors";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_auth/register")({
  head: () => pageMeta("Create account", "Open a free PaymentHouse account in minutes."),
  component: RegisterPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number"),
    country: z.string().min(1, "Select your country"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
type Values = z.infer<typeof schema>;

function RegisterPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { country: "", terms: undefined as unknown as true },
  });

  const onSubmit = async (v: Values) => {
    try {
      const [auth, fs, { firebaseAuth, firestore }] = await Promise.all([
        import("firebase/auth"),
        import("firebase/firestore"),
        import("@/lib/firebase/client"),
      ]);
      const cred = await auth.createUserWithEmailAndPassword(firebaseAuth(), v.email, v.password);
      await auth.updateProfile(cred.user, { displayName: v.fullName });
      // Only self-editable profile fields. role / status / kycStatus are set server-side
      // by the onUserCreate Cloud Function and are blocked for clients by Firestore rules.
      await fs.setDoc(
        fs.doc(firestore(), "users", cred.user.uid),
        { name: v.fullName, email: v.email, phone: v.phone, country: v.country, createdAt: fs.serverTimestamp() },
        { merge: true },
      );
      await auth.sendEmailVerification(cred.user, { url: `${window.location.origin}/login` });
      setSentTo(v.email);
      toast.success("Account created");
    } catch (e) {
      toast.error(friendlyFirebaseError(e));
    }
  };

  if (sentTo) {
    return (
      <AuthShell title="Check your email" subtitle={`We sent a verification link to ${sentTo}.`}>
        <div className="rounded-2xl border bg-surface p-6 text-center">
          <MailCheck className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Click the link in the email to verify your account, then log in. Your account will
            stay in “pending verification” until our team reviews it.
          </p>
          <Button asChild variant="hero" className="mt-6 w-full" size="lg">
            <Link to="/login">Go to log in</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="It's free and takes less than two minutes."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></>}
    >
      <GoogleButton disabled={!isFirebaseConfigured} />
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
          <Input id="fullName" autoComplete="name" className="h-11" aria-invalid={!!errors.fullName} {...register("fullName")} />
        </FormField>
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" className="h-11" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="phone" label="Phone" error={errors.phone?.message}>
            <Input id="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" className="h-11" aria-invalid={!!errors.phone} {...register("phone")} />
          </FormField>
          <FormField id="country" label="Country" error={errors.country?.message}>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="country" className="h-11" aria-invalid={!!errors.country}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="password" label="Password" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="new-password" className="h-11" aria-invalid={!!errors.password} {...register("password")} />
          </FormField>
          <FormField id="confirm" label="Confirm password" error={errors.confirm?.message}>
            <Input id="confirm" type="password" autoComplete="new-password" className="h-11" aria-invalid={!!errors.confirm} {...register("confirm")} />
          </FormField>
        </div>
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <div className="space-y-1">
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox checked={field.value === true} onCheckedChange={(c) => field.onChange(c === true ? true : undefined)} className="mt-0.5" aria-invalid={!!errors.terms} />
                <span>
                  I agree to the <Link to="/terms" className="font-medium text-primary hover:underline">Terms</Link> and{" "}
                  <Link to="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.terms && <p role="alert" className="text-sm text-destructive">{errors.terms.message}</p>}
            </div>
          )}
        />
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting || !isFirebaseConfigured}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
