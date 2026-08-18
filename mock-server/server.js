import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const app = express();
const PORT = process.env.PORT || 8080;
const BASE = "/chronology";

app.use(cors());
app.use(express.json());

// ── Helpers ─────────────────────────────────────────────────────────────────

let nextId = 100;
const newId = () => nextId++;

const occasionsUsed = (id) => ({ OccasionsUsed: 2, IsInUse: true, IsInUseByOp: false });
const whereUsed = () => [{ ID: 1, Code: "WU001", Description: "Where used item" }];
const ok = (res, data) => res.json(data);
const notFound = (res) => res.status(404).json({ message: "Not found" });

// ── Seed Data ────────────────────────────────────────────────────────────────

const db = {
	actions: [
		{ ID: 1, Code: "ACT001", Description: "Pick up part", SecsAt100: 3.5, System: false, ReflectLevel: false, OccasionsUsed: 4, IsInUse: true },
		{ ID: 2, Code: "ACT002", Description: "Place part", SecsAt100: 2.8, System: false, ReflectLevel: true, OccasionsUsed: 2, IsInUse: true },
		{ ID: 3, Code: "ACT003", Description: "Inspect seam", SecsAt100: 5.0, System: true, ReflectLevel: false, OccasionsUsed: 0, IsInUse: false },
	],
	steps: [
		{ ID: 1, Code: "STP001", Description: "Prepare fabric", Machining: false, Cutting: false, ValueAdded: true, Level: 1, OccasionsUsed: 3, IsInUse: true, Actions: [] },
		{ ID: 2, Code: "STP002", Description: "Stitch seam", Machining: true, Cutting: false, MachiningFeedRate: 250, ValueAdded: true, Level: 2, OccasionsUsed: 5, IsInUse: true, Actions: [] },
	],
	departments: [
		{ ID: 1, Code: "DEP001", Description: "Cutting", OccasionsUsed: 3, IsInUse: true },
		{ ID: 2, Code: "DEP002", Description: "Sewing", OccasionsUsed: 7, IsInUse: true },
	],
	grades: [
		{ ID: 1, Code: "GRD001", Description: "Grade A", OccasionsUsed: 2, IsInUse: true },
		{ ID: 2, Code: "GRD002", Description: "Grade B", OccasionsUsed: 1, IsInUse: true },
	],
	machines: [
		{ ID: 1, Code: "MCH001", Description: "Single needle lockstitch", OccasionsUsed: 5, IsInUse: true },
		{ ID: 2, Code: "MCH002", Description: "Overlocker", OccasionsUsed: 3, IsInUse: true },
	],
	processes: [
		{ ID: 1, Code: "PRC001", Description: "Sew side seam", DepartmentID: 2, OperationClassID: 1, OperationTypeID: 1, OccasionsUsed: 2, IsInUse: true },
		{ ID: 2, Code: "PRC002", Description: "Attach waistband", DepartmentID: 2, OperationClassID: 1, OperationTypeID: 1, OccasionsUsed: 1, IsInUse: true },
	],
	processclasses: [
		{ ID: 1, Code: "CLS001", Description: "Sewing", OccasionsUsed: 5, IsInUse: true },
		{ ID: 2, Code: "CLS002", Description: "Pressing", OccasionsUsed: 2, IsInUse: true },
	],
	operationtypes: [
		{ ID: 1, Code: "TYP001", Description: "Standard", OccasionsUsed: 3, IsInUse: true },
		{ ID: 2, Code: "TYP002", Description: "Special", OccasionsUsed: 1, IsInUse: true },
	],
	processdefinitions: [
		{ ID: 1, Code: "OPD001", Handling: false, Notes: "Standard sew", Questions: [], Steps: [], Pathtypes: [], PathfeaturesSteps: [], OccasionsUsed: 2, IsInUse: true },
	],
	operationsets: [
		{ ID: 1, Code: "OPS001", Description: "Basic assembly set", Processes: [] },
	],
	designs: [
		{ ID: 1, Code: "STY001", Description: "Shirt A", Season: "SS25", Departments: [] },
		{ ID: 2, Code: "STY002", Description: "Trouser B", Season: "AW25", Departments: [] },
	],
	designdepartments: [
		{ ID: 1, StyleID: 1, DepartmentID: 1, Description: "Cutting dept for Shirt A" },
	],
	stitchingmodifiers: [
		{ ID: 1, Code: "STM001", Description: "Top stitch", Value: 1.1, OccasionsUsed: 3, IsInUse: true },
	],
	pathfeatures: [
		{ ID: 1, Code: "PTF001", Description: "Curve", OccasionsUsed: 1, IsInUse: true },
	],
	pathfiles: [
		{ ID: 1, FileName: "sample-path.csv", Size: 1024, UploadedAt: "2024-01-15T10:00:00Z" },
	],
	definitioncategories: [
		{ ID: 1, Code: "CAT001", Description: "Body measurements", Seq: 1 },
	],
};

