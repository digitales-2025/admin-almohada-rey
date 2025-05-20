"use client";

import { useProfile } from "../profile/_hooks/use-profile";

export default function DashboardPage() {
  const { user } = useProfile();
  console.log(user?.userRol);
  return <div></div>;
}
