type Props = { text: string; className?: string };
export default function Tag({ text, className }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] 
      bg-[#4CAF50]/10 text-[#4CAF50] ring-1 ring-[#4CAF50]/15 ${className ?? ""}`}
    >
      {text}
    </span>
  );
}
