import { ArrowLeft, ArrowRight } from "lucide-react";

type DirectionIconProps = {
  className?: string;
};

export function ForwardIcon({ className = "ml-1 inline size-3.5" }: DirectionIconProps) {
  return <ArrowRight aria-hidden="true" className={className} />;
}

export function BackIcon({ className = "mr-1 inline size-3.5" }: DirectionIconProps) {
  return <ArrowLeft aria-hidden="true" className={className} />;
}
