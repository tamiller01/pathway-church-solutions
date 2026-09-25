"use client";

import { useEffect, useState } from "react";

export default function SermonsPage() {
  const [sermons, setSermons] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/sermons/list");
      const data = await res.json();
      setSermons(data.sermons || []);
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-bold text-navy-900">Saved Sermons</h1>
      <ul className="space-y-3">
        {sermons.map((s) => (
          <li key={s.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold text-navy-900">{s.title || "Untitled Sermon"}</p>
              <p className="text-slate-600 text-sm">
                {s.passage} • {s.topic} • {s.audience}
              </p>
            </div>
            <a
              href={`/sermons/${s.id}`}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
