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
	Resources = "resources",
	Routines = "routines",
	StudentBalances = "studentBalances",
	StudentExtraPaymentView = "studentExtraPaymentView",
	StudentInvoicePaymentView = "studentInvoicePaymentView",
	StudentInvoices = "studentInvoices",
	Students = "students",
	TeacherBalances = "teacherBalances",
	TeacherExtraPaymentView = "teacherExtraPaymentView",
	TeacherInvoicePaymentView = "teacherInvoicePaymentView",
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

export enum SuperusersRoleOptions {
	"INVOICE_MANAGER" = "INVOICE_MANAGER",
	"BALANCE_MANAGER" = "BALANCE_MANAGER",
	"CLASS_MANAGER" = "CLASS_MANAGER",
}
export type SuperusersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: SuperusersRoleOptions
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export enum ClassLogsStatusOptions {
	"CREATED" = "CREATED",
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
	status: ClassLogsStatusOptions
	studentId: RecordIdString
	studentInvoiceId?: RecordIdString
	studentsPrice?: number
	teacherId: RecordIdString
	teacherInvoiceId?: RecordIdString
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
	title: string
	updated?: IsoDateString
}

export enum NoticesUserTypeOptions {
	"STUDENT" = "STUDENT",
	"TEACHER" = "TEACHER",
}
export type NoticesRecord = {
	created?: IsoDateString
	description?: HTMLString
	id: string
	title: string
	updated?: IsoDateString
	userType: NoticesUserTypeOptions
}

export enum ResourcesUserTypeOptions {
	"STUDENT" = "STUDENT",
	"TEACHER" = "TEACHER",
	"ADMIN" = "ADMIN",
}
export type ResourcesRecord = {
	created?: IsoDateString
	id: string
	link: string
	title: string
	updated?: IsoDateString
	userType: ResourcesUserTypeOptions
}

export type RoutinesRecord = {
	created?: IsoDateString
	endDate: string
	friTime?: string
	id: string
	monTime?: string
	satTime?: string
	startDate: string
	sunTIme?: string
	teacherStudentRelId: RecordIdString
	thuTime?: string
	tueTime?: string
	updated?: IsoDateString
	utcOffset: string
	wedTime?: string
}

export type StudentBalancesRecord = {
	created?: IsoDateString
	id: string
	paidAmount?: number
	paymentInfo?: string
	paymentMethod?: string
	studentId?: RecordIdString
	studentInvoiceId?: RecordIdString
	updated?: IsoDateString
}

export type StudentExtraPaymentViewRecord<TinvoicedAt = unknown, TtotalStudentsPrice = unknown> = {
	avatar?: string
	createdAt?: IsoDateString
	email: string
	id: string
	invoicedAt?: null | TinvoicedAt
	location?: string
	name: string
	paidAmount?: number
	paidAt?: IsoDateString
	paymentInfo?: string
	paymentMethod?: string
	studentBalanceId?: RecordIdString
	studentId?: RecordIdString
	studentInvoiceId?: RecordIdString
	totalStudentsPrice?: null | TtotalStudentsPrice
	userId?: RecordIdString
	utcOffset?: string
	whatsAppNo: string
}

export type StudentInvoicePaymentViewRecord<TtotalStudentsPrice = unknown> = {
	avatar?: string
	createdAt?: IsoDateString
	email: string
	id: string
	invoicedAt?: IsoDateString
	location?: string
	name: string
	paidAmount?: number
	paidAt?: IsoDateString
	paymentInfo?: string
	paymentMethod?: string
	studentBalanceId?: RecordIdString
	studentId?: RecordIdString
	studentInvoiceId?: RecordIdString
	totalStudentsPrice?: null | TtotalStudentsPrice
	userId?: RecordIdString
	utcOffset?: string
	whatsAppNo: string
}

export type StudentInvoicesRecord = {
	created?: IsoDateString
	id: string
	updated?: IsoDateString
}

export type StudentsRecord = {
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	userId: RecordIdString
}

export type TeacherBalancesRecord = {
	created?: IsoDateString
	id: string
	paidAmount?: number
	paymentInfo?: string
	paymentMethod?: string
	teacherId?: RecordIdString
	teacherInvoiceId?: RecordIdString
	updated?: IsoDateString
}

export type TeacherExtraPaymentViewRecord<TinvoicedAt = unknown, TtotalTeachersPrice = unknown> = {
	avatar?: string
	createdAt?: IsoDateString
	email: string
	id: string
	invoicedAt?: null | TinvoicedAt
	location?: string
	name: string
	paidAmount?: number
	paidAt?: IsoDateString
	paymentInfo?: string
	paymentMethod?: string
	teacherBalanceId?: RecordIdString
	teacherId?: RecordIdString
	teacherInvoiceId?: RecordIdString
	totalTeachersPrice?: null | TtotalTeachersPrice
	userId?: RecordIdString
	utcOffset?: string
	whatsAppNo: string
}

