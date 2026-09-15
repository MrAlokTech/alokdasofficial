import Link from "next/link";
import Image from "next/image";
import { personalData } from "@/data/personal";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-border/60 bg-background transition-colors">
      <div className="container mx-auto px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full overflow-hidden border border-border/80 bg-foreground/5 p-0.5">
                <Image
                  src="/logo.png"
                  alt={personalData.name}
                  width={28}
                  height={28}
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-foreground">
                {personalData.name}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-sm">
              M.Sc. Chemistry student at Rabindranath Tagore University.
              Concentrating on analytical methods, phytochemical laboratory
              research, and practical software engineering.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Open to Chemistry &amp; Scientific Roles
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-foreground tracking-tight">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Alok
                </Link>
              </li>
              <li>
                <Link
                  href="/chemistry"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span>Chemistry</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    Primary
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projects &amp; Apps
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tools &amp; Labs
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Writing &amp; Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/polls"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Community Polls
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiter & Resources */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-foreground tracking-tight">
              Recruiter Access
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link
                  href="/resume"
                  className="text-primary font-medium hover:underline transition-colors inline-flex items-center gap-1"
                >
                  <span>View Curriculum Vitae</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact &amp; Inquiries
                </Link>
              </li>
              <li>
                <a
                  href={personalData.social.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <span>Google Play Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-foreground tracking-tight">
              Direct Channels
            </h4>
            <div className="flex items-center gap-2">
              <a
                href={personalData.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={personalData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${personalData.contact.email}`}
                aria-label="Email Alok Das"
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="text-[12px] text-muted-foreground pt-1">
              {personalData.location.full}
            </p>
          </div>
        </div>

        {/* Hairline Separator and Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-muted-foreground">
          <p>
            &copy; {currentYear} {personalData.name}. All rights reserved.
          </p>
          <p className="italic text-muted-foreground/80">
            &ldquo;Chemistry first. Technology as a complementary skill.
            Building useful things.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
