import { cn } from "@/lib/utils";

/**
 * Numbered-circle wizard stepper — structural twin of SurveyJS
 * `progressBarType: "pages"` and MUI's `<Stepper alternativeLabel>`.
 */
export function WizardStepper({
  pages,
  currentPage,
}: {
  pages: readonly string[];
  currentPage: number;
}) {
  return (
    <ol className="flex">
      {pages.map((title, index) => {
        const active = index === currentPage;
        const done = index < currentPage;
        return (
          <li
            key={title}
            aria-current={active ? "step" : undefined}
            className={cn(
              "relative flex flex-1 flex-col items-center text-center",
              "before:bg-border before:absolute before:top-3 before:right-1/2 before:-left-1/2 before:h-px",
              "first:before:hidden",
              (active || done) && "before:bg-primary",
            )}
          >
            <span
              className={cn(
                "relative z-10 flex size-6 items-center justify-center rounded-full text-xs font-medium",
                active || done
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {done ? "✓" : index + 1}
            </span>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
