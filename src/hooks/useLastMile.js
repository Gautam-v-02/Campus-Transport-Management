"use client";

import { useEffect, useState } from "react";

// Custom hook (INT252 Unit III): fetches the rides and refreshes them every few seconds.
// It handles loading and error state, and cleans up when the choice changes or the page closes.
export default function useLastMile({ stop, destination, type, refreshMs = 10000 }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0); // changing this runs the effect again

  useEffect(() => {
    let cancelled = false; // ignore an answer that arrives after the choice has changed

    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ stop, destination, type });
        const res = await fetch(`/api/last-mile?${qs}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Could not load transport options");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, refreshMs);

    // Cleanup: runs before the next effect and when the component is removed
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [stop, destination, type, refreshMs, reloadKey]); // dependency array

  const reload = () => setReloadKey((k) => k + 1);

  return { data, error, loading, reload };
}
