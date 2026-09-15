"use client";

import * as React from "react";
import { personalData } from "@/data/personal";
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { usePreloader } from "@/components/ui/site-preloader";
import { ProtectedPhone } from "@/components/ui/protected-phone";

export default function ContactPage() {
  const [formStatus, setFormStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const { showPreloader, hidePreloader } = usePreloader();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");
    showPreloader("Sending your message...", "Delivering directly to Alok Das.");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const gasEndpoint =
      process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
      process.env.NEXT_PUBLIC_POLLS_ENDPOINT ||
      "";

    const payload = {
      action: "contact",
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      subject: (formData.get("subject") as string) || "",
      message: (formData.get("message") as string) || "",
    };

    let recorded = false;
    const failureReasons: string[] = [];

    // 1. Submit to Google Apps Script backend to record in the "Contacts" sheet
    if (gasEndpoint) {
      try {
        const gasRes = await fetch(gasEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        });
        const gasData = await gasRes.json();
        if (gasData.ok) {
          recorded = true;
        } else if (gasData.message) {
          failureReasons.push(gasData.message);
        }
      } catch {
        // Fall through to Formspree
      }
    }

    // 2. Submit to Formspree for immediate email inbox delivery
    if (personalData.contact.formspreeEndpoint) {
      try {
        const formspreeRes = await fetch(personalData.contact.formspreeEndpoint, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (formspreeRes.ok) {
          recorded = true;
        } else {
          const data = await formspreeRes.json();
          if (data?.errors) {
            failureReasons.push(
              data.errors.map((err: { message: string }) => err.message).join(", ")
            );
          }
        }
      } catch {
        // Formspree network error
      }
    }

    if (recorded) {
      setFormStatus("success");
      form.reset();
    } else {
      setErrorMessage(
        failureReasons.length > 0
          ? failureReasons.join("; ")
          : "Unable to deliver your message. Please send an email directly to alok@alokdasofficial.in."
      );
      setFormStatus("error");
    }

    hidePreloader();
  };

  return (
    <div className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3 py-1 text-[12px] font-medium text-foreground">
            <Send className="h-3.5 w-3.5 text-primary" />
            <span>DIRECT ENGAGEMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15]">
            Contact &amp; Inquiries
          </h1>
          <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
            Interested in discussing a Chemistry employment opportunity, research collaboration, or inquiring about my published applications? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border/80 bg-card p-7 sm:p-8 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h2 className="text-[16px] font-bold text-foreground tracking-tight">
                Direct Contact Channels
              </h2>

              <div className="space-y-4 text-[13px]">
                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                      Professional Email
                    </span>
                    <a
                      href={`mailto:${personalData.contact.email}`}
                      className="font-medium text-foreground hover:underline text-[14px] break-all"
                    >
                      {personalData.contact.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                      Phone / Mobile
                    </span>
                    <ProtectedPhone />
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                      Location
                    </span>
                    <span className="font-medium text-foreground text-[14px]">
                      {personalData.location.full}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profiles */}
              <div className="pt-4 border-t border-border/60 space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Online Profiles &amp; Repositories
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href={personalData.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-background hover:bg-secondary/60 transition-colors text-[13px] font-medium text-foreground min-h-[44px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Linkedin className="h-4 w-4 text-primary" />
                      LinkedIn Profile
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>

                  <a
                    href={personalData.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-background hover:bg-secondary/60 transition-colors text-[13px] font-medium text-foreground min-h-[44px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Github className="h-4 w-4 text-foreground" />
                      GitHub (@MrAlokTech)
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>

                  <a
                    href={personalData.social.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-background hover:bg-secondary/60 transition-colors text-[13px] font-medium text-foreground min-h-[44px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <ExternalLink className="h-4 w-4 text-emerald-600" />
                      Google Play Developer Page
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Working Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/80 bg-card p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Send a Direct Message
                </h2>
                <p className="text-[13px] text-muted-foreground">
                  Delivered directly to my personal inbox and recorded securely.
                </p>
              </div>

              {formStatus === "success" ? (
                <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] text-center space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Message Delivered
                  </h3>
                  <p className="text-[13px] text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. I have received your message and will respond promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormStatus("idle")}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline pt-2 cursor-pointer min-h-[44px]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formStatus === "error" && (
                    <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-[13px] text-red-700 dark:text-red-400 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-[13px] font-medium text-foreground"
                    >
                      Your Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Dr. Jane Smith or Recruiter Name"
                      className="w-full min-h-[44px] rounded-xl border border-border/80 bg-background px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-[13px] font-medium text-foreground"
                    >
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. jane.smith@organization.com"
                      className="w-full min-h-[44px] rounded-xl border border-border/80 bg-background px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-[13px] font-medium text-foreground"
                    >
                      Subject / Topic
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="e.g. Chemistry QC Opportunity / Academic Collaboration"
                      className="w-full min-h-[44px] rounded-xl border border-border/80 bg-background px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-[13px] font-medium text-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Write your message here..."
                      className="w-full rounded-xl border border-border/80 bg-background p-4 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-6 text-[14px] font-medium text-primary-foreground shadow-sm hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Transmitting Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
