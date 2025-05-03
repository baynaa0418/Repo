//src/app/(DashboardLayout)/LayoutContent.jsx
'use client';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(DashboardLayout)/context/AuthContext";
import { useEffect } from "react";

export default function LayoutContent({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/authentication/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return children;
}