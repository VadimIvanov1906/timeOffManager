

export const EmptyState: React.FC<{ title: string; subtitle?: string; cta?: React.ReactNode }>
  = ({ title, subtitle, cta }) => (
  <div className="text-center py-8 opacity-80">
    <div className="text-lg font-semibold">{title}</div>
    {subtitle ? <div className="mt-1">{subtitle}</div> : null}
    {cta ? <div className="mt-4">{cta}</div> : null}
  </div>
);