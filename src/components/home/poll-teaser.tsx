import Link from "next/link";
import { Vote, ArrowRight, Clock } from "lucide-react";
import { getAllPolls, getPollStatus, getTimeRemaining } from "@/lib/polls";

export async function HomePollTeaser() {
  const polls = await getAllPolls();
  const now = new Date();

  // Find the first currently active poll
  const activePoll = polls.find((p) => getPollStatus(p, now) === "ACTIVE");

  if (!activePoll) return null;

  const timer = getTimeRemaining(activePoll.endTime || activePoll.closesAt, now);

  return (
    <section className="py-10 border-b border-border/60 bg-card/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-border/80 bg-secondary/25 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Have a say</span>
              </span>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timer.formatted}</span>
              </span>
            </div>

            <h2 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-foreground">
              {activePoll.question}
            </h2>

            <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed">
              Anonymous community poll &middot; No name or email requested.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/polls/${activePoll.slug}`}
              className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium shadow-sm hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <Vote className="h-4 w-4" />
              <span>Vote Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
