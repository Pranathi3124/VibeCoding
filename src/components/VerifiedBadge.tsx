import { Check } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full w-4 h-4 shadow-sm"
      title="Verified Creator"
    >
      <Check className="w-2.5 h-2.5 stroke-[4]" />
    </span>
  );
}