// ── Generic CRUD factory ─────────────────────────────────────────────────────

function crudRoutes(router, path, collection) {
	// LIST
	router.get(`/${path}`, (req, res) => ok(res, db[collection]));

	// GET BY ID
	router.get(`/${path}/:id`, (req, res) => {
		const item = db[collection].find((x) => x.ID === +req.params.id);
		return item ? ok(res, item) : notFound(res);
	});

	// CREATE
	router.post(`/${path}`, (req, res) => {
		const item = { ...req.body, ID: newId() };
		db[collection].push(item);
		ok(res, item);
	});

	// UPDATE
	router.put(`/${path}`, (req, res) => {
		const idx = db[collection].findIndex((x) => x.ID === req.body.ID);
		if (idx === -1) return notFound(res);
		db[collection][idx] = { ...db[collection][idx], ...req.body };
		ok(res, db[collection][idx]);
	});

	// DELETE
	router.delete(`/${path}/:id`, (req, res) => {
		const idx = db[collection].findIndex((x) => x.ID === +req.params.id);
		if (idx === -1) return notFound(res);
		db[collection].splice(idx, 1);
		res.status(204).send();
	});

	// OCCASIONS USED
	router.get(`/${path}/occasionsused/:id`, (req, res) => ok(res, occasionsUsed(+req.params.id)));

	// WHERE USED
	router.get(`/${path}/whereused/:id`, (req, res) => ok(res, whereUsed()));

	// COPY
	router.post(`/${path}/copy`, (req, res) => {
		const source = db[collection].find((x) => x.ID === req.body.ID);
		if (!source) return notFound(res);
		const copy = { ...source, ID: newId(), Code: req.body.Code };
		db[collection].push(copy);
		ok(res, copy);
	});
}

// ── Router ───────────────────────────────────────────────────────────────────

const router = express.Router();

// Actions
crudRoutes(router, "actions", "actions");
router.get("/actions/code/:code", (req, res) => {
	const item = db.actions.find((x) => x.Code === req.params.code);
	return item ? ok(res, item) : notFound(res);
});
router.get("/actions/whereused/:id", (req, res) => ok(res, whereUsed()));

// Steps
crudRoutes(router, "steps", "steps");
router.get("/steps/nonmachining", (req, res) => ok(res, db.steps.filter((s) => !s.Machining)));
router.get("/steps/whereused/processes/:id", (req, res) => ok(res, whereUsed()));

// Departments
crudRoutes(router, "departments", "departments");

// Grades
crudRoutes(router, "grades", "grades");

// Machines
crudRoutes(router, "machines", "machines");

// Process classes
crudRoutes(router, "processclasses", "processclasses");

// Process types
crudRoutes(router, "operationtypes", "operationtypes");

// Processes
crudRoutes(router, "processes", "processes");
router.get("/processes/filtered/:deptId/:classId/:typeId", (req, res) => ok(res, db.processes));
router.get("/processes/filtered/consise/:deptId/:classId/:typeId", (req, res) => ok(res, db.processes));
router.get("/processes/whereused/designs/:id", (req, res) => ok(res, whereUsed()));

