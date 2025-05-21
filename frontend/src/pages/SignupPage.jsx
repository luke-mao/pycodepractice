import React, { useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { useModal, useStore } from "../store/store";
import axios from "axios";
import { BACKEND } from "../static/Constants";
import { useNavigate } from "react-router";

/**
 * SignupPage Component
 *
 * Renders a registration form for new users to sign up using username, email, and password.
 * Validates input fields, enforces password strength, and handles submission with feedback modals.
 */
export default function SignupPage() {
  const { showModal } = useModal();
  const { updateUserInfo } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // get the form data
    const { username, email, password, confirmPassword } = formData;

    // empty fields are checked by the react-bootstrap Form component,
    // so no need to check them here.
    // Validate email
    if (!isEmail(email)) {
      showModal({
        title: "Form Error: Invalid Email",
        body: "Please enter a valid email address.",
        showCancelButton: false,
        onOk: () => {},
      });
      return;
    }
  
    // Validate strong password
    if (!isStrongPassword(password)) {
      showModal({
        title: "Form Error: Weak Password",
        body: "Password must include uppercase, lowercase, numbers, and symbols, and be at least 8 characters long.",
        showCancelButton: false,
        onOk: () => {},
      });
      return;
    }
  
    // Confirm passwords match
    if (password !== confirmPassword) {
      showModal({
        title: "Password Mismatch",
        body: "Passwords do not match. Please re-enter.",
        showCancelButton: false,
        onOk: () => {},
      });
      return;
    }
  
    // Send the request
    const url = `${BACKEND}/account/register`;
    const data = { username, email, password };

    try {
      const response = await axios.post(url, data);
      const user = response.data;
      
      // tell the / route that the user is logged in
      navigate("/", {
        state: { signupSuccess: true, username: user.username },
        replace: true,
      });
      updateUserInfo(user);
    } catch (error) {
      showModal({
        title: "Signup Failed",
        body: error.response?.data?.message || "An error occurred. Please try again later.",
        showCancelButton: false,
        onOk: null,
      });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center pt-5">
      <div className="p-4 border rounded shadow-sm bg-white" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Create New Account</h3>
        
        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? "🙈" : "👁️"}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* Sign Up Button */}
          <Button variant="primary" type="submit" className="w-100">
            Sign Up Now
          </Button>
        </Form>
      </div>
    </Container>
  );
}
