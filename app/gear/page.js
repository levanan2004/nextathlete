"use client";
import { useEffect, useState } from "react";

export default function GearListPage() {
  const [gear, setGear] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGear() {
      const res = await fetch("/api/gear_listings");
      const data = await res.json();
      setGear(data);
      setLoading(false);
    }
    fetchGear();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h1>Danh sách dụng cụ thể thao</h1>
      <ul>
        {gear.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.sport} - {item.price}₫
          </li>
        ))}
      </ul>
    </div>
  );
}