// Process definitions
crudRoutes(router, "processdefinitions", "processdefinitions");
router.get("/processdefinitions/taskformulacodes", (req, res) =>
	ok(res, [{ ID: 1, Code: "TFC001", Description: "Standard formula" }])
);
router.get("/processdefinitions/occasionsusedonoperations/:id", (req, res) =>
	ok(res, occasionsUsed(+req.params.id))
);
router.put("/processdefinitions/preview", (req, res) =>
	ok(res, [{ ID: 1, Seq: 1, Description: "Preview step", Time_Seconds: 10 }])
);

// Operation sets
crudRoutes(router, "operationsets", "operationsets");

// Designs
crudRoutes(router, "designs", "designs");
router.post("/designs/copy", (req, res) => {
	const source = db.designs.find((x) => x.ID === req.body.ID);
	if (!source) return notFound(res);
	const copy = { ...source, ID: newId(), Code: req.body.Code };
	db.designs.push(copy);
	ok(res, copy);
});
router.get("/designs/:id/export", (req, res) => ok(res, `design_export_${req.params.id}.csv`));

// Design departments
crudRoutes(router, "designdepartments", "designdepartments");

// Settings – general
router.get("/settings/general", (req, res) =>
	ok(res, { ID: 1, CompanyName: "Mock Co.", DefaultLanguage: "en", TimeZone: "UTC" })
);
router.put("/settings/general", (req, res) => ok(res, req.body));

// Settings – cutting elements
router.get("/settings/cuttingelements", (req, res) =>
	ok(res, [{ ID: 1, Code: "CE001", Description: "Cutting allowance", Value: 10 }])
);
router.put("/settings/cuttingelements", (req, res) => ok(res, req.body));

// Settings – machining elements
router.get("/settings/machiningelements", (req, res) =>
	ok(res, [{ ID: 1, Code: "ME001", Description: "Feed rate default", Value: 200 }])
);
router.put("/settings/machiningelements", (req, res) => ok(res, req.body));

// Settings – machining amendments
router.get("/settings/machiningamendments", (req, res) =>
	ok(res, [{ ID: 1, Code: "MA001", Description: "Curve amendment", Value: 1.05 }])
);
router.put("/settings/machiningamendments", (req, res) => ok(res, req.body));

// Settings – stitching characteristics
router.get("/settings/stitchingcharacteristics", (req, res) =>
	ok(res, { ID: 1, DefaultSPI: 12, DefaultNeedleSize: 80, DefaultThreadTension: 3 })
);
router.put("/settings/stitchingcharacteristics", (req, res) => ok(res, req.body));

// Settings – stitching modifiers
crudRoutes(router, "settings/stitchingmodifiers", "stitchingmodifiers");
router.get("/settings/stitchingmodifiers/occasionsused/:id", (req, res) =>
	ok(res, occasionsUsed(+req.params.id))
);

// Settings – process definitions
router.get("/settings/processdefinitions/defaultcutting", (req, res) =>
	ok(res, { ID: 1, CuttingMethodID: 1, CuttingTypeID: 1, FeedSystemID: 1 })
);
router.put("/settings/processdefinitions/defaultcutting", (req, res) => ok(res, req.body));
router.get("/settings/processdefinitions/machining", (req, res) =>
	ok(res, { ID: 1, MachineID: 1, GradeID: 1, MachiningAmendmentID: 1 })
);
router.put("/settings/processdefinitions/machining", (req, res) => ok(res, req.body));

// Settings – definition question columns
router.get("/settings/processdefinitions/questioncolumns", (req, res) =>
	ok(res, db.definitioncategories)
);
router.get("/settings/processdefinitions/questioncolumns/:id", (req, res) => {
	const item = db.definitioncategories.find((x) => x.ID === +req.params.id);
	return item ? ok(res, item) : notFound(res);
});
router.put("/settings/processdefinitions/questioncolumns", (req, res) => ok(res, req.body));

// Settings – path features
crudRoutes(router, "settings/processdefinitions/pathfeatures", "pathfeatures");
router.get("/settings/processdefinitions/pathfeatures/occasionsused/:id", (req, res) =>
	ok(res, occasionsUsed(+req.params.id))
);

