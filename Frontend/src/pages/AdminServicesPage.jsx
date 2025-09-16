import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    icon: "🛠",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    API.get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post("/services", newService);
    fetchServices();
    setNewService({ name: "", description: "", price: "", icon: "🛠" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      await API.delete(`/services/${id}`);
      fetchServices();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>

      {/* Add new service form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 p-4 border rounded-lg shadow-md space-y-3 bg-white"
      >
        <input
          type="text"
          placeholder="Service Name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={newService.description}
          onChange={(e) =>
            setNewService({ ...newService, description: e.target.value })
          }
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newService.price}
          onChange={(e) =>
            setNewService({ ...newService, price: e.target.value })
          }
          className="border p-2 w-full rounded"
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add Service
        </button>
      </form>

      {/* List of services */}
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service._id}
            className="flex justify-between items-center p-3 border rounded shadow-sm bg-gray-50"
          >
            <span>{service.name} - ₹{service.price}</span>
            <button
              onClick={() => handleDelete(service._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
