export const Info = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="border border-border rounded p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
