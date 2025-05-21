import React from "react";
import { Button } from "react-bootstrap";
import { formatDistanceToNow, parse } from "date-fns";
import { BACKEND } from "../static/Constants";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

/**
 * UserCard Component
 *
 * Displays a user's profile information including avatar, role, email, and join date.
 * Shows an edit button if the profile belongs to the currently logged-in user.
 */
export default function UserCard({ profile }) {
  const { userInfo } = useStore();
  const navigate = useNavigate();
  const isCurrentUser = Number(userInfo.user_id) === Number(profile.user_id);

  const parsedJoinDate = parse(profile.created_at, "HH:mm:ss dd/MM/yyyy", new Date());

  return (
    <div className="text-center border rounded p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
      <img
        src={`${BACKEND}/${profile.avatar}`}
        alt="User Avatar"
        className="rounded-circle mb-3"
        style={{ width: "120px", height: "120px", objectFit: "cover" }}
      />
      <h4 className="mb-2">{profile.username}</h4>
      <p className="text-muted">{profile.email}</p>
      <span className={`badge ${profile.role === "admin" ? "bg-secondary" : "bg-primary"}`}>
        {profile.role === "admin" ? "Admin" : "Coder"}
      </span>
      <p className="text-muted mt-2">
        Joined {formatDistanceToNow(parsedJoinDate, { addSuffix: true })}
      </p>

      {isCurrentUser && (
        <Button variant="outline-primary" className="mt-3" size="sm" onClick={() => navigate("/profile/edit")}>
          Edit Profile
        </Button>
      )}
    </div>
  );
}