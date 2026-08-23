import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-blue-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold">🚗 Car Dealership</Link>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/vehicles">Vehicles</Link>
          {user?.role === "admin" && <><Link to="/add-vehicle">Add Vehicle</Link><Link to="/admin">Admin</Link></>}
          <span>{user?.username}</span>
          <button onClick={signOut} className="bg-white text-blue-700 px-4 py-2 rounded-lg">Logout</button>
        </div>
      </div>
    </nav>
  );
}
