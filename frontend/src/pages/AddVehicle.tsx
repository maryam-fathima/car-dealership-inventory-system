import { useState } from "react";
import Navbar from "../components/Navbar";
import { addVehicle } from "../services/api";

export default function AddVehicle() {
  const [make, setMake] = useState(""); const [model, setModel] = useState(""); const [category, setCategory] = useState(""); const [price, setPrice] = useState(""); const [quantity, setQuantity] = useState(""); const [message, setMessage] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try { const d = await addVehicle({ make, model, category, price: Number(price), quantity: Number(quantity) }); setMessage(d.message || "Vehicle added successfully"); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Failed"); }
  }
  return <><Navbar /><main className="max-w-2xl mx-auto p-8"><div className="bg-white rounded-2xl shadow p-8"><h1 className="text-3xl font-bold">Add Vehicle</h1><form onSubmit={submit} className="space-y-4 mt-6">
    <input className="w-full border rounded p-3" placeholder="Make" value={make} onChange={e=>setMake(e.target.value)} required />
    <input className="w-full border rounded p-3" placeholder="Model" value={model} onChange={e=>setModel(e.target.value)} required />
    <input className="w-full border rounded p-3" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
    <input className="w-full border rounded p-3" placeholder="Price" type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
    <input className="w-full border rounded p-3" placeholder="Quantity" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} required />
    <button className="w-full bg-blue-600 text-white py-3 rounded">Add Vehicle</button>
    {message && <p className="text-center">{message}</p>}
  </form></div></main></>;
}
