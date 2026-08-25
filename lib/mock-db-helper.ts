import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "lib", "mock-db.json");

export function getMockDb() {
  if (fs.existsSync(MOCK_FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf-8"));
    } catch (e) {
      console.error("Error reading mock database:", e);
    }
  }
  return {};
}

export function saveMockDb(data: any) {
  fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
