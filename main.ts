// main.ts — generator for "One Line of Earned Pride"
// (make.fun bounty u-mang-one-line-of-earned-pride-a0138557)
//
// The brief: one line, 1–240 characters, written to output/entry.txt —
// a quiet, earned moment of pride for someone in a scene: a small person
// doing something hard, or a long effort finally landing. The house judge
// ranks entries on genuine earned pride, a concrete scene with a real
// person, landing in one read, and freshness.
//
// Node only, no dependencies. Writes the line, reads it back, and
// validates it byte-for-byte before exiting 0.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The entry line.
//
// Candidate lines considered (each judged on the brief's four criteria):
//   A. "After eleven years of night shifts, Rosa set her mother's paid-off
//      mortgage papers on the kitchen table and finally sat down to eat
//      with both hands free."
//      -> CHOSEN. The effort is long and specific (eleven years of night
//         shifts), the payoff is concrete and verifiable (paid-off mortgage
//         papers), the scene is domestic and quiet (kitchen table), and the
//         pride lands in one small physical detail — eating with both hands
//         free, i.e. no longer carrying the weight. No cliché ("dreams come
//         true"), no abstraction, no profanity. One read, one image.
//   B. "The boy who once hid his stutter behind his hand stood at the
//      school assembly, read his poem to the last line, and heard his own
//      name in the applause."
//      -> Good scene and a real hard thing overcome, but "heard his own
//         name in the applause" is slightly sentimental and the pride is
//         public rather than quiet; the brief asks for a quiet moment.
//   C. "At 68, after three failed harvests, old Tomás held up his first
//      full basket of tomatoes and his granddaughter took the photo he had
//      waited a decade to pose for."
//      -> Concrete and earned, but the photo framing splits the moment in
//         two (the basket, then the photo) and dilutes the single-read
//         landing; the pride is observed rather than felt.
// ---------------------------------------------------------------------------
const ENTRY =
  "After eleven years of night shifts, Rosa set her mother's paid-off mortgage papers on the kitchen table and finally sat down to eat with both hands free.";

const MAX_CHARS = 240;
const MIN_CHARS = 1;

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "./output";
const outFile = join(outDir, "entry.txt");

// ---------------------------------------------------------------------------
// Validation — the line must satisfy the brief exactly, and what is on disk
// must be byte-identical to the intended line. Any failure is fatal: a
// malformed entry is worse than no entry, so exit non-zero.
//   * 1–240 characters (code points, not UTF-16 units — the line is ASCII
//     here, but counting code points is the correct rule for the brief).
//   * Exactly one line: no newline characters inside the entry.
//   * Not only whitespace.
//   * File contents, after stripping the single trailing newline we write,
//     equal ENTRY exactly.
// ---------------------------------------------------------------------------
function fail(message: string): never {
  console.error(`validation failed: ${message}`);
  process.exit(1);
}

function validate(line: string): void {
  const codePoints = [...line].length;
  if (codePoints < MIN_CHARS) fail(`line is empty (min ${MIN_CHARS} char)`);
  if (codePoints > MAX_CHARS) {
    fail(`line is ${codePoints} code points, over the ${MAX_CHARS} limit`);
  }
  if (/\r|\n/.test(line)) fail("line contains a newline — must be a single line");
  if (!line.trim()) fail("line is only whitespace");
}

// ---------------------------------------------------------------------------
// Main — write, read back, validate, report. Writing with a single trailing
// newline is the conventional text-file form; the read-back check strips
// exactly that one newline before comparing, so the entry itself is the
// validated line and nothing else.
// ---------------------------------------------------------------------------
function main(): void {
  validate(ENTRY);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, ENTRY + "\n", "utf8");

  const onDisk = readFileSync(outFile, "utf8");
  const stripped = onDisk.endsWith("\n") ? onDisk.slice(0, -1) : onDisk;
  if (stripped !== ENTRY) {
    fail("file contents differ from the intended line");
  }
  validate(stripped);

  console.log(`wrote ${outFile}`);
  console.log(`characters: ${[...ENTRY].length} (limit ${MAX_CHARS})`);
  console.log(`entry: ${ENTRY}`);
  console.log("validation: OK");
}

main();
