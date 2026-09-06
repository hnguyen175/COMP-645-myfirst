import sqlite3InitModule from "./sqlite/index.mjs";

class DatabaseService {
    static db;

    static async initDatabase() {
        console.log("Initializing SQLite...");

        const sqlite3 = await sqlite3InitModule();

        console.log("SQLite WASM loaded");

        const poolUtil =
            await sqlite3.installOpfsSAHPoolVfs();

        console.log("OPFS SAH pool initialized");
        DatabaseService.db = new poolUtil.OpfsSAHPoolDb("/myapp.db");

        console.log("Database opened");

        DatabaseService.createTables();
        DatabaseService.insertTest();
        const rows = DatabaseService.dumpTestData();

        console.log(rows);

        console.log("cards table created/verified");

        DatabaseService.clearData();

        postMessage({
            type: "ready"
        });
    }

    static dumpTestData() {
        const rows = [];
        DatabaseService.db.exec({
            sql: "SELECT * FROM test",
            rowMode: "object",
            callback: row => rows.push(row)
        });
        return rows;
    }

    static createTables() {

        DatabaseService.db.exec(`
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY,
            title TEXT,
            content TEXT
        );

        CREATE TABLE IF NOT EXISTS test (
            id INTEGER PRIMARY KEY,
            value TEXT
        );
        `);
    }

    static insertTest() {
        DatabaseService.db.exec(`
            INSERT INTO test(value)
            VALUES ('persistent test');
        `);
    }

    static clearData(){
        DatabaseService.db.exec(`
            DELETE FROM cards;
            DELETE FROM test;
        `);
    }

};

DatabaseService.initDatabase().catch(error => {
    console.error("DB worker error:", error);
    postMessage({
        type: "error",
        message: error.message
    });
});