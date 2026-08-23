import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    try {
      const data = await login(username, password);
      localStorage.setItem("access_token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8"><div className="text-5xl">🚗</div><h1 className="text-3xl font-bold mt-2">Car Dealership</h1><p className="text-gray-500">Inventory Management System</p></div>
        <label className="block font-semibold mb-2">Username</label>
        <input className="w-full border rounded-lg p-3 mb-5" value={username} onChange={e => setUsername(e.target.value)} required />
        <label className="block font-semibold mb-2">Password</label>
        <input type="password" className="w-full border rounded-lg p-3 mb-5" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Login</button>
        <p className="text-center mt-5">Don't have an account? <Link className="text-blue-600 font-semibold" to="/register">Register</Link></p>
      </form>
    </div>
  );
}