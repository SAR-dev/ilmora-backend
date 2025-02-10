/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	ClassLogs = "classLogs",
	DailyClassPackages = "dailyClassPackages",
	Notices = "notices",
	Routines = "routines",
	SharedFiles = "sharedFiles",
	StudentInvoices = "studentInvoices",
	Students = "students",
	TeacherInvoices = "teacherInvoices",
	TeacherStudentRel = "teacherStudentRel",
	Teachers = "teachers",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export enum ClassLogsStatusOptions {
	"STARTED" = "STARTED",
	"FINISHED" = "FINISHED",
}
export type ClassLogsRecord = {
	classNote?: string
	created?: IsoDateString
	dailyClassPackageId: RecordIdString
	finishedAt?: IsoDateString
	id: string
	startedAt?: IsoDateString
	status?: ClassLogsStatusOptions
	studentId: RecordIdString
	studentsPrice?: number
	teacherId: RecordIdString
	teachersPrice?: number
	updated?: IsoDateString
}

export type DailyClassPackagesRecord = {
	classMins?: number
	created?: IsoDateString
	hidden?: boolean
	id: string
	studentsPrice?: number
	teachersPrice?: number
	title?: string
	updated?: IsoDateString
}

export type NoticesRecord = {
	created?: IsoDateString
	description?: HTMLString
	id: string
	title: string
	updated?: IsoDateString
}

export type RoutinesRecord = {
	created?: IsoDateString
	friTime?: string
	id: string
	monTime?: string
	satTime?: string
	sunTIme?: string
	teacherStudentRelId: RecordIdString
	thuTime?: string
	tueTime?: string
	updated?: IsoDateString
	utcOffset: string
	wedTime?: string
}

export type SharedFilesRecord = {
	created?: IsoDateString
	description?: string
	id: string
	link: string
	title: string
	updated?: IsoDateString
}

export type StudentInvoicesRecord = {
	created?: IsoDateString
	dueAmount?: number
	finishDate?: string
	id: string
	isNotified?: boolean
	note?: string
	paidAmount?: number
	startDate?: string
	studentId: RecordIdString
	updated?: IsoDateString
}

export type StudentsRecord = {
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	userId: RecordIdString
}

export type TeacherInvoicesRecord = {
	created?: IsoDateString
	dueAmount?: number
	finishDate?: string
	id: string
	isNotified?: boolean
	note?: string
	paidAmount?: number
	startDate?: string
	teacherId: RecordIdString
	updated?: IsoDateString
}

export type TeacherStudentRelRecord = {
	classLink?: string
	created?: IsoDateString
	dailyClassPackageId: RecordIdString
	dailyClassStudentsPrice?: number
	dailyClassTeachersPrice?: number
	id: string
	studentId: RecordIdString
	teacherId: RecordIdString
	updated?: IsoDateString
}

export type TeachersRecord = {
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	userId: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	country?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	utcOffset?: string
	verified?: boolean
	whatsAppNo?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ClassLogsResponse<Texpand = unknown> = Required<ClassLogsRecord> & BaseSystemFields<Texpand>
export type DailyClassPackagesResponse<Texpand = unknown> = Required<DailyClassPackagesRecord> & BaseSystemFields<Texpand>
export type NoticesResponse<Texpand = unknown> = Required<NoticesRecord> & BaseSystemFields<Texpand>
export type RoutinesResponse<Texpand = unknown> = Required<RoutinesRecord> & BaseSystemFields<Texpand>
export type SharedFilesResponse<Texpand = unknown> = Required<SharedFilesRecord> & BaseSystemFields<Texpand>
export type StudentInvoicesResponse<Texpand = unknown> = Required<StudentInvoicesRecord> & BaseSystemFields<Texpand>
export type StudentsResponse<Texpand = unknown> = Required<StudentsRecord> & BaseSystemFields<Texpand>
export type TeacherInvoicesResponse<Texpand = unknown> = Required<TeacherInvoicesRecord> & BaseSystemFields<Texpand>
export type TeacherStudentRelResponse<Texpand = unknown> = Required<TeacherStudentRelRecord> & BaseSystemFields<Texpand>
export type TeachersResponse<Texpand = unknown> = Required<TeachersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	classLogs: ClassLogsRecord
	dailyClassPackages: DailyClassPackagesRecord
	notices: NoticesRecord
	routines: RoutinesRecord
	sharedFiles: SharedFilesRecord
	studentInvoices: StudentInvoicesRecord
	students: StudentsRecord
	teacherInvoices: TeacherInvoicesRecord
	teacherStudentRel: TeacherStudentRelRecord
	teachers: TeachersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	classLogs: ClassLogsResponse
	dailyClassPackages: DailyClassPackagesResponse
	notices: NoticesResponse
	routines: RoutinesResponse
	sharedFiles: SharedFilesResponse
	studentInvoices: StudentInvoicesResponse
	students: StudentsResponse
	teacherInvoices: TeacherInvoicesResponse
	teacherStudentRel: TeacherStudentRelResponse
	teachers: TeachersResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'classLogs'): RecordService<ClassLogsResponse>
	collection(idOrName: 'dailyClassPackages'): RecordService<DailyClassPackagesResponse>
	collection(idOrName: 'notices'): RecordService<NoticesResponse>
	collection(idOrName: 'routines'): RecordService<RoutinesResponse>
	collection(idOrName: 'sharedFiles'): RecordService<SharedFilesResponse>
	collection(idOrName: 'studentInvoices'): RecordService<StudentInvoicesResponse>
	collection(idOrName: 'students'): RecordService<StudentsResponse>
	collection(idOrName: 'teacherInvoices'): RecordService<TeacherInvoicesResponse>
	collection(idOrName: 'teacherStudentRel'): RecordService<TeacherStudentRelResponse>
	collection(idOrName: 'teachers'): RecordService<TeachersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
