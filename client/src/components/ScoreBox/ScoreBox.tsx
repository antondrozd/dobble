import { cn } from "@/utils/cn";

type Props = {
  name: string;
  score: number;
  className?: string;
};

export default function ScoreBox({ name, score, className }: Props) {
  return (
    <div className={cn("score-box", className)}>
      <p className="text-xs sm:text-sm text-white/70 uppercase tracking-wider truncate max-w-24 sm:max-w-32">
        {name}
      </p>
      <p className="text-2xl sm:text-4xl font-black text-gradient">{score}</p>
    </div>
  );
}