export type TeacherInvoicePaymentViewRecord<TtotalTeachersPrice = unknown> = {
	avatar?: string
	createdAt?: IsoDateString
	email: string
	id: string
	invoicedAt?: IsoDateString
	location?: string
	name: string
	paidAmount?: number
	paidAt?: IsoDateString
	paymentInfo?: string
	paymentMethod?: string
	teacherBalanceId?: RecordIdString
	teacherId?: RecordIdString
	teacherInvoiceId?: RecordIdString
	totalTeachersPrice?: null | TtotalTeachersPrice
	userId?: RecordIdString
	utcOffset?: string
	whatsAppNo: string
}

export type TeacherInvoicesRecord = {
	created?: IsoDateString
	id: string
	updated?: IsoDateString
}

export type TeacherStudentRelRecord = {
	classLink?: string
	created?: IsoDateString
	dailyClassPackageId: RecordIdString
	dailyClassStudentsPrice: number
	dailyClassTeachersPrice: number
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
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	location?: string
	name: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	utcOffset?: string
	verified?: boolean
	whatsAppNo: string
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
export type ResourcesResponse<Texpand = unknown> = Required<ResourcesRecord> & BaseSystemFields<Texpand>
export type RoutinesResponse<Texpand = unknown> = Required<RoutinesRecord> & BaseSystemFields<Texpand>
export type StudentBalancesResponse<Texpand = unknown> = Required<StudentBalancesRecord> & BaseSystemFields<Texpand>
export type StudentExtraPaymentViewResponse<TinvoicedAt = unknown, TtotalStudentsPrice = unknown, Texpand = unknown> = Required<StudentExtraPaymentViewRecord<TinvoicedAt, TtotalStudentsPrice>> & BaseSystemFields<Texpand>
export type StudentInvoicePaymentViewResponse<TtotalStudentsPrice = unknown, Texpand = unknown> = Required<StudentInvoicePaymentViewRecord<TtotalStudentsPrice>> & BaseSystemFields<Texpand>
export type StudentInvoicesResponse<Texpand = unknown> = Required<StudentInvoicesRecord> & BaseSystemFields<Texpand>
export type StudentsResponse<Texpand = unknown> = Required<StudentsRecord> & BaseSystemFields<Texpand>
export type TeacherBalancesResponse<Texpand = unknown> = Required<TeacherBalancesRecord> & BaseSystemFields<Texpand>
export type TeacherExtraPaymentViewResponse<TinvoicedAt = unknown, TtotalTeachersPrice = unknown, Texpand = unknown> = Required<TeacherExtraPaymentViewRecord<TinvoicedAt, TtotalTeachersPrice>> & BaseSystemFields<Texpand>
export type TeacherInvoicePaymentViewResponse<TtotalTeachersPrice = unknown, Texpand = unknown> = Required<TeacherInvoicePaymentViewRecord<TtotalTeachersPrice>> & BaseSystemFields<Texpand>
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
	resources: ResourcesRecord
	routines: RoutinesRecord
	studentBalances: StudentBalancesRecord
	studentExtraPaymentView: StudentExtraPaymentViewRecord
	studentInvoicePaymentView: StudentInvoicePaymentViewRecord
	studentInvoices: StudentInvoicesRecord
	students: StudentsRecord
	teacherBalances: TeacherBalancesRecord
	teacherExtraPaymentView: TeacherExtraPaymentViewRecord
	teacherInvoicePaymentView: TeacherInvoicePaymentViewRecord
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
	resources: ResourcesResponse
	routines: RoutinesResponse
	studentBalances: StudentBalancesResponse
	studentExtraPaymentView: StudentExtraPaymentViewResponse
	studentInvoicePaymentView: StudentInvoicePaymentViewResponse
	studentInvoices: StudentInvoicesResponse
	students: StudentsResponse
	teacherBalances: TeacherBalancesResponse
	teacherExtraPaymentView: TeacherExtraPaymentViewResponse
	teacherInvoicePaymentView: TeacherInvoicePaymentViewResponse
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
	collection(idOrName: 'resources'): RecordService<ResourcesResponse>
	collection(idOrName: 'routines'): RecordService<RoutinesResponse>
	collection(idOrName: 'studentBalances'): RecordService<StudentBalancesResponse>
	collection(idOrName: 'studentExtraPaymentView'): RecordService<StudentExtraPaymentViewResponse>
	collection(idOrName: 'studentInvoicePaymentView'): RecordService<StudentInvoicePaymentViewResponse>
	collection(idOrName: 'studentInvoices'): RecordService<StudentInvoicesResponse>
	collection(idOrName: 'students'): RecordService<StudentsResponse>
	collection(idOrName: 'teacherBalances'): RecordService<TeacherBalancesResponse>
	collection(idOrName: 'teacherExtraPaymentView'): RecordService<TeacherExtraPaymentViewResponse>
	collection(idOrName: 'teacherInvoicePaymentView'): RecordService<TeacherInvoicePaymentViewResponse>
	collection(idOrName: 'teacherInvoices'): RecordService<TeacherInvoicesResponse>
	collection(idOrName: 'teacherStudentRel'): RecordService<TeacherStudentRelResponse>
	collection(idOrName: 'teachers'): RecordService<TeachersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
