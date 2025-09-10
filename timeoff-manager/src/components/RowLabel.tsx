export const RowLabel: React.FC<{ label: string; value?: React.ReactNode }>
  = ({ label, value }) => (
  <div className="flex items-center justify-between py-1 text-[15px]">
    <span className="opacity-70">{label}</span>
    <span className="font-medium truncate ml-3">{value}</span>
  </div>
);