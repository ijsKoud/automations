export interface AlbertHeijnRoosterResponse {
	data: Data;
}

export interface Data {
	scheduleByWeek: AlbertHeijnRooster[];
}

export interface AlbertHeijnRooster {
	startTime: Date;
	endTime: Date;
	minutes: number;
	storeId: string;
	leaveMinutes: number;
	store: Store;
	paidMinutes: number;
	sickMinutes: number;
	teamNames: TeamName[];
	__typename: ScheduleByWeekTypename;
}

export enum ScheduleByWeekTypename {
	Shift = "Shift"
}

export interface Store {
	abbreviatedDisplayName: AbbreviatedDisplayName;
	location: Location;
	id: string;
	__typename: StoreTypename;
}

export enum StoreTypename {
	Store = "Store"
}

export enum AbbreviatedDisplayName {
	HAARLEMSoendaplein = "HAARLEM Soendaplein"
}

export enum Location {
	Haarlem = "HAARLEM"
}

export enum TeamName {
	Management = "MANAGEMENT",
	Operatie = "OPERATIE",
	OperatieGekoeld = "OPERATIE GEKOELD"
}
