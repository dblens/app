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
exports.getPgConnection = void 0;
const express = require("express");
const path = require("path");
const minimist = require("minimist");
const pg_1 = require("pg");
const execute_pg_1 = require("./execute_pg");
const cors = require("cors"); // Import CORS middleware
const opn = require('opn');
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
// Enable CORS for all origins
app.use(cors());
const pArgs = process.argv.slice(2);
const connectionString = pArgs[0] || null; // The first argument passed
if (!connectionString) {
    console.error("Error: Connection string is required.");
    process.exit(1);
}
let cachedClient = {};
function getPgConnection(connectionString) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = "123456789"; // Generate cache key from connection string
        if (cachedClient[cacheKey]) {
            // console.log("Using cached PostgreSQL connection.");
            return cachedClient[cacheKey];
        }
        // console.log("Establishing new PostgreSQL connection...");
        let client = new pg_1.Client({
            connectionString,
        });
        try {
            yield client.connect();
            console.log("Connected to PostgreSQL database.");
        }
        catch (initialError) {
            console.log("Attempting connection with sslmode=require...");
            // Try with sslmode=require
            client = new pg_1.Client({
                connectionString,
                ssl: { rejectUnauthorized: false },
            });
            try {
                yield client.connect();
                console.log("Connected to PostgreSQL database with SSL.");
            }
            catch (sslError) {
                console.error("SSL connection error:", sslError);
                throw new Error(sslError.message);
            }
        }
        // Cache the client connection
        cachedClient[cacheKey] = client;
        return client;
    });
}
exports.getPgConnection = getPgConnection;
const args = minimist(pArgs);
const port = args.port || process.env.PORT || 3253;
// Function to connect to the PostgreSQL database and start the server
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getPgConnection(connectionString);
    try {
        // console.log("Database connection established successfully.");
        console.log("Starting dblens server...");
        // Path to the static files
        const staticPath = path.join(__dirname, "./out");
        // Serve static files from the 'web/out' folder
        app.use(express.static(staticPath));
        // Serve index.html for the root route
        app.get("/", (req, res) => {
            res.sendFile(path.join(staticPath, "index.html"));
        });
        // Serve index.html for all other routes (to support client-side routing)
        app.get("*", (req, res) => {
            res.sendFile(path.join(staticPath, "index.html"));
        });
        // API endpoint for executing PostgreSQL queries
        app.post("/api/execute_pg", (0, execute_pg_1.executePgHandler)(client));
        // Start the Express server
        const server = app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`Opening dblens in the default browser...`);
            opn(`https://local.dblens.app`); // Adjust URL as needed
        });
    }
    catch (error) {
        console.error("Error starting dblens server:", error.message);
        process.exit(1);
    }
});
// Call the function to connect to the database and start the server
connectToDB();
