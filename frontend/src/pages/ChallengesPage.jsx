import React from "react";
import { useStore } from "../store/store";
import ChallengesAdmin from "./ChallengesAdmin";
import ChallengesUser from "./ChallengesUser";

/**
 * ChallengesPage Component
 *
 * Renders the appropriate challenges interface based on the user's role.
 * Admins see the management view, while regular users see the public challenges list.
 */
export default function ChallengesPage() {
  const { userInfo } = useStore();

  // Check user role, admin has a special page
  if (userInfo?.role === "admin") {
    return <ChallengesAdmin />;
  } else {
    return <ChallengesUser />;
  }
}