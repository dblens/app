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
exports.executePgHandler = void 0;
const pg_1 = require("pg");
function executeQueries(client, queries) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        for (const query of queries) {
            const startTime = process.hrtime();
            try {
                const result = yield client.query(query);
                const duration = process.hrtime(startTime);
                if (Array.isArray(result)) {
                    const rows = result.reduce((acc, val) => acc.concat(val.rows), []);
                    results.push({
                        status: "SUCCESS",
                        rows,
                        duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
                    });
                }
                else {
                    results.push({
                        status: "SUCCESS",
                        rows: result.rows,
                        duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
                    });
                }
            }
            catch (error) {
                console.error("Error executing query:", error);
                if (isConnectionError(error)) {
                    console.log("Connection error detected. Retrying query...");
                    try {
                        // Reconnect the client
                        client = yield getPgConnection();
                        const result = yield client.query(query);
                        const duration = process.hrtime(startTime);
                        if (Array.isArray(result)) {
                            const rows = result.reduce((acc, val) => acc.concat(val.rows), []);
                            results.push({
                                status: "SUCCESS",
                                rows,
                                duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
                            });
                        }
                        else {
                            results.push({
                                status: "SUCCESS",
                                rows: result.rows,
                                duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
                            });
                        }
                    }
                    catch (retryError) {
                        console.error("Error executing query on retry:", retryError);
                        results.push({
                            status: "ERROR",
                            description: retryError,
                            rows: [],
                            duration: 0,
                        });
                    }
                }
                else {
                    results.push({
                        status: "ERROR",
                        description: error,
                        rows: [],
                        duration: 0,
                    });
                }
            }
        }
        return results;
    });
}
// Utility function to check for connection errors
function isConnectionError(error) {
    // Implement logic to check if the error is a connection error
    // This could be based on error codes, messages, or other properties
    // Example:
    // return error.code === 'ECONNRESET' || error.code === 'ENOTFOUND';
    return (error.code === "ECONNRESET" ||
        error.code === "ENOTFOUND" ||
        error.message.includes("Connection terminated"));
}
// Dummy getPgConnection function for illustration
function getPgConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        // Implement your logic to establish and return a new client connection
        // Example:
        const newClient = new pg_1.Client({
            connectionString: process.env.DATABASE_URL,
        });
        yield newClient.connect();
        return newClient;
    });
}
const executePgHandler = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queries } = req.body;
    // console.log(queries)
    const results = yield executeQueries(client, queries);
    try {
        res.status(200).json({
            message: "Queries execution completed, please check individual query status from the results",
            data: results,
        });
        return;
    }
    catch (error) {
        console.error("Error executing queries:", error);
        res
            .status(500)
            .json({ message: "Error executing queries", error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.executePgHandler = executePgHandler;