// System data
router.get("/system/operationcategories", (req, res) =>
	ok(res, [
		{ ID: 1, Code: "CAT001", Description: "Sewing" },
		{ ID: 2, Code: "CAT002", Description: "Pressing" },
	])
);
router.get("/system/cuttingmethods/natural", (req, res) =>
	ok(res, [{ ID: 1, Code: "CMN001", Description: "Straight cut" }])
);
router.get("/system/cuttingmethods/synthetic", (req, res) =>
	ok(res, [{ ID: 1, Code: "CMS001", Description: "Laser cut" }])
);
router.get("/system/cuttingtypes", (req, res) =>
	ok(res, [{ ID: 1, Code: "CTY001", Description: "Woven" }])
);
router.get("/system/feedsystems", (req, res) =>
	ok(res, [{ ID: 1, Code: "FS001", Description: "Bottom feed" }])
);
router.get("/system/materialtypes", (req, res) =>
	ok(res, [{ ID: 1, Code: "MT001", Description: "Cotton" }, { ID: 2, Code: "MT002", Description: "Polyester" }])
);
router.get("/system/machiningamendments/:categoryId", (req, res) =>
	ok(res, [{ ID: 1, Code: "MA001", Description: "Curve", Value: 1.05, CategoryID: +req.params.categoryId }])
);
router.get("/system/stitchingmodifiers", (req, res) => ok(res, db.stitchingmodifiers));
router.get("/system/units", (req, res) =>
	ok(res, [{ ID: 1, Code: "SEC", Description: "Seconds" }, { ID: 2, Code: "MIN", Description: "Minutes" }])
);

// Audit
router.post("/audit", (req, res) =>
	ok(res, [
		{
			ID: 1,
			Timestamp: new Date().toISOString(),
			UserID: "user1",
			Action: "UPDATE",
			Section: "actions",
			Detail: "Updated action ACT001",
		},
	])
);

// Files – process photos
router.post("/files/photos/processes", (req, res) => res.status(201).json({ message: "Uploaded" }));
router.get("/files/photos/processes/:filename", (req, res) => {
	res.setHeader("Content-Type", "image/png");
	// Return a 1×1 transparent PNG
	const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
	res.send(pixel);
});

// Files – design photos
router.post("/files/photos/designs", (req, res) => res.status(201).json({ message: "Uploaded" }));
router.get("/files/photos/designs/:filename", (req, res) => {
	res.setHeader("Content-Type", "image/png");
	const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
	res.send(pixel);
});

// Files – path files
router.post("/files/pathfiles", (req, res) => res.status(201).json({ message: "Uploaded" }));
router.get("/files/list/pathfiles", (req, res) => ok(res, db.pathfiles));
router.get("/files/content/pathfiles/:filename", (req, res) =>
	ok(res, { FileName: req.params.filename, Content: "mock,path,content\n1,2,3" })
);

// Files – CSV exports
router.get("/files/exists/export/designs/:filename", (req, res) => ok(res, "true"));
router.get("/files/exports/designs/:filename", (req, res) => {
	res.setHeader("Content-Type", "text/csv");
	res.send("code,description\nSTY001,Shirt A\n");
});
router.delete("/files/export/designs/:filename", (req, res) => res.status(204).send());

// Secondary login / logout
router.post("/secondarylogins/login", (req, res) => ok(res, { message: "Logged in", Token: "mock-secondary-token" }));
router.post("/secondarylogins/logout", (req, res) => ok(res, { message: "Logged out" }));

// ── Mount API ────────────────────────────────────────────────────────────────

app.use(BASE, router);

// Unmatched API calls should 404 as JSON, not fall through to the SPA below.
app.use(BASE, (req, res) => notFound(res));

// ── Serve the built SPA (npm run build:app) ─────────────────────────────────
// Lets one Express process host both the mock API and the frontend, so a
// single free host (e.g. Render) can serve the whole app from one origin.

app.use(express.static(distDir));

app.use((req, res, next) => {
	if (req.method !== "GET") return next();
	res.sendFile(path.join(distDir, "index.html"));
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
	console.log(`Mock API mounted at http://localhost:${PORT}${BASE}`);
	console.log("Press Ctrl+C to stop.");
});
