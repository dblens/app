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
function executeQueries(client, queries) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        for (const query of queries) {
            const startTime = process.hrtime();
            try {
                const result = yield client.query(query);
                const duration = process.hrtime(startTime);
                // if type of result is array, then rows need to be merged from root level result array
                if (Array.isArray(result)) {
                    const rows = result.reduce((acc, val) => {
                        return acc.concat(val.rows);
                    }, []);
                    results.push({
                        status: "SUCCESS",
                        rows,
                        duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
                    });
                    continue;
                }
                else
                    results.push({
                        status: "SUCCESS",
                        rows: result.rows,
                        duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
                    });
            }
            catch (error) {
                console.error("Error executing query:", error);
                results.push({
                    status: "ERROR",
                    description: error,
                    rows: [],
                    duration: 0,
                });
            }
        }
        return results;
    });
}
const executePgHandler = (client) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queries } = req.body;
    // console.log(queries)
    const results = yield executeQueries(client, queries);
    try {
        res
            .status(200)
            .json({
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
