"use client";

import { useState } from "react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Appearance</h1>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border p-2 rounded text-black"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
