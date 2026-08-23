import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import { getVehicles, searchVehicles, purchaseVehicle, type Vehicle } from "../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [make, setMake] = useState(""); const [model, setModel] = useState(""); const [category, setCategory] = useState("");
  const [min, setMin] = useState(""); const [max, setMax] = useState(""); const [message, setMessage] = useState("");

  async function load() { try { setVehicles((await getVehicles()).vehicles); } catch (e) { setMessage(e instanceof Error ? e.message : "Failed to load"); } }
  useEffect(() => { load(); }, []);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    try { setVehicles((await searchVehicles({ make, model, category, min_price: min, max_price: max })).vehicles); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Search failed"); }
  }

  async function purchase(id: number) {
    try { const d = await purchaseVehicle(id); setMessage(d.message); await load(); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Purchase failed"); }
  }

  return <><Navbar /><main className="max-w-7xl mx-auto p-8">
    <h1 className="text-4xl font-bold">Vehicle Inventory</h1>
    <form onSubmit={search} className="bg-white p-6 rounded-2xl shadow mt-7">
      <div className="grid md:grid-cols-5 gap-3">
        <input className="border rounded-lg p-3" placeholder="Make" value={make} onChange={e => setMake(e.target.value)} />
        <input className="border rounded-lg p-3" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} />
        <input className="border rounded-lg p-3" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input className="border rounded-lg p-3" placeholder="Min price" type="number" value={min} onChange={e => setMin(e.target.value)} />
        <input className="border rounded-lg p-3" placeholder="Max price" type="number" value={max} onChange={e => setMax(e.target.value)} />
      </div>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">Search</button>
      <button type="button" onClick={() => { setMake(""); setModel(""); setCategory(""); setMin(""); setMax(""); load(); }} className="ml-3 bg-gray-200 px-6 py-2 rounded-lg">Clear</button>
    </form>
    {message && <p className="mt-4 bg-blue-50 p-3 rounded">{message}</p>}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">{vehicles.map(v => <VehicleCard key={v.id} vehicle={v} onPurchase={purchase} />)}</div>
  </main></>;
}