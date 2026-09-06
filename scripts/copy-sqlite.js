const fs = require("node:fs");
const path = require("node:path");

const sourceDirectory = path.resolve(
    __dirname,
    "..",
    "node_modules",
    "@sqlite.org",
    "sqlite-wasm",
    "dist"
);
const targetDirectory = path.resolve(__dirname, "..", "www", "js", "sqlite");

if (!fs.existsSync(sourceDirectory)) {
    throw new Error(
        `SQLite WASM package not found at ${sourceDirectory}. Run npm install first.`
    );
}

fs.mkdirSync(targetDirectory, { recursive: true });

for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDirectory, entry.name);
    const targetPath = path.join(targetDirectory, entry.name);

    if (entry.isDirectory()) {
        fs.cpSync(sourcePath, targetPath, { recursive: true });
    } else {
        fs.copyFileSync(sourcePath, targetPath);
    }
}

console.log(`Copied SQLite WASM files to ${targetDirectory}`);
