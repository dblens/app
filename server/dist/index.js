#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const opn = require("opn");
const path = require("path");
const minimist = require("minimist");
const pg_1 = require("pg");
const { Express, Request, Response } = express;
const app = express();
const pArgs = process.argv.slice(2);
const connectionString = pArgs[0] || null; // The first argument passed
if (!connectionString) {
    console.error("Error: Connection string is required.");
    process.exit(1);
}
const args = minimist(pArgs);
const port = args.port || process.env.PORT || 3253;
// Function to connect to the PostgreSQL database
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new pg_1.Client({
        connectionString,
    });
    try {
        yield client.connect();
        console.log("Connected to the database");
        console.log("starting server...", __dirname);
        // Path to the static files
        // const staticPath: string = path.join(__dirname, "../web/out");
        const staticPath = path.join(__dirname, "../../web/out");
        // Serve static files from the 'web/out' folder
        app.use(express.static(staticPath));
        // Serve index.html for the root route
        app.get("/", (req, res) => {
            res.sendFile(path.join(staticPath, "index.html"));
        });
        // Serve index.html for the dashboard route
        app.get("/dashboard", (req, res) => {
            res.sendFile(path.join(staticPath, "dashboard.html"));
        });
        // Serve index.html for all other routes (to support client-side routing)
        app.get("*", (req, res) => {
            res.sendFile(path.join(staticPath, "index.html"));
        });
        const server = app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
            console.log(`Opening logscreen on http://localhost:${port}`);
            opn(`http://localhost:${port}`); // Open the browser
        });
    }
    catch (error) {
        console.error("Error connecting to the database:", error.message);
        console.error("Failed to connect to the database. Exiting...");
        process.exit(1);
    }
});
// Call the function to connect to the database
connectToDB();
