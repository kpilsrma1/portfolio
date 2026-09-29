import type { MockupVariant } from "@/types/content";
import { cn } from "@/lib/utils";

interface ProjectMockupProps {
  variant: MockupVariant;
  title: string;
  className?: string;
}

/**
 * Original, abstract product illustrations rendered with CSS. They represent
 * the kind of software each case study describes and are not screenshots of
 * confidential client systems.
 */
export function ProjectMockup({ variant, title, className }: ProjectMockupProps) {
  return (
    <div
      role="img"
      aria-label={`Abstract illustration representing the ${title}`}
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-surface",
        className,
      )}
    >
      <div aria-hidden="true" className="grid-texture absolute inset-0 opacity-70" />
      <div aria-hidden="true" className="absolute inset-x-6 top-5 bottom-0 flex flex-col overflow-hidden rounded-t-lg border border-border-strong bg-card shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="ml-3 h-1.5 w-24 rounded-full bg-muted-foreground/25" />
        </div>
        {variant === "dashboard" && <DashboardBody />}
        {variant === "workflow" && <WorkflowBody />}
        {variant === "records" && <RecordsBody />}
      </div>
    </div>
  );
}

function DashboardBody() {
  return (
    <div className="grid flex-1 grid-cols-[4.5rem_1fr] gap-3 p-3">
      <div className="flex flex-col gap-2 rounded-md bg-surface p-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-1.5 rounded-full", i === 1 ? "bg-brand/80" : "bg-muted-foreground/25")} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md border border-border bg-surface p-2">
              <span className="block h-1 w-8 rounded-full bg-muted-foreground/30" />
              <span className={cn("mt-2 block h-2.5 w-12 rounded-full", i === 0 ? "bg-brand/70" : "bg-foreground/30")} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 rounded-md border border-border bg-surface p-2">
          {[35, 55, 40, 70, 60, 85, 50, 75, 65, 90].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={cn("flex-1 rounded-sm", i === 5 ? "bg-brand/80" : "bg-brand-alt/35")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkflowBody() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        {["Tour", "Group", "Reservation", "Invoice"].map((step, i) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex-1 rounded-md border px-2 py-1.5 font-mono text-[0.55rem] leading-none",
                i === 2 ? "border-brand/60 bg-brand/10 text-brand" : "border-border bg-surface text-muted-foreground",
              )}
            >
              {step}
            </span>
            {i < 3 ? <span className="h-px w-2 bg-muted-foreground/40" /> : null}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((col) => (
          <div key={col} className="flex flex-col gap-1.5 rounded-md border border-border bg-surface p-2">
            <span className="h-1 w-10 rounded-full bg-muted-foreground/40" />
            {[0, 1, 2].slice(0, 3 - col).map((card) => (
              <span key={card} className="rounded-sm border border-border bg-card p-1.5">
                <span className="block h-1 w-3/4 rounded-full bg-foreground/30" />
                <span className={cn("mt-1 block h-1 w-1/3 rounded-full", card === 0 ? "bg-brand/70" : "bg-muted-foreground/25")} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordsBody() {
  return (
    <div className="flex flex-1 flex-col gap-2 p-3">
      <div className="flex items-center gap-2">
        <span className="h-5 flex-1 rounded-md border border-border bg-surface" />
        <span className="h-5 w-12 rounded-md bg-brand/70" />
      </div>
      <div className="flex-1 overflow-hidden rounded-md border border-border bg-surface">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_0.6fr] gap-2 border-b border-border px-2 py-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1 rounded-full bg-muted-foreground/40" />
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-[1.5fr_1fr_1fr_0.6fr] gap-2 border-b border-border/60 px-2 py-1.5 last:border-0">
            <span className="h-1 rounded-full bg-foreground/30" />
            <span className="h-1 w-3/4 rounded-full bg-muted-foreground/30" />
            <span className="h-1 w-1/2 rounded-full bg-muted-foreground/30" />
            <span className={cn("h-1 rounded-full", row % 3 === 0 ? "bg-brand/70" : "bg-brand-alt/40")} />
          </div>
        ))}
      </div>
    </div>
  );
}
