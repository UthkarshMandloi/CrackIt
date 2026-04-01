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
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EA4C89]" />
      </div>
    );
  }

  const activeLabel = pathname.split("/").pop()?.replace("-", " ") || "DASHBOARD";

  return (
    <div className="h-screen flex overflow-hidden bg-[#0A0A0F] text-white">
      {/* Sidebar - Now uses Link inside */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[68px] overflow-y-auto">
        {/* Top bar (Orbitly Style) */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-3 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
              {activeLabel}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-[13px] font-bold text-white/80 hover:text-[#EA4C89] transition-colors">
              Subscription
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </button>

              {/* User Dropdown Overlay */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-[#0f0f18]/90 backdrop-blur-xl rounded-2xl shadow-elevated border border-white/10 p-2 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-bold text-white">{user.displayName || "User Name"}</p>
                    <p className="text-[11px] text-white/50 overflow-hidden text-ellipsis">{user.email}</p>
                  </div>
                  <div className="py-2 space-y-1">
                    {[
                      { label: "Cheat Sheet", icon: "📄" },
                      { label: "Download Center", icon: "📥" },
                      { label: "Settings", icon: "⚙️" },
                      { label: "Manage Subscription", icon: "💳" },
                    ].map((item, idx) => (
                       <button key={idx} className="w-full text-left px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                        <span className="mr-3">{item.icon}</span> {item.label}
                      </button>
                    ))}
                    <button 
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-500/90 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all mt-2 pt-4 border-t border-white/5"
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
