import axios, { AxiosInstance } from "axios";
import type {
	CopyData,
	CuttingStepSettingData,
	CuttingMethodData,
	CuttingTypeData,
	DepartmentData,
	StepData,
	FeedSystemData,
	FileData,
	GeneralSettingsData,
	GradeData,
	MachineData,
	MachiningAmendmentData,
	MachiningStepSettingData,
	MaterialTypeData,
	ActionData,
	OccasionsUsedData,
	ProcessCategoryData,
	ProcessClassData,
	ProcessData,
	ProcessDefinitionData,
	ProcessDefinitionsCategoryData,
	ProcessDefinitionsDefaultCuttingData,
	ProcessDefinitionsMachiningData,
	ProcessDefinitionTaskFormulaCodeData,
	ProcessSetData,
	ProcessTypeData,
	ProcessWhereUsedForDesignItemData,
	PathFeatureData,
	PathFileContentData,
	PreviewProcessDefinitionStepData,
	PreviewProcessDefinitionQuestionsData,
	StitchingCharacteristicsData,
	StitchingModifierData,
	DesignData,
	DesignDepartmentData,
	UnitData,
	WhereUsedItemData,
	AuditData,
	AuditQueryData,
} from "./types";

class Api {
	#instance: AxiosInstance;
	readonly DEPARTMENTS_URL = "departments";
	readonly STEPS_URL = "steps";
	readonly GRADES_URL = "grades";
	readonly MACHINES_URL = "machines";
	readonly ACTIONS_URL = "actions";
	readonly PROCESS_CLASSES_URL = "processclasses";
	readonly PROCESS_DEFINITIONS_URL = "processdefinitions";
	readonly PROCESS_DEFINITIONS_PREVIEW_URL = `${this.PROCESS_DEFINITIONS_URL}/preview`;
	readonly PROCESS_TYPES_URL = "operationtypes";
	readonly PROCESSES_URL = "processes";
	readonly SETTINGS_URL = "settings";
	readonly SYSTEM_URL = "system";
	readonly SETTINGS_PROCESS_DEFINITIONS_URL = `${this.SETTINGS_URL}/processdefinitions`;
	readonly PROCESS_DEFINITION_CATEGORIES_URL = `${this.SETTINGS_PROCESS_DEFINITIONS_URL}/questioncolumns`;
	readonly PROCESS_SETS_URL = "operationsets";
	readonly DESIGNS_URL = "designs";
	readonly DESIGNS_DEPARTMENTS_URL = "designdepartments";
	readonly FILES_URL = "files";
	readonly PROCESS_FILES_URL = `${this.FILES_URL}/photos/processes`;
	readonly DESIGNS_FILES_URL = `${this.FILES_URL}/photos/designs`;
	readonly PATH_FILES_URL = `${this.FILES_URL}/pathfiles`;
	readonly SECONDARY_LOGIN_URL = `secondarylogins/login`;
	readonly SECONDARY_LOGOUT_URL = `secondarylogins/logout`;
	readonly AUDIT_URL = "audit";

