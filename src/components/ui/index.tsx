import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

interface ChildrenProps {
  children: ReactNode;
}

interface DataProps {
  dataId: string;
  roleName?: string;
}

interface ButtonProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onClick' | 'type'>, DataProps {
  label?: string;
  children: ReactNode;
}

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement>, DataProps {
  label: string;
  icon?: ReactNode;
}

interface SelectButtonProps extends DataProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function AppShell({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="relative min-h-screen overflow-hidden bg-[#eee9dc] text-zinc-950 antialiased dark:bg-[#080806] dark:text-zinc-50"
    >
      <div
        data-melius-ui-id="app-ambient-gradient"
        data-melius-ui-role="background"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(132,119,78,0.18),transparent_30rem),linear-gradient(180deg,#f7f4eb_0%,#eee9dc_46%,#e8e0cf_100%)] dark:bg-[radial-gradient(circle_at_18%_10%,rgba(146,119,54,0.18),transparent_28rem),linear-gradient(180deg,#15130f_0%,#0c0b09_52%,#080806_100%)]"
      />
      <div
        data-melius-ui-id="app-ambient-grid"
        data-melius-ui-role="background"
        className="pointer-events-none absolute inset-0 opacity-[0.42] [background-image:linear-gradient(rgba(68,64,60,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(68,64,60,0.035)_1px,transparent_1px)] [background-size:100%_32px,72px_100%] dark:opacity-[0.28] dark:[background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]"
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}

export function WorkspaceFrame({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div {...props} className="relative flex min-h-screen w-full overflow-hidden">
      {children}
    </div>
  );
}

export function SidebarShell({ children, ...props }: HTMLAttributes<HTMLElement> & ChildrenProps) {
  return (
    <aside
      {...props}
      className="hidden h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-stone-950/[0.14] bg-[#f6f0e3] dark:border-white/[0.10] dark:bg-[#12100c] md:flex"
    >
      {children}
    </aside>
  );
}

export function MobileDrawer({ children, ...props }: HTMLAttributes<HTMLElement> & ChildrenProps) {
  return (
    <aside
      {...props}
      className="drawer-enter fixed inset-y-0 left-0 z-50 flex w-[min(19rem,calc(100vw-2rem))] flex-col border-r border-stone-950/[0.14] bg-[#f6f0e3] shadow-xl shadow-zinc-950/20 dark:border-white/[0.10] dark:bg-[#12100c] md:hidden"
    >
      {children}
    </aside>
  );
}

export function Overlay({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div {...props} className="fixed inset-0 z-40 bg-zinc-950/45 backdrop-blur-sm md:hidden">
      {children}
    </div>
  );
}

export function SidebarHeader({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div {...props} className="flex min-h-16 items-center gap-3 border-b border-stone-950/[0.12] px-4 dark:border-white/[0.08]">
      {children}
    </div>
  );
}

export function WorkspaceHeader({ children, ...props }: HTMLAttributes<HTMLElement> & ChildrenProps) {
  return (
    <header
      {...props}
      className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-stone-950/[0.12] bg-[#fbf8ef] px-3 dark:border-white/[0.08] dark:bg-[#0f0e0b] sm:px-5"
    >
      {children}
    </header>
  );
}

export function BrandMark({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-zinc-950 text-white shadow-sm shadow-zinc-950/10 dark:bg-stone-100 dark:text-zinc-950"
    >
      {children}
    </div>
  );
}

export function IconButton({ dataId, roleName, label, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        aria-label={label}
        title={label}
        onClick={onClick}
        disabled
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors dark:text-zinc-600"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-950/[0.07] hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ dataId, roleName, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        onClick={onClick}
        disabled
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-300 px-3.5 py-2 text-sm font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      onClick={onClick}
      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3.5 py-2 text-sm font-bold text-white shadow-sm shadow-zinc-950/10 transition-colors hover:bg-stone-800 dark:bg-amber-100 dark:text-zinc-950 dark:hover:bg-amber-200"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ dataId, roleName, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        onClick={onClick}
        disabled
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-950/[0.10] bg-white/[0.55] px-3.5 py-2 text-sm font-bold text-zinc-400 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-zinc-600"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      onClick={onClick}
      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-950/[0.12] bg-[#fffdf7] px-3.5 py-2 text-sm font-bold text-zinc-800 transition-colors hover:bg-white dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-zinc-100 dark:hover:bg-white/[0.12]"
    >
      {children}
    </button>
  );
}

export function GhostButton({ dataId, roleName, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        onClick={onClick}
        disabled
        className="inline-flex min-h-8 items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-bold text-zinc-400 dark:text-zinc-600"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      onClick={onClick}
      className="inline-flex min-h-8 items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-950/[0.06] hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function RowButton({ dataId, roleName, selected, onClick, children }: SelectButtonProps) {
  if (selected) {
    return (
      <button
        type="button"
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        aria-pressed="true"
        onClick={onClick}
        className="flex min-h-9 w-full items-center justify-between rounded-sm border-l-4 border-zinc-950 bg-white/[0.72] px-3 py-2 text-left text-sm font-bold text-zinc-950 shadow-sm shadow-stone-950/[0.03] dark:border-amber-200 dark:bg-white/[0.10] dark:text-white"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      aria-pressed="false"
      onClick={onClick}
      className="flex min-h-9 w-full items-center justify-between rounded-sm border-l-4 border-transparent px-3 py-2 text-left text-sm font-semibold text-zinc-700 transition-colors hover:border-stone-400 hover:bg-white/[0.48] hover:text-zinc-950 dark:text-zinc-300 dark:hover:border-stone-500 dark:hover:bg-white/[0.08] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function TabButton({ dataId, roleName, selected, onClick, children }: SelectButtonProps) {
  if (selected) {
    return (
      <button
        type="button"
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        aria-pressed="true"
        onClick={onClick}
        className="h-10 min-w-max border-b-2 border-zinc-950 px-1 text-sm font-black text-zinc-950 transition-colors dark:border-amber-200 dark:text-white"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      aria-pressed="false"
      onClick={onClick}
      className="h-10 min-w-max border-b-2 border-transparent px-1 text-sm font-semibold text-zinc-500 transition-colors hover:border-stone-400 hover:text-zinc-950 dark:text-zinc-400 dark:hover:border-stone-500 dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function SearchInput({ dataId, roleName, label, icon, ...props }: SearchInputProps) {
  return (
    <label
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      className="relative block"
    >
      <span className="sr-only">{label}</span>
      {icon}
      <input
        {...props}
        className="h-9 w-full rounded-md border border-stone-950/[0.10] bg-[#fffdf7] px-9 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-stone-600 dark:border-white/[0.10] dark:bg-white/[0.07] dark:text-white dark:placeholder:text-zinc-400 dark:focus:border-amber-200"
      />
    </label>
  );
}

export function Badge({ children, ...props }: HTMLAttributes<HTMLSpanElement> & ChildrenProps) {
  return (
    <span
      {...props}
      className="inline-flex w-fit items-center gap-1 rounded-sm border border-zinc-950/[0.12] bg-[#fffdf7] px-2 py-0.5 text-xs font-bold text-zinc-700 dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-zinc-200"
    >
      {children}
    </span>
  );
}

export function StrongBadge({ children, ...props }: HTMLAttributes<HTMLSpanElement> & ChildrenProps) {
  return (
    <span
      {...props}
      className="inline-flex w-fit items-center gap-1 rounded-md bg-white/[0.16] px-2 py-0.5 text-xs font-bold text-white backdrop-blur"
    >
      {children}
    </span>
  );
}

export function CardSurface({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="app-card-enter overflow-hidden rounded-md border border-stone-950/[0.12] bg-[#fffdf8] shadow-sm shadow-stone-950/[0.04] transition-colors hover:border-stone-700/[0.28] hover:bg-white dark:border-white/[0.09] dark:bg-white/[0.055] dark:shadow-black/20 dark:hover:border-amber-200/[0.26] dark:hover:bg-white/[0.085]"
    >
      {children}
    </div>
  );
}

export function PanelSurface({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="overflow-hidden rounded-md border border-stone-950/[0.12] bg-[#fffdf8] dark:border-white/[0.09] dark:bg-white/[0.055]"
    >
      {children}
    </div>
  );
}

export function ProgressBar({ value, dataId }: { value: number; dataId: string }) {
  return (
    <div
      data-melius-ui-id={dataId}
      data-melius-ui-role="progress"
      className="h-1.5 overflow-hidden rounded-sm bg-zinc-950/[0.08] dark:bg-white/[0.10]"
    >
      <div
        className="h-full rounded-sm bg-gradient-to-r from-zinc-950 via-stone-700 to-emerald-700 dark:from-amber-100 dark:via-stone-200 dark:to-emerald-200"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
