import React from "react";
import { useStore } from "../store/store";
import UserProfilePage from "./UserProfilePage";
import { useParams } from "react-router";
import OtherProfilePage from "./OtherProfilePage";

/**
 * ProfilePage Component
 *
 * Determines which profile component to render based on the route and logged-in user role.
 * Renders the personal profile for regular users, and public profile view for admins or other users.
 */
export default function ProfilePage() {
  // use the useInfo to render either UserProfilePage or AdminProfilePage
  const { userInfo } = useStore();
  
  // the route may be: /profile/me, or /profile/:userId
  const { userId } = useParams();
  const actualUserId = userId === "me" ? userInfo.user_id : userId;

  // when it is /profile/me, and userInfo.role is user, render UserProfilePage
  // when it is /profile/me, and userInfo.role is admin, render OtherProfilePage
  // otherwise, render OtherProfilePage
  
  if (userId === "me") {
    return userInfo.role === "user" ? <UserProfilePage /> : <OtherProfilePage userId={actualUserId} />;
  } else {
    return <OtherProfilePage userId={actualUserId} />;
  }
}
