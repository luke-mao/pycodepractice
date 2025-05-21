import React, { useState } from "react";
import NewChallengeForm from "./NewChallengeForm";
import NewChallengeIntro from "./NewChallengeIntro";

/**
 * NewChallenge Component
 *
 * Renders a two-step flow for creating a new coding challenge:
 * an intro screen followed by the challenge form.
 */
export default function NewChallenge() {
  const [showIntro, setShowIntro] = useState(true);
  const finishIntro = () => setShowIntro(false);

  return (
    showIntro ? <NewChallengeIntro finishIntro={finishIntro} /> : <NewChallengeForm />
  );
}
