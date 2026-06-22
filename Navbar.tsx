import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Film, Search, Tv, Bookmark, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  const linkCls = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors hover:text-foreground",
      active ? "text-foreground" : "text-muted-foreground"
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur border-b border-border" : "bg-gradient-to-b from-background/90 to-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary display">STREAMR</span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <Link to="/" className={linkCls(pathname === "/")}>Home</Link>
          <Link to="/movies" className={linkCls(pathname === "/movies")}>Movies</Link>
          <Link to="/tv" className={linkCls(pathname === "/tv")}>TV Shows</Link>
          {user && (
            <Link to="/watchlist" className={linkCls(pathname === "/watchlist")}>My List</Link>
          )}
        </nav>
        <form onSubmit={onSearch} className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles..."
              className="h-9 w-40 rounded-md border border-input bg-secondary/60 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:w-64 focus:border-primary transition-all"
            />
          </div>
          {user ? (
            <button
              type="button"
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
              title="Sign out"
              className="grid h-9 w-9 place-items-center rounded-md border border-input hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <UserIcon className="h-4 w-4" /> Sign in
            </Link>
          )}
        </form>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/", label: "Home", Icon: Film },
    { to: "/movies", label: "Movies", Icon: Film },
    { to: "/tv", label: "TV", Icon: Tv },
    { to: "/watchlist", label: "List", Icon: Bookmark },
  ] as const;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map(({ to, label, Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
