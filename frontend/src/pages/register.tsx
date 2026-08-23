import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    if (password !== confirm) { setMessage("Passwords do not match"); return; }
    try {
      await register(username, password);
      setMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-7">Create Account</h1>
        <input className="w-full border rounded-lg p-3 mb-4" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" className="w-full border rounded-lg p-3 mb-4" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" className="w-full border rounded-lg p-3 mb-4" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        {message && <p className="text-center mb-4">{message}</p>}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Create Account</button>
        <p className="text-center mt-5">Already have an account? <Link className="text-blue-600 font-semibold" to="/login">Login</Link></p>
      </form>
    </div>
  );
}