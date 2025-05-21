import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { BACKEND } from "../static/Constants";
import { useModal, useStore } from "../store/store";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

/**
 * EditProfile Component
 *
 * Allows users to update their profile details including username, email, password, and avatar.
 * Validates inputs and only sends changes that differ from the current profile data.
 */
export default function EditProfile() {
  const { showModal } = useModal();
  const { userInfo, updateUserInfo } = useStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND}/profile/${userInfo.user_id}`);
        const profile = response.data;

        // Prefill user details
        setUsername(profile.username);
        setEmail(profile.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userInfo.user_id]);

  const updateProfile = async (e) => {
    e.preventDefault();
  
    // Create FormData object for updates
    const formData = new FormData();
    let hasUpdates = false;
  
    // Append only changed fields
    if (username !== userInfo.username) {
      formData.append("username", username);
      hasUpdates = true;
    }
  
    if (email !== userInfo.email) {
      // Validate email
      if (!isEmail(email)) {
        showModal({
          title: "Invalid Email",
          body: "Please enter a valid email address.",
          showCancelButton: false,
          onOk: () => {},
        });

        return;
      }

      formData.append("email", email);
      hasUpdates = true;
    }
  
    if (avatar) {
      formData.append("avatar", avatar);
      hasUpdates = true;
    }
  
    if (password || confirmPassword) {
      // Validate password strength
      if (!isStrongPassword(password, { minLength: 8 })) {
        showModal({
          title: "Weak Password",
          body: "Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.",
          showCancelButton: false,
          onOk: () => {},
        });

        return;
      }
  
      // Check if confirm password matches
      if (password !== confirmPassword) {
        showModal({
          title: "Password Mismatch",
          body: "Confirm password does not match the new password.",
          showCancelButton: false,
          onOk: () => {},
        });

        return;
      }
  
      formData.append("password", password);
      hasUpdates = true;
    }
  
    // No updates? Show message and return
    if (!hasUpdates) {
      showModal({
        title: "No Changes",
        body: "No changes detected. Please update at least one field before saving.",
        showCancelButton: false,
        onOk: () => {},
      });

      return;
    }

    // prepare the fetch
    const url = `${BACKEND}/profile/${userInfo.user_id}/edit`;
    const config = { headers: { Authorization: userInfo.token } };
  
    try {  
      const response = await axios.put(url, formData, config);

      // store the new response.data
      updateUserInfo(response.data);
  
      showModal({
        title: "Success",
        body: "Profile updated successfully!",
        showCancelButton: false,
        onOk: () => navigate(`/profile/${userInfo.user_id}`),
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      showModal({
        title: "Update Failed",
        body: error.response?.data?.message || "An error occurred. Please try again.",
        showCancelButton: false,
        onOk: () => {},
      });
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Edit Profile</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading profile...</p>
        </div>
      ) : (
        <Form onSubmit={updateProfile}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Avatar Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Profile Picture (Leave empty if unchanged)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty if unchanged"
            />
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Leave empty if unchanged"
            />
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex justify-content-between gap-3 mt-3">
            <Button variant="secondary" onClick={() => navigate("/profile/me")}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
