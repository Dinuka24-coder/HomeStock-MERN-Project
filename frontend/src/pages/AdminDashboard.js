import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/AdminDashboard.css"; // Import the CSS file

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/users/all-users", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message);
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("userToken");

    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/delete-user/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          if (response.ok) {
            Swal.fire("Deleted!", "User has been removed.", "success");
            setUsers(users.filter((user) => user._id !== userId));
          } else {
            Swal.fire("Error!", data.message, "error");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error!", "Something went wrong!", "error");
        }
      }
    });
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p className="loading-text">Loading users...</p>
        ) : (
          <table className="admin-dashboard-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;
