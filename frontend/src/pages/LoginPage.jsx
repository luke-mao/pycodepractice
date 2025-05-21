import React, { useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useModal, useStore } from "../store/store";
import axios from "axios";
import { BACKEND } from "../static/Constants";

/**
 * LoginPage Component
 *
 * Provides a login form where users can authenticate using either email or username and password.
 * Handles account deactivation checks and updates global state on successful login.
 */
export default function LoginPage() {
  // allow the user to choose email + password or username + password
  const [loginType, setLoginType] = useState("email");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({ emailOrUsername: "", password: "" });

  const navigate = useNavigate();
  const { showModal } = useModal();
  const { updateUserInfo } = useStore();

  // handle input changes
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { emailOrUsername, password } = credentials;
    
    // Prepare login data based on loginType
    const loginData = {
      password,
    };
  
    if (loginType === "email") {
      loginData.email = emailOrUsername;
    } else {
      loginData.username = emailOrUsername;
    }
  
    try {
      // Send login request
      const response = await axios.post(`${BACKEND}/account/login`, loginData);
      const user = response.data;

      // if the user.is_activate is false, show a modal to say: 
      // Your account has been deactivated. Please contact the administrator via email: Admin@mail.com
      if (!user.is_activate) {
        showModal({
          title: "Account Deactivated",
          body: "Your account has been deactivated. Please contact the administrator via email: Admin@mail.com",
          showCancelButton: false,
          onOk: () => {},
        });
      } else {
        // Update global store
        updateUserInfo(user);
    
        // Navigate to main page with login success modal
        navigate("/", {
          state: { loginSuccess: true, username: user.username },
          replace: true,
        });
      }
    } catch (error) {
      showModal({
        title: "Login Failed",
        body: error.response?.data?.message || "Login failed. Please check your credentials and try again.",
        showCancelButton: false,
        onOk: null,
      });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center pt-5">
      <div className="p-4 border rounded shadow-sm bg-white" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Welcome Back</h3>
        <Form>
          <Form.Group className="mb-3 d-flex justify-content-center">
            <Form.Check
              inline
              label="Email"
              type="radio"
              name="loginType"
              value="email"
              checked={loginType === "email"}
              onChange={() => setLoginType("email")}
            />
            <Form.Check
              inline
              label="Username"
              type="radio"
              name="loginType"
              value="username"
              checked={loginType === "username"}
              onChange={() => setLoginType("username")}
            />
          </Form.Group>

          {/* Email or Username Input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder={loginType === "email" ? "Enter your email" : "Enter your username"}
              name="emailOrUsername"
              value={credentials.emailOrUsername}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Can see raw password or ******* */}
          <Form.Group className="mb-4">
            <InputGroup>
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* Login Button */}
          <Button variant="primary" className="w-100" onClick={handleSubmit}>
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}
