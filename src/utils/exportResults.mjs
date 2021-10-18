import fs from "fs";
import { exec } from "child_process";

export default function (collectionName, marketName, output) {
  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }

  const filename = `./output/${collectionName}-${marketName}.json`;
  fs.writeFileSync(filename, JSON.stringify(output, null, 2));
}
