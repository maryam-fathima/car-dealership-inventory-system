import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/api";

export default function Dashboard() {
  const user = getCurrentUser();
  return <><Navbar /><main className="max-w-7xl mx-auto p-8">
    <h1 className="text-4xl font-bold">Welcome, {user?.username}! 👋</h1>
    <p className="text-gray-500 mt-2">Car Dealership Inventory Management System</p>
    <div className="grid md:grid-cols-3 gap-6 mt-10">
      <Link to="/vehicles" className="bg-blue-600 text-white p-6 rounded-2xl"><h2 className="text-2xl font-bold">🚗 Vehicles</h2><p>View and search inventory.</p></Link>
      {user?.role === "admin" && <Link to="/add-vehicle" className="bg-green-600 text-white p-6 rounded-2xl"><h2 className="text-2xl font-bold">➕ Add Vehicle</h2><p>Add inventory.</p></Link>}
      <div className="bg-white p-6 rounded-2xl shadow"><h2 className="text-2xl font-bold">👤 Account</h2><p className="mt-2">Role: {user?.role}</p></div>
    </div>
  </main></>;
}