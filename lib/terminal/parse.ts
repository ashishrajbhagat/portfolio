/**
 * Splits a command line into tokens. Supports single and double quotes,
 * so `echo "hello world"` yields ["echo", "hello world"]. An unterminated
 * quote simply runs to the end of the line.
 */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let hasToken = false;

  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      hasToken = true;
    } else if (/\s/.test(ch)) {
      if (current || hasToken) {
        tokens.push(current);
        current = "";
        hasToken = false;
      }
    } else {
      current += ch;
    }
  }
  if (current || hasToken) tokens.push(current);
  return tokens;
}
