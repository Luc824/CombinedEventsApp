import React from "react";
import { Agentation } from "agentation";

/** Dev-only web toolbar for annotating UI for AI agents. */
export default function AgentationMount() {
  if (!__DEV__) {
    return null;
  }

  return <Agentation />;
}
