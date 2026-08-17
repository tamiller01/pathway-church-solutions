import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PrimaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-14 items-center justify-center rounded-xl bg-brand-gold px-4 text-base font-bold text-brand-navy shadow-soft transition-all duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 md:min-w-[280px]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-14 items-center justify-center rounded-xl border-2 border-brand-navy bg-transparent px-4 text-base font-medium text-brand-navy transition-colors duration-200 hover:bg-brand-navy/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 md:min-w-[280px]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TextButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center text-lg font-medium text-brand-navy transition-colors duration-200 hover:text-brand-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 active:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    containerClassName?: string;
  }
>(
  ({ label, error, containerClassName, className, ...props }, ref) => (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label className="block text-sm font-medium text-brand-navy">{label}</label>
      ) : null}

      <input
        ref={ref}
        {...props}
        className={cn(
          "h-14 w-full rounded-lg border border-neutral-gray-light bg-white px-4 text-base text-brand-navy placeholder:text-neutral-gray-light focus:outline-none focus:ring-2 focus:ring-brand-gold/70 focus:border-brand-gold disabled:bg-neutral-warm-light disabled:opacity-40",
          error ? "border-error focus:border-error focus:ring-red-200" : "",
          className,
        )}
      />

      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  ),
);

TextInput.displayName = "TextInput";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    containerClassName?: string;
  }
>(
  ({ label, error, containerClassName, className, ...props }, ref) => (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label className="block text-sm font-medium text-brand-navy">{label}</label>
      ) : null}

      <textarea
        ref={ref}
        {...props}
        className={cn(
          "min-h-[120px] w-full resize-y rounded-lg border border-neutral-gray-light bg-white px-4 py-3 text-base text-brand-navy placeholder:text-neutral-gray-light focus:outline-none focus:ring-2 focus:ring-brand-gold/70 focus:border-brand-gold disabled:bg-neutral-warm-light disabled:opacity-40",
          error ? "border-error focus:border-error focus:ring-red-200" : "",
          className,
        )}
      />

      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  ),
);

Textarea.displayName = "Textarea";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-lg border border-neutral-gray-light bg-white p-6 shadow-medium",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      {...props}
      className={cn("rounded-lg bg-neutral-warm-light p-8 shadow-none", className)}
    >
      {children}
    </section>
  );
}

export function InteractiveCard({
  className,
  children,
  selected = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { selected?: boolean }) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-lg border-2 border-transparent bg-white p-6 shadow-soft transition-all duration-200 hover:shadow-medium",
        selected && "border-brand-gold shadow-deep",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
            {eyebrow}
          </p>
        ) : null}

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{title}</h2>
          <div className="h-1 w-16 rounded-full bg-brand-gold" />
        </div>

        {description ? (
          <p className="max-w-2xl text-lg text-text-secondary">{description}</p>
        ) : null}
      </div>

      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "rounded-3xl border border-brand-navy/10 bg-gradient-to-r from-brand-navy via-brand-slate-blue to-brand-slate-blue-dark p-6 text-white shadow-deep sm:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Pathway Church
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-white">{title}</h1>
          {description ? <p className="max-w-2xl text-xl text-white/80">{description}</p> : null}
        </div>

        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-gradient-to-r from-brand-navy via-brand-slate-blue to-brand-slate-blue-dark px-6 py-28 text-white sm:px-8 lg:px-12",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl text-center">
        {eyebrow ? (
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/80 sm:text-2xl">
            {subtitle}
          </p>
        ) : null}

        {(primaryAction || secondaryAction) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </section>
  );
}

export function TwoColumnSection({
  eyebrow,
  title,
  description,
  media,
  children,
  reverse = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  media?: ReactNode;
  children?: ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("px-6 py-24 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto max-w-6xl">
        <div className={cn("grid items-center gap-10 lg:grid-cols-2", reverse && "lg:[&>*:first-child]:order-2") }>
          <div className="space-y-6">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate-blue-600">
                {eyebrow}
              </p>
            ) : null}

            <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{title}</h2>

            {description ? <p className="text-lg text-text-secondary">{description}</p> : null}

            {children}
          </div>

          {media ? <div className="relative">{media}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function FeatureGrid({
  title,
  description,
  items,
  className,
}: {
  title?: string;
  description?: string;
  items: Array<{
    icon?: ReactNode;
    title: string;
    description: string;
  }>;
  className?: string;
}) {
  return (
    <section className={cn("px-6 py-24 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto max-w-6xl">
        {(title || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {title ? <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{title}</h2> : null}
            {description ? <p className="mt-4 text-lg text-text-secondary">{description}</p> : null}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-lg border border-neutral-gray-light bg-white p-8 shadow-soft">
              {item.icon ? (
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy">
                  {item.icon}
                </div>
              ) : null}

              <h3 className="text-2xl font-bold text-brand-navy">{item.title}</h3>
              <p className="mt-3 text-lg text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-3xl bg-white p-10 shadow-deep",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="text-2xl font-bold text-brand-navy">{title}</h3> : null}
            {description ? (
              <p className="mt-1 text-base text-text-secondary">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-brand-navy transition hover:bg-neutral-warm-light"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        {actions ? <div className="mt-6 flex justify-end gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
