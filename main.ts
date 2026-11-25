// One Line of Earned Pride — make.fun entry
// Writes a single line of text (1–240 chars) to entry.txt.
//
// The line: a quiet, earned moment of pride. After three winters of
// frozen fingers and stripped screws, old Tomas gets the village
// church clock ticking again and stands in the empty square listening
// to it strike twelve — a long effort finally landing, shown in a
// concrete scene, the pride arriving with the last words, never
// asserted or congratulated. No trophy, no podium, no graduation.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "After three winters of frozen fingers and stripped screws, old Tomas got the church clock ticking again, and stood in the empty square listening to it strike twelve like it knew his name.";

function resolveOutputPath(): string {
  const dir =
    process.env.MAKEFUN_OUTPUT_DIR ||
    process.env.OUTPUT_PATH ||
    join(process.cwd(), "output");
  return join(dir, "entry.txt");
}

function main(): void {
  // Gate: UTF-8 text, 1–240 characters, not only whitespace, one line.
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 240) {
    throw new Error(`entry is ${chars} characters, must be 1–240`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }

  const outPath = resolveOutputPath();
  mkdirSync(join(outPath, ".."), { recursive: true });
  // No trailing newline: the file is exactly the line, byte for byte.
  writeFileSync(outPath, ENTRY, "utf8");
  console.log(`wrote ${outPath} (${chars} chars)`);
}

main();
