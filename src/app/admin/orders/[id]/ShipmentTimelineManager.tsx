"use client";

import { useState } from "react";
import { addShipmentEvent } from "../../actions";
import { Loader2, Plus, MapPin } from "lucide-react";
import { Shipment, ShipmentEvent } from "@prisma/client";

type ShipmentWithEvents = Shipment & { events: ShipmentEvent[] };

export default function ShipmentTimelineManager({ shipment }: { shipment: ShipmentWithEvents }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status || !location) return;

    setLoading(true);
    try {
      await addShipmentEvent(shipment.id, { status, location, description });
      setStatus("");
      setLocation("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6 mt-6">
      <h3 className="font-bold text-lg border-b pb-2">Shipment Timeline (Manual Updates)</h3>

      <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-4">
        {shipment.events.map((event) => (
          <div key={event.id} className="relative pl-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <p className="font-bold text-gray-900">{event.status}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {event.location}
                </p>
                {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {shipment.events.length === 0 && (
          <p className="text-sm text-gray-500 pl-6 italic">No manual events added yet.</p>
        )}
      </div>

      <form onSubmit={handleAddEvent} className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-bold text-gray-700">Add New Event</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            type="text"
            placeholder="Status (e.g. Arrived)"
            className="w-full p-2 border rounded text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <input
            required
            type="text"
            placeholder="Location (e.g. Delhi Hub)"
            className="w-full p-2 border rounded text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <textarea
          placeholder="Description (Optional)"
          className="w-full p-2 border rounded text-sm h-20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-walnut text-white py-2 rounded text-sm font-medium hover:bg-opacity-90 flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add Event</>}
        </button>
      </form>
    </div>
  );
}
