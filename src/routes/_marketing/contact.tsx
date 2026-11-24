import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Clock, Mail, MapPin, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_marketing/contact")({
  head: () => pageMeta("Contact & support", "Get in touch with PaymentHouse support or sales. We reply 24/7."),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(3, "Add a short subject").max(150),
  message: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(2000),
});
type FormValues = z.infer<typeof schema>;

const INFO = [
  { icon: Mail, title: "Email", text: "support@paymenthouse.com" },
  { icon: MessageSquare, title: "Live chat", text: "Inside your dashboard" },
  { icon: Clock, title: "Hours", text: "24 hours, 7 days a week" },
  { icon: MapPin, title: "Office", text: "New York, NY, United States" },
];

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Step 1: no backend yet — tickets will be saved to Firestore in a later step.
  const onSubmit = async (_values: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent", { description: "Our team will get back to you shortly." });
    reset();
  };

  return (
    <>
      <PageHeader eyebrow="Support" title="We're here to help" description="Send us a message and a specialist will reply — usually within a few hours." />
      <section className="py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-4">
            {INFO.map((i) => (
              <div key={i.title} className="flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <i.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{i.title}</p>
                  <p className="text-sm text-muted-foreground">{i.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border bg-card p-8 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name?.message}>
                <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
              </Field>
              <Field id="email" label="Email" error={errors.email?.message}>
                <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
              </Field>
            </div>
            <Field id="subject" label="Subject" error={errors.subject?.message}>
              <Input id="subject" aria-invalid={!!errors.subject} {...register("subject")} />
            </Field>
            <Field id="message" label="Message" error={errors.message?.message}>
              <Textarea id="message" rows={6} aria-invalid={!!errors.message} {...register("message")} />
            </Field>
            <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
