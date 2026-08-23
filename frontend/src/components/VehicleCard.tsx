import type { Vehicle } from "../services/api";

export default function VehicleCard({
  vehicle,
  onPurchase,
}: {
  vehicle: Vehicle;
  onPurchase: (id: number) => void;
}) {
  const getVehicleImage = () => {
    const name = `${vehicle.make} ${vehicle.model}`.toLowerCase();

    if (name.includes("toyota") && name.includes("camry")) {
      return "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb";
    }

    if (name.includes("honda") && name.includes("civic")) {
      return "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6";
    }

    if (name.includes("bmw") && name.includes("x5")) {
      return "https://images.unsplash.com/photo-1555215695-3004980ad54e";
    }

    if (name.includes("ford") && name.includes("mustang")) {
      return "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd";
    }

    if (name.includes("tesla") && name.includes("model 3")) {
      return "https://images.unsplash.com/photo-1560958089-b8a1929cea89";
    }

    return "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">

      <div className="h-52 bg-gray-200">
        <img
          src={getVehicleImage()}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {vehicle.make} {vehicle.model}
        </h2>

        <p className="text-gray-500 mt-1">
          {vehicle.category}
        </p>

        <p className="text-3xl font-bold text-blue-600 mt-4">
          ${vehicle.price.toLocaleString()}
        </p>

        <p className="text-gray-600 mt-2">
          Available:{" "}
          <span className="font-bold">
            {vehicle.quantity}
          </span>
        </p>

        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={vehicle.quantity <= 0}
          className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {vehicle.quantity > 0 ? "Purchase" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}