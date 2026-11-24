import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_LENGTH = 200;
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = "entry.txt";

const ENTRY =
  "The AI’s loading screen just hit 99%—yours just hit “Why did you do that?”—progress bars are just two sides of the same infinite loop.";

function validateEntry(entry: string): void {
  // Count Unicode code points, not UTF-16 units, so the limit matches what a reader sees.
  const length = [...entry].length;
  if (length === 0) {
    throw new Error("Entry is empty");
  }
  if (length > MAX_LENGTH) {
    throw new Error(`Entry is ${length} characters; the limit is ${MAX_LENGTH}`);
  }
}

if (process.argv.includes("--self-test")) {
  let result = "PASS";
  try {
    validateEntry(ENTRY);
  } catch (err) {
    result = `FAIL (${(err as Error).message})`;
  }
  console.log(`characters: ${[...ENTRY].length}`);
  console.log(`bytes: ${Buffer.byteLength(ENTRY, "utf8")}`);
  console.log(`validation: ${result}`);
  process.exit(result === "PASS" ? 0 : 1);
}

validateEntry(ENTRY);

const outputPath = join(OUTPUT_DIR, OUTPUT_FILE);
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(outputPath, ENTRY, "utf8");

const written = readFileSync(outputPath, "utf8");
if (written !== ENTRY) {
  throw new Error(`Read-back mismatch: ${outputPath} does not match the entry`);
}
console.log(`OK: wrote ${[...ENTRY].length} characters to ${outputPath} (read-back verified)`);
