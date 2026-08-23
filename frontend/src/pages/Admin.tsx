import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getVehicles, deleteVehicle, restockVehicle, type Vehicle } from "../services/api";

export default function Admin() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [msg, setMsg] = useState("");
  async function load(){ try{setVehicles((await getVehicles()).vehicles)}catch(e){setMsg(e instanceof Error?e.message:"Failed")} }
  useEffect(()=>{load()},[]);
  async function del(id:number){ if(!confirm("Delete this vehicle?")) return; try{setMsg((await deleteVehicle(id)).message);load()}catch(e){setMsg(e instanceof Error?e.message:"Delete failed")} }
  async function restock(id:number){ const q=Number(prompt("Quantity to add:")); if(!q)return; try{setMsg((await restockVehicle(id,q)).message || "Restocked");load()}catch(e){setMsg(e instanceof Error?e.message:"Restock failed")} }
  return <><Navbar/><main className="max-w-7xl mx-auto p-8"><h1 className="text-4xl font-bold">Admin Panel</h1>{msg&&<p className="mt-4 bg-blue-50 p-3 rounded">{msg}</p>}<div className="bg-white rounded-2xl shadow mt-7 overflow-auto"><table className="w-full"><thead><tr className="bg-gray-100"><th className="p-4 text-left">Vehicle</th><th className="p-4 text-left">Category</th><th className="p-4 text-left">Price</th><th className="p-4 text-left">Qty</th><th className="p-4 text-left">Actions</th></tr></thead><tbody>{vehicles.map(v=><tr className="border-t" key={v.id}><td className="p-4">{v.make} {v.model}</td><td className="p-4">{v.category}</td><td className="p-4">${v.price}</td><td className="p-4">{v.quantity}</td><td className="p-4"><button onClick={()=>restock(v.id)} className="bg-green-600 text-white px-3 py-2 rounded mr-2">Restock</button><button onClick={()=>del(v.id)} className="bg-red-600 text-white px-3 py-2 rounded">Delete</button></td></tr>)}</tbody></table></div></main></>;
}