import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowUpRight,
  Briefcase,
  LogOut,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clearSession, getSession, type AuthResponse } from "@/lib/auth";

/**
 * /Dashboard — shown only to authenticated users. If there's no session,
 * redirect to /signin.
 */
export default function Dashboard() {
  const [session, setSession] = useState<AuthResponse | null>(getSession());

  // Re-check the session on mount (covers the case the tab was reused).
  useEffect(() => {
    setSession(getSession());
  }, []);

  // Auth guard: no session -> back to sign in.
  if (!session) return <Navigate to="/signin" replace />;

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    // <Navigate> below will catch the null session and redirect.
  };

  const firstName = session.user.name.split(" ")[0];

  const stats = [
    { label: "Total Assets", value: "$1,284,930", delta: "+12.5%", icon: Wallet },
    { label: "Active Holdings", value: "37", delta: "+3", icon: Briefcase },
    { label: "Monthly Return", value: "+8.4%", delta: "+1.2%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">AssetFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Hi, <span className="font-medium text-foreground">{firstName}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut} asChild>
              <Link to="/signin">
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">
                    {s.value}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {s.delta} vs last month
              </p>
            </Card>
          ))}
        </div>

        {/* Detail card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re signed in with{" "}
            <span className="font-medium text-foreground">
              {session.user.email}
            </span>
            . Backend token:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {session.token}
            </code>
          </p>
          <div className="mt-4 divide-y rounded-lg border">
            {[
              { action: "Bought AAPL", qty: "12 shares", when: "2h ago" },
              { action: "Dividend received", qty: "$48.20", when: "Yesterday" },
              { action: "Sold MSFT", qty: "5 shares", when: "3d ago" },
            ].map((row) => (
              <div
                key={row.action}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-medium">{row.action}</span>
                <span className="text-sm text-muted-foreground">
                  {row.qty} · {row.when}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
