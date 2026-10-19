const SEQUENCE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

/**
 * Returns a key handler that calls `onMatch` once the Konami code (up up down down left right left right b a)
 * has been typed. A wrong key starts over, but keeps the key if it could be the start of a new attempt.
 */
export function createKonami(onMatch: () => void): (key: string) => void {
  let position = 0;
  return (key: string) => {
    const pressed = key.toLowerCase();
    if (pressed === SEQUENCE[position]) {
      position += 1;
      if (position === SEQUENCE.length) {
        position = 0;
        onMatch();
      }
    } else {
      position = pressed === SEQUENCE[0] ? 1 : 0;
    }
  };
}
