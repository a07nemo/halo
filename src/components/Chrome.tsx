"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DoorTransition from "./DoorTransition";

// Routes that render WITHOUT the app shell (public / full-bleed)
const PUBLIC_PREFIXES = ["/login", "/signup", "/onboarding"];

function isPublic(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublic(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <DoorTransition />
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <Topbar />
        <main className="flex-1 px-5 py-6 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
