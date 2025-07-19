// components/ProtectedLayout.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Vous devez être connecté pour accéder à cette page.");
        router.push("/Login");
    }
  }, [router]);

  return <>{children}</>;
}
