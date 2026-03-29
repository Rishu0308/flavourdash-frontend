import React, { useEffect } from 'react';
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

const DeliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function DeliveryBoyTracking({ data }) {
  console.log("📦 Delivery Tracking Data:", data);

  const deliveryBoyLat = data?.deliveryBoyLocation.lat || 0;
  const deliveryBoyLon = data?.deliveryBoyLocation.lon || 0;
  const customerLat = data?.customerLocation?.lat || 0;
  const customerLon = data?.customerLocation?.lon || 0;

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <MapContainer style={{ width: "100%", height: "100%" }} center={center} zoom={14}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={DeliveryBoyIcon}>
            <Popup>DeliveryBoy</Popup>
        </Marker>

        <Marker position={[customerLat, customerLon]} icon={customerIcon}>

        </Marker>
        <Polyline positions={path} color='blue' width={16}/>
      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;