	constructor() {
		this.#instance = axios.create({
			baseURL: `${import.meta.env.VITE_API_ENDPOINT}/`,
		});
	}
	setAuthorizationHeader(authHeaderValue: string) {
		this.#instance.defaults.headers.common.Authorization = `Bearer ${authHeaderValue}`;
	}

	//#region actions
	async createAction(action: ActionData) {
		return await this.#instance.post<ActionData>(this.ACTIONS_URL, action);
	}

	async deleteAction(id: number) {
		return await this.#instance.delete(`${this.ACTIONS_URL}/${id}`);
	}

	async copyAction(copyAction: CopyData) {
		return await this.#instance.post(
			`${this.ACTIONS_URL}/copy`,
			copyAction,
		);
	}

	async getActions() {
		return await this.#instance.get<ActionData[]>(this.ACTIONS_URL);
	}

	async getActionOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.ACTIONS_URL}/occasionsused/${id}`,
		);
	}

	async getActionById(id: number) {
		return await this.#instance.get<ActionData>(
			`${this.ACTIONS_URL}/${id}`,
		);
	}

	async getActionByCode(code: string) {
		return await this.#instance.get<ActionData>(
			`${this.ACTIONS_URL}/code/${code}`,
		);
	}

	async getActionWhereUsed(id: number) {
		return await this.#instance.get<WhereUsedItemData[]>(
			`${this.ACTIONS_URL}/whereused/${id}`,
		);
	}

	async updateAction(action: ActionData) {
		return await this.#instance.put<ActionData>(this.ACTIONS_URL, action);
	}
	//#endregion

	//#region steps
	async createStep(step: StepData) {
		return await this.#instance.post<StepData>(this.STEPS_URL, step);
	}

	async deleteStep(id: number) {
		return await this.#instance.delete(`${this.STEPS_URL}/${id}`);
	}

	async copyStep(copyStep: CopyData) {
		return await this.#instance.post(`${this.STEPS_URL}/copy`, copyStep);
	}

	async getSteps() {
		return await this.#instance.get<StepData[]>(this.STEPS_URL);
	}

	async getNonMachiningSteps() {
		return await this.#instance.get<StepData[]>(
			`${this.STEPS_URL}/nonmachining`,
		);
	}

	async getStepOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.STEPS_URL}/occasionsused/${id}`,
		);
	}

	async getStepById(id: number) {
		return await this.#instance.get<StepData>(`${this.STEPS_URL}/${id}`);
	}

	async updateStep(step: StepData) {
		return await this.#instance.put<StepData>(this.STEPS_URL, step);
	}

	async getStepWhereUsed(id: number) {
		return await this.#instance.get<WhereUsedItemData[]>(
			`${this.STEPS_URL}/whereused/processes/${id}`,
		);
	}
	//#endregion

	//#region steps configuration
	async getCuttingStepsSettings() {
		return await this.#instance.get<CuttingStepSettingData[]>(
			`${this.SETTINGS_URL}/cuttingelements`,
		);
	}

	async updateCuttingStepSetting(cuttingStepSetting: CuttingStepSettingData) {
		return await this.#instance.put<CuttingStepSettingData>(
			`${this.SETTINGS_URL}/cuttingelements`,
			cuttingStepSetting,
		);
	}

	async getMachiningStepsSettings() {
		return await this.#instance.get<MachiningStepSettingData[]>(
			`${this.SETTINGS_URL}/machiningelements`,
		);
	}

	async updateMachiningStepSetting(
		machiningStepSetting: MachiningStepSettingData,
	) {
		return await this.#instance.put<MachiningStepSettingData>(
			`${this.SETTINGS_URL}/machiningelements`,
			machiningStepSetting,
		);
	}
	//#endregion

	async getAuditList(auditParams: AuditQueryData) {
		return await this.#instance.post<AuditData[]>(
			this.AUDIT_URL,
			auditParams,
		);
	}

	//#region processes
	async getProcessFile(fileName: string) {
		return await this.#instance.get<Blob>(
			`${this.PROCESS_FILES_URL}/${fileName}`,
			{
				responseType: "blob",
			},
		);
	}

	async uploadProcessFile(formData: FormData) {
		return await this.#instance.post(this.PROCESS_FILES_URL, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	async createProcess(process: ProcessData) {
		return await this.#instance.post<ProcessData>(
			this.PROCESSES_URL,
			process,
		);
	}

	async copyProcess(copyProcess: CopyData) {
		return await this.#instance.post(
			`${this.PROCESSES_URL}/copy`,
			copyProcess,
		);
	}

	async deleteProcess(id: number) {
		return await this.#instance.delete(`${this.PROCESSES_URL}/${id}`);
	}

	async getProcesss() {
		return await this.#instance.get<ProcessData[]>(this.PROCESSES_URL);
	}

	async getFilteredProcesses(
		deptID: number,
		classID: number,
		typeID: number,
		concise: boolean,
	) {
		const conciseString = concise ? "consise/" : "";
		return await this.#instance.get<ProcessData[]>(
			`${this.PROCESSES_URL}/filtered/${conciseString}${deptID}/${classID}/${typeID}`,
		);
	}

	async getProcessOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.PROCESSES_URL}/occasionsused/${id}`,
		);
	}

	async getProcessById(id: number) {
		return await this.#instance.get<ProcessData>(
			`${this.PROCESSES_URL}/${id}`,
		);
	}

	async updateProcess(process: ProcessData) {
		return await this.#instance.put<ProcessData[]>(
			this.PROCESSES_URL,
			process,
		);
	}

	async getProcessWhereUsed(id: number) {
		return await this.#instance.get<ProcessWhereUsedForDesignItemData[]>(
			`${this.PROCESSES_URL}/whereused/designs/${id}`,
		);
	}
	//#region definitions
	async createProcessDefinition(definition: ProcessDefinitionData) {
		return await this.#instance.post<ProcessDefinitionData>(
			this.PROCESS_DEFINITIONS_URL,
			definition,
		);
	}

	async copyProcessDefinition(copyDefinition: CopyData) {
		return await this.#instance.post(
			`${this.PROCESS_DEFINITIONS_URL}/copy`,
			copyDefinition,
		);
	}

	async deleteProcessDefinition(id: number) {
		return await this.#instance.delete(
			`${this.PROCESS_DEFINITIONS_URL}/${id}`,
		);
	}

	async getProcessDefinitions() {
		return await this.#instance.get<ProcessDefinitionData[]>(
			this.PROCESS_DEFINITIONS_URL,
		);
	}

	async getProcessDefinitionTaskFormulaCodes() {
		return await this.#instance.get<ProcessDefinitionTaskFormulaCodeData[]>(
			`${this.PROCESS_DEFINITIONS_URL}/taskformulacodes`,
		);
	}

	async getProcessDefinitionById(id: number) {
		return await this.#instance.get<ProcessDefinitionData>(
			`${this.PROCESS_DEFINITIONS_URL}/${id}`,
		);
	}

	async getProcessDefinitionOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.PROCESS_DEFINITIONS_URL}/occasionsused/${id}`,
		);
	}
	async getProcessDefinitionOccasionsUsedOnProcesses(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.PROCESS_DEFINITIONS_URL}/occasionsusedonoperations/${id}`,
		);
	}

	async updateProcessDefinition(definition: ProcessDefinitionData) {
		return await this.#instance.put<ProcessDefinitionData>(
			this.PROCESS_DEFINITIONS_URL,
			definition,
		);
	}

	async previewProcessDefinitionQuestions(
		formData: PreviewProcessDefinitionQuestionsData,
	) {
		return await this.#instance.put<PreviewProcessDefinitionStepData[]>(
			this.PROCESS_DEFINITIONS_PREVIEW_URL,
			formData,
		);
	}

	//#endregion
	//#region definition categories
	async getDefinitionCategories() {
		return await this.#instance.get<ProcessDefinitionsCategoryData[]>(
			this.PROCESS_DEFINITION_CATEGORIES_URL,
		);
	}

	async getDefinitionCategoryById(id: number) {
		return await this.#instance.get<ProcessDefinitionsCategoryData>(
			`${this.PROCESS_DEFINITION_CATEGORIES_URL}/${id}`,
		);
	}

	async updateDefinitionCategory(category: ProcessDefinitionsCategoryData) {
		return await this.#instance.put<ProcessDefinitionsCategoryData>(
			this.PROCESS_DEFINITION_CATEGORIES_URL,
			category,
		);
	}
	//#endregion
	//#region types
	async createProcessClass(processClass: ProcessClassData) {
		return await this.#instance.post<ProcessClassData>(
			this.PROCESS_CLASSES_URL,
			processClass,
		);
	}

	async deleteProcessClass(id: number) {
		return await this.#instance.delete<ProcessClassData>(
			`${this.PROCESS_CLASSES_URL}/${id}`,
		);
	}

	async getProcessClasses() {
		return await this.#instance.get<ProcessClassData[]>(
			this.PROCESS_CLASSES_URL,
		);
	}

	async getProcessClassOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.PROCESS_CLASSES_URL}/occasionsused/${id}`,
		);
	}

	async updateProcessClass(processClass: ProcessClassData) {
		return await this.#instance.put<ProcessClassData>(
			this.PROCESS_CLASSES_URL,
			processClass,
		);
	}

	async createProcessType(processType: ProcessTypeData) {
		return await this.#instance.post<ProcessTypeData>(
			this.PROCESS_TYPES_URL,
			processType,
		);
	}

	async deleteProcessType(id: number) {
		return await this.#instance.delete<ProcessTypeData>(
			`${this.PROCESS_TYPES_URL}/${id}`,
		);
	}

	async getProcessTypes() {
		return await this.#instance.get<ProcessTypeData[]>(
			this.PROCESS_TYPES_URL,
		);
	}

	async getProcessTypeOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.PROCESS_TYPES_URL}/occasionsused/${id}`,
		);
	}

	async updateProcessType(processType: ProcessTypeData) {
		return await this.#instance.put<ProcessTypeData>(
			this.PROCESS_TYPES_URL,
			processType,
		);
	}
	//#endregion
	//#endregion

	//#region paths
	async uploadPathFile(formData: FormData) {
		return await this.#instance.post(this.PATH_FILES_URL, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	async getPathFileContent(fileName: string) {
		return await this.#instance.get<PathFileContentData>(
			`${this.FILES_URL}/content/pathfiles/${fileName}`,
		);
	}

	async getPathFiles() {
		return await this.#instance.get<FileData[]>(
			`${this.FILES_URL}/list/pathfiles`,
		);
	}
	//#endregion

	//#region designs
	async getStyleFile(fileName: string) {
		return await this.#instance.get<Blob>(
			`${this.DESIGNS_FILES_URL}/${fileName}`,
			{
				responseType: "blob",
			},
		);
	}

	async uploadStyleFile(formData: FormData) {
		return await this.#instance.post(this.DESIGNS_FILES_URL, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	async getStyleCSVExistsStatus(fileName: string) {
		return await this.#instance.get<string>(
			`${this.FILES_URL}/exists/export/designs/${fileName}`,
		);
	}

	async getCreateStyleCSV(id: number) {
		return await this.#instance.get<string>(
			`${this.DESIGNS_URL}/${id}/export`,
		);
	}

	async getStyleCSVDownload(fileName: string) {
		return await this.#instance.get<Blob>(
			`${this.FILES_URL}/exports/designs/${fileName}`,
		);
	}

	async deleteStyleCSV(filename: string) {
		return await this.#instance.delete(
			`${this.FILES_URL}/export/designs/${filename}`,
		);
	}

	async createStyle(design: DesignData) {
		return await this.#instance.post<DesignData>(this.DESIGNS_URL, design);
	}

	async createDesignDepartment(styleDepartment: DesignDepartmentData) {
		return await this.#instance.post<DesignDepartmentData>(
			this.DESIGNS_DEPARTMENTS_URL,
			styleDepartment,
		);
	}

	async deleteStyle(id: number) {
		return await this.#instance.delete(`${this.DESIGNS_URL}/${id}`);
	}

	async deleteDesignDepartment(id: number) {
		return await this.#instance.delete(
			`${this.DESIGNS_DEPARTMENTS_URL}/${id}`,
		);
	}

	async getDesignDepartmentById(id: number) {
		return await this.#instance.get<DesignDepartmentData>(
			`${this.DESIGNS_DEPARTMENTS_URL}/${id}`,
		);
	}

	async copyDesign(copyDesign: CopyData) {
		return await this.#instance.post(
			`${this.DESIGNS_URL}/copy`,
			copyDesign,
		);
	}

	async getStyles() {
		return await this.#instance.get<DesignData[]>(this.DESIGNS_URL);
	}

	async getStyleById(id: number) {
		return await this.#instance.get<DesignData>(
			`${this.DESIGNS_URL}/${id}`,
		);
	}

	async updateStyle(design: DesignData) {
		return await this.#instance.put<DesignData>(this.DESIGNS_URL, design);
	}

	async updateDesignDepartment(styleDepartment: DesignDepartmentData) {
		return await this.#instance.put<DesignDepartmentData>(
			this.DESIGNS_DEPARTMENTS_URL,
			styleDepartment,
		);
	}

	async createProcessSet(processSet: ProcessSetData) {
		return await this.#instance.post<ProcessSetData>(
			this.PROCESS_SETS_URL,
			processSet,
		);
	}

	async deleteProcessSet(id: number) {
		return await this.#instance.delete(`${this.PROCESS_SETS_URL}/${id}`);
	}

	async getProcessSets() {
		return await this.#instance.get<ProcessSetData[]>(
			this.PROCESS_SETS_URL,
		);
	}

	async getProcessSetById(id: number) {
		return await this.#instance.get<ProcessSetData>(
			`${this.PROCESS_SETS_URL}/${id}`,
		);
	}

	async updateProcessSet(processSet: ProcessSetData) {
		return await this.#instance.put<ProcessSetData[]>(
			this.PROCESS_SETS_URL,
			processSet,
		);
	}
	//#endregion

	//#region system
	async getProcessCategories() {
		return await this.#instance.get<ProcessCategoryData[]>(
			`${this.SYSTEM_URL}/operationcategories`,
		);
	}

	async getCuttingMethodsNatural() {
		return await this.#instance.get<CuttingMethodData[]>(
			`${this.SYSTEM_URL}/cuttingmethods/natural`,
		);
	}

	async getCuttingMethodsSynthetic() {
		return await this.#instance.get<CuttingMethodData[]>(
			`${this.SYSTEM_URL}/cuttingmethods/synthetic`,
		);
	}

	async getCuttingTypes() {
		return await this.#instance.get<CuttingTypeData[]>(
			`${this.SYSTEM_URL}/cuttingtypes`,
		);
	}

	async getFeedSystems() {
		return await this.#instance.get<FeedSystemData[]>(
			`${this.SYSTEM_URL}/feedsystems`,
		);
	}

	async getMaterialTypes() {
		return await this.#instance.get<MaterialTypeData[]>(
			`${this.SYSTEM_URL}/materialtypes`,
		);
	}

	async getMachiningAmendmentsForCategory(id: number) {
		return await this.#instance.get<MachiningAmendmentData[]>(
			`${this.SYSTEM_URL}/machiningamendments/${id}`,
		);
	}

	async getUnits() {
		return await this.#instance.get<UnitData[]>(`${this.SYSTEM_URL}/units`);
	}
	//#region general
	async getGeneralSettings() {
		return await this.#instance.get<GeneralSettingsData>(
			`${this.SETTINGS_URL}/general`,
		);
	}

	async updateGeneralSettings(settings: GeneralSettingsData) {
		return await this.#instance.put<GeneralSettingsData>(
			`${this.SETTINGS_URL}/general`,
			settings,
		);
	}
	//#endregion

	//#region departments
	async createDepartment(department: DepartmentData) {
		return await this.#instance.post<DepartmentData>(
			this.DEPARTMENTS_URL,
			department,
		);
	}

	async deleteDepartment(id: number) {
		return await this.#instance.delete<DepartmentData>(
			`${this.DEPARTMENTS_URL}/${id}`,
		);
	}

	async getDepartments() {
		return await this.#instance.get<DepartmentData[]>(this.DEPARTMENTS_URL);
	}

	async getDepartmentOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.DEPARTMENTS_URL}/occasionsused/${id}`,
		);
	}

	async updateDepartment(department: DepartmentData) {
		return await this.#instance.put<DepartmentData>(
			this.DEPARTMENTS_URL,
			department,
		);
	}
	//#endregion

	//#region machining

	//#region machines
	async createMachine(machine: MachineData) {
		return await this.#instance.post<MachineData>(
			this.MACHINES_URL,
			machine,
		);
	}

	async deleteMachine(id: number) {
		return await this.#instance.delete(`${this.MACHINES_URL}/${id}`);
	}

	async getMachines() {
		return await this.#instance.get<MachineData[]>(this.MACHINES_URL);
	}

	async getMachineOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.MACHINES_URL}/occasionsused/${id}`,
		);
	}

	async updateMachine(machine: MachineData) {
		return await this.#instance.put<MachineData>(
			this.MACHINES_URL,
			machine,
		);
	}
	//#endregion

	//#region machining amendments
	async getMachiningAmendments() {
		return await this.#instance.get<MachiningAmendmentData[]>(
			`${this.SETTINGS_URL}/machiningamendments`,
		);
	}
	async updateMachiningAmendment(machiningAmendment: MachiningAmendmentData) {
		return await this.#instance.put<MachiningAmendmentData>(
			`${this.SETTINGS_URL}/machiningamendments`,
			machiningAmendment,
		);
	}
	//#endregion

	//#region process definitions default cutting
	async getProcessDefinitionsDefaultCutting() {
		return await this.#instance.get<ProcessDefinitionsDefaultCuttingData>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/defaultcutting`,
		);
	}

	async updateProcessDefinitionsDefaultCutting(
		settings: ProcessDefinitionsDefaultCuttingData,
	) {
		return await this.#instance.put<ProcessDefinitionsDefaultCuttingData>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/defaultcutting`,
			settings,
		);
	}
	//#endregion

	//#region process definitions machining
	async getProcessDefinitionsMachining() {
		return await this.#instance.get<ProcessDefinitionsMachiningData>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/machining`,
		);
	}

	async updateProcessDefinitionsMachining(
		settings: ProcessDefinitionsMachiningData,
	) {
		return await this.#instance.put<ProcessDefinitionsMachiningData>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/machining`,
			settings,
		);
	}
	//#endregion

	//#region stitching characteristics
	async getStitchingCharacteristics() {
		return await this.#instance.get<StitchingCharacteristicsData>(
			`${this.SETTINGS_URL}/stitchingcharacteristics`,
		);
	}

	async updateStitchingCharacteristics(
		settings: StitchingCharacteristicsData,
	) {
		return await this.#instance.put<StitchingCharacteristicsData>(
			`${this.SETTINGS_URL}/stitchingcharacteristics`,
			settings,
		);
	}
	//#endregion

	//#region stitching modifiers
	async createStitchingModifier(stitchingModifier: StitchingModifierData) {
		return await this.#instance.post<StitchingModifierData>(
			`${this.SETTINGS_URL}/stitchingmodifiers`,
			stitchingModifier,
		);
	}

	async deleteStitchingModifier(id: number) {
		return await this.#instance.delete(
			`${this.SETTINGS_URL}/stitchingmodifiers/${id}`,
		);
	}

	// This is to be used for when users without the admin role need to read stitching modifiers
	async getSystemStitchingModifiers() {
		return await this.#instance.get<StitchingModifierData[]>(
			`${this.SYSTEM_URL}/stitchingmodifiers`,
		);
	}

	async getStitchingModifiers() {
		return await this.#instance.get<StitchingModifierData[]>(
			`${this.SETTINGS_URL}/stitchingmodifiers`,
		);
	}

	async getStitchingModifierOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.SETTINGS_URL}/stitchingmodifiers/occasionsused/${id}`,
		);
	}

	async updateStitchingModifier(stitchingModifier: StitchingModifierData) {
		return await this.#instance.put<StitchingModifierData>(
			`${this.SETTINGS_URL}/stitchingmodifiers`,
			stitchingModifier,
		);
	}
	//#endregion
	//#endregion

	//#region grades
	async createGrade(grade: GradeData) {
		return await this.#instance.post<GradeData>(this.GRADES_URL, grade);
	}

	async deleteGrade(id: number) {
		return await this.#instance.delete<GradeData>(
			`${this.GRADES_URL}/${id}`,
		);
	}

	async getGrades() {
		return await this.#instance.get<GradeData[]>(this.GRADES_URL);
	}

	async getGradeOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.GRADES_URL}/occasionsused/${id}`,
		);
	}

	async updateGrade(grade: GradeData) {
		return await this.#instance.put<GradeData>(this.GRADES_URL, grade);
	}
	//#endregion

	//#region paths
	async createPathFeature(pathFeature: PathFeatureData) {
		return await this.#instance.post<PathFeatureData>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/pathfeatures`,
			pathFeature,
		);
	}

	async deletePathFeature(id: number) {
		return await this.#instance.delete(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/pathfeatures/${id}`,
		);
	}

	async getPathFeatures() {
		return await this.#instance.get<PathFeatureData[]>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/pathfeatures`,
		);
	}

	async getPathFeatureOccasionsUsed(id: number) {
		return await this.#instance.get<OccasionsUsedData>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/pathfeatures/occasionsused/${id}`,
		);
	}

	async updatePathFeature(pathFeature: PathFeatureData) {
		return await this.#instance.put<PathFeatureData>(
			`${this.SETTINGS_PROCESS_DEFINITIONS_URL}/pathfeatures`,
			pathFeature,
		);
	}
	//#endregion

	//#region secondary login
	async secondaryLogin() {
		return await this.#instance.post(`${this.SECONDARY_LOGIN_URL}`);
	}

	async secondaryLogout() {
		return await this.#instance.post(`${this.SECONDARY_LOGOUT_URL}`);
	}
	//#endregion
	//#endregion
}

const api = new Api();

export default api;
