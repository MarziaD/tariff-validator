"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const tariffComparison_1 = __importDefault(require("./services/tariffComparison"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use("/api/tariffs", tariffComparison_1.default);
app.post("/api/validate-csv", upload.single("file"), (req, res) => {
    var _a;
    const results = [];
    const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (filePath) {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on("data", (data) => results.push(data))
            .on("end", () => {
            const discrepancies = validateDiscrepancies(results);
            res.json({ message: "CSV received", discrepancies });
        });
    }
    else {
        res.status(400).json({ error: "No file uploaded" });
    }
});
function validateDiscrepancies(inputData) {
    const mockENAPIData = [
        { plan_name: "Basic Plan", price_per_kwh: 0.25 },
        { plan_name: "Value Rate", price_per_kwh: 0.32 },
    ];
    const discrepancies = inputData.filter((item) => {
        return !mockENAPIData.some((apiData) => apiData.plan_name === item.plan_name &&
            apiData.price_per_kwh === parseFloat(item.price_per_kwh));
    });
    return discrepancies;
}
app.get("/", (_, res) => {
    res.send("Hello, World!");
});
app.get("/api/tariffs", (_, res) => {
    res.json({ message: "Tariffs data" });
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
