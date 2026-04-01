import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { FirebaseError } from "firebase/app";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Auth() {
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        // Handling specific Firebase authentication error codes
        if (err.code === "auth/user-not-found") setError("User not found.");
        else if (err.code === "auth/wrong-password")
          setError("Incorrect password.");
        else if (err.code === "auth/email-already-in-use")
          setError("Email already in use.");
        else if (err.code === "auth/weak-password")
          setError("Password is too weak.");
        else setError("Authentication failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-base text-tx-main relative overflow-hidden font-sans p-6">
      {
        // BACKGROUND WITH VOID EXPANSE VISUALS
      }
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 grayscale scale-110 animate-pulse-slow"
          style={{
            animationDuration: "8s",
            backgroundImage: `url('${import.meta.env.BASE_URL}assets/backgrounds/bg_voidexpanse.png')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-app-base/40 via-app-base/90 to-app-base"></div>
      </div>

      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-widest text-tx-main">
            Nexus <span className="text-accent">Idle</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-tx-muted mt-2 opacity-60">
            Log in to Start
          </p>
        </div>

        <div className="bg-panel/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold mb-6 text-center">
            {isRegistering ? "Create Account" : "Sign In"}
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-[11px] font-bold uppercase text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-tx-muted ml-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-app-base/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all placeholder:text-tx-muted/20"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-tx-muted ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-app-base/50 border border-border/50 placeholder:text-tx-muted/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/30 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(var(--color-accent),0.1)]"
            >
              {loading
                ? "Please wait..."
                : isRegistering
                  ? "Register"
                  : "Login"}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center px-4">
              <div className="w-full border-t border-border/20"></div>
            </div>
            <span className="relative bg-transparent px-4 text-[9px] font-bold text-tx-muted uppercase tracking-widest">
              or
            </span>
          </div>

          <button
            onClick={() => {
              setError("");
              signInWithPopup(auth, googleProvider).catch((err: unknown) => {
                if (err instanceof FirebaseError) setError(err.message);
              });
            }}
            className="w-full py-3.5 bg-panel/60 hover:bg-panel border border-border/50 rounded-xl flex items-center justify-center gap-3 transition-all font-bold text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                className="opacity-70"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                className="opacity-50"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                className="opacity-90"
                d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-bold uppercase tracking-widest text-tx-muted hover:text-accent transition-colors underline underline-offset-4"
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
