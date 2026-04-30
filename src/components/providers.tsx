"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { CommunityHubUnreadProvider } from "@/contexts/community-hub-unread-context";
import { PostRegisterProfileGate } from "@/features/onboarding";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CommunityHubUnreadProvider>
        <PostRegisterProfileGate>{children}</PostRegisterProfileGate>
      </CommunityHubUnreadProvider>
    </AuthProvider>
  );
}
