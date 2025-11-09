"use client";

import {useQuery} from "convex/react";
import {api} from "@sunup/convex/_generated/api";

export default function Home() {
  return (
    <>
      <header
        className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Sunup - Solar Installation Management
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          Sunup
        </h1>
        <div className="flex flex-col gap-8 w-96 mx-auto">
          <p className="text-center text-muted-foreground">
            Authentication integration in progress...
          </p>
          <p className="text-sm text-center text-muted-foreground">
            Phase 2: Installing better-auth with Admin plugin
          </p>
        </div>
      </main>
    </>
  );
}
