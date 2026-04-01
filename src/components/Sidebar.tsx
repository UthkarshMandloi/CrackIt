"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarRoute =
  | "/dashboard"
  | "/dashboard/interview"
  | "/dashboard/questions"
  | "/dashboard/study"
  | "/dashboard/personality"
  | "/dashboard/ats";

const navItems: { id: SidebarRoute; label: string; icon: React.ReactNode }[] = [
  {
    id: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "/dashboard/interview",
    label: "Interview Room",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: "/dashboard/questions",
    label: "Mock Questions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "/dashboard/study",
    label: "Study Material",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: "/dashboard/personality",
    label: "Personality Dev",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "/dashboard/ats",
    label: "ATS Checker",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M8 11h6" />
        <path d="M8 8h8" />
        <path d="M8 14h4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-out bg-[#0a0a0f] border-r border-white/5 ${
        isExpanded ? "w-56" : "w-[68px]"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      id="sidebar"
    >
      <div className="relative flex flex-col h-full py-4 px-3">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center flex-shrink-0 shadow-glow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span
            className={`text-sm font-bold text-white whitespace-nowrap transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            CRACK!T AI
          </span>
        </Link>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.id;
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#EA4C89]/15 text-[#EA4C89]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
                title={item.label}
              >
                <span className="flex-shrink-0 flex items-center justify-center w-5">
                  {item.icon}
                </span>
                <span
                  className={`text-xs font-semibold whitespace-nowrap transition-opacity duration-200 ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span
                    className={`ml-auto h-1.5 w-1.5 rounded-full bg-[#EA4C89] flex-shrink-0 transition-opacity duration-200 ${
                      isExpanded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile bottom */}
        <div className="pt-4 mt-auto border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EA4C89] to-[#D63B75] flex items-center justify-center flex-shrink-0">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
              ) : (
                <span className="text-[10px] font-bold text-white">{user?.displayName?.charAt(0) || "U"}</span>
              )}
            </div>
            <div
              className={`transition-opacity duration-200 ${
                isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              <p className="text-[11px] font-bold text-white/80 whitespace-nowrap">
                {user?.displayName || "User Name"}
              </p>
              <p className="text-[9px] text-white/30 whitespace-nowrap">
                Member
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
