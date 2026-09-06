import sqlite3InitModule from "./sqlite/index.mjs";

console.log("db-worker.js started");

let db;

async function initDatabase() {
    console.log("Initializing SQLite...");

    const sqlite3 = await sqlite3InitModule();

    console.log("SQLite WASM loaded");

    const poolUtil =
        await sqlite3.installOpfsSAHPoolVfs();

    console.log("OPFS SAH pool initialized");

    db = new poolUtil.OpfsSAHPoolDb("/myapp.db");

    console.log("Database opened");

    db.exec(`
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY,
            title TEXT,
            content TEXT
        );

        CREATE TABLE IF NOT EXISTS test (
            id INTEGER PRIMARY KEY,
            value TEXT
        );

        INSERT INTO test(value)
        VALUES ('persistent test');
    `);

    const rows = [];

    db.exec({
        sql: "SELECT * FROM test",
        rowMode: "object",
        callback: row => rows.push(row)
    });

    console.log(rows);

    console.log("cards table created/verified");

    postMessage({
        type: "ready"
    });
}

initDatabase().catch(error => {
    console.error("DB worker error:", error);

    postMessage({
        type: "error",
        message: error.message
    });
});