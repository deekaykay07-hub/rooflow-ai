import { useEffect } from "react";
import useAuth from "@/utils/useAuth";

function MainComponent() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut({ callbackUrl: "/", redirect: true });
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p className="text-zinc-400 font-medium">Signing out...</p>
      </div>
    </div>
  );
}

export default MainComponent;
