"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const activeLabel = pathname.split("/").pop()?.replace("-", " ") || "DASHBOARD";

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar - Now uses Link inside */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[68px] overflow-y-auto">
        {/* Top bar (Final Round Style) */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {activeLabel}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-[13px] font-bold text-slate-800 hover:text-primary transition-colors">
              Subscription
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:shadow-soft transition-all"
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </button>

              {/* User Dropdown Overlay */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-card border border-slate-200 p-2 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{user.displayName || "User Name"}</p>
                    <p className="text-[11px] text-slate-500 overflow-hidden text-ellipsis">{user.email}</p>
                  </div>
                  <div className="py-2 space-y-1">
                    {[
                      { label: "Cheat Sheet", icon: "📄" },
                      { label: "Download Center", icon: "📥" },
                      { label: "Settings", icon: "⚙️" },
                      { label: "Manage Subscription", icon: "💳" },
                    ].map((item, idx) => (
                       <button key={idx} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                        <span className="mr-3">{item.icon}</span> {item.label}
                      </button>
                    ))}
                    <button 
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all mt-2 pt-4 border-t border-slate-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
