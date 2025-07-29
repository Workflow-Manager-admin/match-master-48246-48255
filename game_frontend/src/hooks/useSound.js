const matchFx = "/match.wav";
const swapFx = "/swap.wav";
const endFx = "/end.wav";

// PUBLIC_INTERFACE
/**
 * Hook to play game sound effects.
 * Usage: const play = useSound("match"); then play();
 */

/* eslint-disable no-undef */
export default function useSound(type) {
  let src = null;
  switch (type) {
    case "match": src = matchFx; break;
    case "swap": src = swapFx; break;
    case "end": src = endFx; break;
    default: return () => {};
  }
  return () => {
    // Avoid lint error for server-side or linter
    if (typeof window !== "undefined" && typeof Audio !== "undefined") {
      const audio = new Audio(src);
      audio.volume = 0.18;
      audio.play();
    }
  };
}
/* eslint-enable no-undef */
