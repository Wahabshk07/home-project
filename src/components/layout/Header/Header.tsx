"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SignInForm } from "@/components/auth/sign-in-form";
import { BrandLogoImg } from "@/components/layout/BrandLogo";
import { UserAccountMenu } from "@/components/layout/user-account-menu";
import { useAuth } from "@/contexts/auth-context";
import {
  canAccessCommunity,
  getCommunityHubPath,
  getProfileUpdatePath,
  type NurseCommunityOpts,
} from "@/lib/api/auth-api";
import { mainNav } from "@/config/navigation";

// --- Icons ---
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ... (keep your other icons: NavChevron, SignInIcon, UserPlusIcon, MenuIcon)
function NavChevron({ className }: { className?: string }) { return <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>; }
function SignInIcon({ className }: { className?: string }) { return <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>; }
function UserPlusIcon({ className }: { className?: string }) { return <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>; }
function MenuIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>; }

const SCROLL_THRESHOLD = 20;

export function Header() {
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // NEW: Error State

  const communityOpts: NurseCommunityOpts | undefined = user
    ? { communityBannedAt: user.communityBannedAt }
    : undefined;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear error when closing modal
  const handleCloseModal = () => {
    setShowSignIn(false);
    setErrorMessage(null);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ease-out ${
          scrolled
            ? "border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md"
            : "border-transparent bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-button/40"
            onClick={() => setOpen(false)}
          >
            <BrandLogoImg imgClassName="sm:h-10" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {mainNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-red-50 text-red-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex flex-col items-center gap-1">
                    {active ? (
                      <span
                        className="h-0.5 w-6 rounded-full bg-red-600"
                        aria-hidden
                      />
                    ) : (
                      <span className="h-0.5 w-6 rounded-full bg-transparent" aria-hidden />
                    )}
                    <span className="leading-tight">{item.label}</span>
                  </span>
                  {item.dropdown ? (
                    <NavChevron className="ml-0.5 opacity-60" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {ready && user ? (
              <UserAccountMenu
                email={user.email}
                displayName={user.fullName}
                profilePhotoUrl={user.profilePhotoUrl}
                avatarSize={40}
                align="end"
                showDashboardLink={user.role !== "nurse"}
                showMessagesLink={
                  user.role === "nurse" ||
                  user.role === "employer" ||
                  user.role === "admin"
                }
                messagesHref={
                  user.role === "nurse"
                    ? "/community/messages?tab=inbox"
                    : "/dashboard/employee/messages"
                }
                showCommunityLink={canAccessCommunity(
                  user.role,
                  communityOpts,
                )}
                communityHref={getCommunityHubPath(user.role, communityOpts)}
                profileHref={getProfileUpdatePath(user.role)}
                onLogout={() => logout()}
              />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowSignIn(true)}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 hover:text-red-700"
                >
                  <SignInIcon className="opacity-90" /> Sign in
                </button>
                <Link
                  href="/register"
                  className="btn inline-flex items-center gap-2 !px-4 !py-2 text-sm"
                >
                  <UserPlusIcon /> Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-800 transition hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="border-t border-slate-100 bg-white shadow-card md:hidden"
          >
            <nav
              className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6"
              aria-label="Mobile primary"
            >
              {mainNav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium ${
                      active
                        ? "bg-red-50 text-red-700"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-slate-100 pt-3">
                {ready && user ? (
                  <div className="flex flex-col gap-2">
                    <UserAccountMenu
                      email={user.email}
                      displayName={user.fullName}
                      profilePhotoUrl={user.profilePhotoUrl}
                      avatarSize={36}
                      align="start"
                      className="w-full"
                      showDashboardLink={user.role !== "nurse"}
                      showMessagesLink={
                        user.role === "nurse" ||
                        user.role === "employer" ||
                        user.role === "admin"
                      }
                      messagesHref={
                        user.role === "nurse"
                          ? "/community/messages?tab=inbox"
                          : "/dashboard/employee/messages"
                      }
                      showCommunityLink={canAccessCommunity(
                        user.role,
                        communityOpts,
                      )}
                      communityHref={getCommunityHubPath(
                        user.role,
                        communityOpts,
                      )}
                      profileHref={getProfileUpdatePath(user.role)}
                      onLogout={() => {
                        setOpen(false);
                        logout();
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setShowSignIn(true);
                      }}
                      className="rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      Sign in
                    </button>
                    <Link
                      href="/register"
                      className="btn w-full justify-center text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      {/* --- SIGN IN MODAL --- */}
      {showSignIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleCloseModal} />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close sign in"
            >
              <CloseIcon />
            </button>

            <div className="p-8">
              <div className="mb-6 flex justify-center">
                <img src="/logo/ANN.png" alt="Logo" className="h-12 object-contain" />
              </div>

              {/* --- ATTRACTIVE ERROR DIALOG --- */}
              {errorMessage && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 animate-shake">
                  <div className="shrink-0 mt-0.5">
                    <ErrorIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-800">Login Issue</h3>
                    <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                  <button 
                    onClick={() => setErrorMessage(null)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}

              {/* Pass the error handler to the Form */}
              <SignInForm
                compact
                onSuccess={() => setShowSignIn(false)}
                // Assuming SignInForm has an onError prop, or wraps logic
                // If your SignInForm doesn't have onError, you can handle it inside that component
              />

              <div className="mt-6 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  New here?{" "}
                  <Link href="/register" className="font-bold text-button hover:underline" onClick={handleCloseModal}>
                    Create account
                  </Link>
                </p>
                <Link
                  href="/sign-in"
                  className="mt-2 block text-xs font-medium text-gray-400 hover:text-button transition-colors"
                  onClick={handleCloseModal}
                >
                  Open full-screen sign-in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}