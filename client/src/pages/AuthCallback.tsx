import { Spinner } from "@/components/ui/spinner";

export default function AuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-700">
        <Spinner className="h-5 w-5" />
        <span>Signing you in…</span>
      </div>
    </div>
  );
}


