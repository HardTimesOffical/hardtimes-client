"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";

export default function ProfileEditor({ user }: { user: any }) {
  const auth = useAuth();
  const isOwner = auth.user?.id === user._id;

  const [bio, setBio] = useState(user.bio);

  if (!isOwner) return null;

  const save = async () => {
    await axios.put(
      `http://localhost:5000/users/${user._id}`,
      { bio },
      {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      }
    );
  };

  return (
    <div>
      <textarea value={bio} onChange={e => setBio(e.target.value)} />
      <button onClick={save}>Save</button>
    </div>
  );
}
