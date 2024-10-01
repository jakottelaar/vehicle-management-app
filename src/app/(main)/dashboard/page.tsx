"use client";
import { ProtectedRoute } from "@/components/protected-route";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="h-full w-full px-4 lg:p-4 md:px-8">Dashboard</div>
    </ProtectedRoute>
  );
};

export default Dashboard;
