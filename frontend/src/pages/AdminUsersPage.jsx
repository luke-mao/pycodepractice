import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Row, Col, Card } from "react-bootstrap";
import { BACKEND } from "../static/Constants";
import { useModal, useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { convertTimeToDistance } from "../static/util";
import capitalize from "capitalize";

/**
 * UserTable Component
 *
 * Renders a table of user accounts with profile info, join date, and action buttons.
 * Admins can view user profiles and toggle account activation status.
 */
function UserTable ({ title, userList, reload }) {
  const { showModal } = useModal();

  const navigate = useNavigate();
  const { userInfo } = useStore();

  const actionOnUser = async (user_id, to_activate) => {
    const url = `${BACKEND}/admin/users/${user_id}/${to_activate ? "activate" : "deactivate"}`;
    const config = { headers: { Authorization: userInfo.token } };

    try {
      await axios.post(url, {}, config);
      reload();

      showModal({
        title: "User Status Updated",
        body: `The account has been ${to_activate ? "activated" : "deactivated"}`,
        showCancelButton: false,
        onOk: () => { },
      });
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header as="h5">{title}</Card.Header>
      <Card.Body className="p-0">
        <Table responsive bordered hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{`${user.username} ${userInfo.user_id === user.user_id ? "(Me)" : ""} `}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === "admin" ? "bg-secondary" : "bg-primary"}`}>
                    {capitalize(user.role)}
                  </span>
                </td>
                <td>{convertTimeToDistance(user.created_at)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-3"
                    onClick={() => navigate(`/profile/${user.user_id}`)}
                  >
                    View Profile
                  </Button>
                  {userInfo.user_id !== user.user_id && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={()=>actionOnUser(user.user_id, !user.is_activate)}
                    >
                      {user.is_activate ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

/**
 * AdminUsersPage Component
 *
 * Displays a dashboard for administrators to view and manage all user accounts.
 * Separates users into admin and regular user tables, and provides actions like profile viewing and activation toggling.
 */
export default function AdminUsersPage() {
  const { userInfo } = useStore();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND}/admin/users`, {
        headers: { Authorization: userInfo.token },
      });

      const data = res.data;
      setAdmins(data.filter((u) => u.role === "admin"));
      setUsers(data.filter((u) => u.role === "user"));
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div className="container mt-4 pb-5">
      <h4 className="mb-4"> Admin Dashboard - All Users</h4>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <UserTable title="👑 Admin Accounts" userList={admins} reload={fetchUsers} />
            </Col>
          </Row>
          <Row>
            <Col>
              <UserTable title="🧑 User Accounts" userList={users} reload={fetchUsers} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
