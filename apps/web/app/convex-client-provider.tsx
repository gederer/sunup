"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {useAuth} from "@clerk/nextjs";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL must be set to use Convex.");
}

const convexClient = new ConvexReactClient(convexUrl);

// export function ConvexClientProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
// }

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
