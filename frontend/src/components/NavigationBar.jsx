import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { BACKEND } from "../static/Constants";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import capitalize from "capitalize";

/**
 * NavigationBar Component
 *
 * Renders the main site navigation bar with branding, route links, a challenge search bar, and login/logout controls.
 * Adjusts content based on user authentication and role.
 */
export default function NavigationBar() {
  const { isLogin, clearStore, userInfo } = useStore();
  const navigate = useNavigate();

  const [searchOptions, setSearchOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchSearchIndex = async () => {
      try {
        const res = await fetch(`${BACKEND}/problem/search-index`);
        const data = await res.json();
        setSearchOptions(data);
      } catch (error) {
        console.error("Failed to load challenge search index", error);
      }
    };
    fetchSearchIndex();
  }, []);

  // Handle search selection
  useEffect(() => {
    if (selected.length > 0) {
      const chosen = selected[0];
      navigate(`/challenges/${chosen.problem_id}`);
      setSelected([]); // clear after navigation
    }
  }, [selected, navigate]);

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm" collapseOnSelect>
      <Container>
        {/* Left: Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          PyCodePractice
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Middle: Nav Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-dark">Home</Nav.Link>
            <Nav.Link as={Link} to="/challenges" className="text-dark">Challenges</Nav.Link>

            {isLogin && userInfo.role === "admin" ? (
              <>
                <Nav.Link as={Link} to="/new-challenge" className="text-dark">New Challenge</Nav.Link>
                <Nav.Link as={Link} to="/users" className="text-dark">User Management</Nav.Link>
                <Nav.Link as={Link} to="/analytics" className="text-dark">Analytics</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/ai-tutor" className="text-dark">AI Tutor</Nav.Link>
            )}
          </Nav>

          {/* Right: Search */}
          <div style={{ width: "300px" }} className="me-4">
            <Typeahead
              id="search-bar"
              placeholder="Search challenges..."
              options={searchOptions}
              selected={selected}
              onChange={setSelected}
              minLength={1}
              highlightOnlyResult
              inputProps={{ className: "form-control" }}
              labelKey={(option) => `${option.title} (${capitalize(option.topic.replace("_", " "))})`}
              renderMenuItemChildren={(option) => (
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>{option.title}</span>
                  <span className="badge bg-primary ms-2 text-capitalize">
                    {option.topic.replace("_", " ")}
                  </span>
                </div>
              )}
            />
          </div>

          {/* Right: Auth Buttons */}
          {!isLogin ? (
            <>
              <Button as={Link} to="/login" variant="outline-primary" className="me-2" size="sm">
                Sign In
              </Button>
              <Button as={Link} to="/signup" variant="primary" size="sm">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/profile/me" variant="outline-primary" className="me-2" size="sm">
                <Image
                  src={`${BACKEND}/${userInfo.avatar}`}
                  roundedCircle
                  width={24}
                  height={24}
                />
              </Button>
              <Button
                size="sm"
                variant="light"
                onClick={() => {
                  clearStore();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
