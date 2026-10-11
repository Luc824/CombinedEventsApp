import React, { useEffect, useState } from "react";

type AgentationComponent = React.ComponentType<Record<string, unknown>>;

/**
 * Dev-only web toolbar. Production Metro resolves `agentation` to empty;
 * dynamic import keeps it off the critical path in development too.
 */
export default function AgentationMount() {
  const [Agentation, setAgentation] = useState<AgentationComponent | null>(
    null
  );

  useEffect(() => {
    if (!__DEV__) {
      return;
    }
    let cancelled = false;
    void import("agentation")
      .then((mod) => {
        if (!cancelled && mod?.Agentation) {
          setAgentation(() => mod.Agentation as AgentationComponent);
        }
      })
      .catch(() => {
        // Production stub / missing package — ignore.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!__DEV__ || !Agentation) {
    return null;
  }

  return <Agentation />;
}
