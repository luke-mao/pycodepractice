import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND } from "../static/Constants";
import { useStore } from "../store/store";
import { formatDistanceToNow, parse } from "date-fns";
import { Spinner, Button } from "react-bootstrap";

/**
 * OtherProfilePage Component
 *
 * Displays the public profile of a user based on their ID.
 * Shows profile details and an edit button if the profile belongs to the logged-in user.
 */
export default function OtherProfilePage({ userId }) {
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND}/profile/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Format the timestamp
  const parsedJoinDate = profile 
    ? parse(profile.created_at, "HH:mm:ss dd/MM/yyyy", new Date()) 
    : null;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : profile ? (
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
            {parsedJoinDate ? `Joined ${formatDistanceToNow(parsedJoinDate, { addSuffix: true })}` : ""}
          </p>

          {/* Edit Profile Button (only for the logged-in user) */}
          {Number(parseInt(userId)) === Number(userInfo.user_id) && (
            <Button variant="outline-primary" className="mt-3" size="sm" onClick={() => navigate("/profile/edit")}>
              Edit Profile
            </Button>
          )}
        </div>
      ) : (
        <p className="text-danger">User not found</p>
      )}
    </div>
  );
}