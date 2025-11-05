export default function Avatar({ src }: { src?: string | null }) {
  return (
    <div className="w-9 h-9 rounded-full bg-white/70 border border-white/70 shadow overflow-hidden">
      {src ? <img src={src} className="w-full h-full object-cover" /> : null}
    </div>
  );
}
