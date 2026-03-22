import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, "..", "fixtures");

export function loadFixture(name) {
    const filePath = path.join(fixturesDir, name);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
