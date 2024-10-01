"use client";
import { LoadingSpinner } from "@/components/loading-spinner";
import Sidebar from "@/components/side-bar";
import { useState } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-950 text-white md:flex-row lg:flex-row xl:flex-row">
      <Sidebar />
      {children}
    </div>
  );
};

export default MainLayout;
