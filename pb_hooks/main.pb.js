// on teacher student rel update update class price of pending classes
onRecordAfterUpdateSuccess((e) => {
    $app.db()
        .newQuery(`
            UPDATE classLogs 
            SET teachersPrice = {:teachersPrice}, 
                studentsPrice = {:studentsPrice}, 
                dailyClassPackageId = {:dailyClassPackageId} 
            WHERE teacherId = {:teacherId}
            AND studentId = {:studentId}
            AND status = 'CREATED'
        `)
        .bind({
            teacherId: e.record.get("teacherId"),
            studentId: e.record.get("studentId"),
            dailyClassPackageId: e.record.get("dailyClassPackageId"),
            teachersPrice: e.record.get("dailyClassTeachersPrice"),
            studentsPrice: e.record.get("dailyClassStudentsPrice")
        })
        .execute()

    e.next()
}, "teacherStudentRel")

// modify whats app number
onRecordCreate((e) => {
    let wh = e.record.get("whatsAppNo");

    if (wh) {
        // Remove all non-digit characters except +
        wh = wh.replace(/[^\d+]/g, "");

        // Ensure it starts with +
        if (!wh.startsWith("+")) {
            wh = "+" + wh;
        }

        e.record.set("whatsAppNo", wh);
    }

    e.next();
}, "users");

// modify whats app number
onRecordUpdate((e) => {
    let wh = e.record.get("whatsAppNo");

    if (wh) {
        // Remove all non-digit characters except +
        wh = wh.replace(/[^\d+]/g, "");

        // Ensure it starts with +
        if (!wh.startsWith("+")) {
            wh = "+" + wh;
        }

        e.record.set("whatsAppNo", wh);
    }

    e.next();
}, "users");

// remove mismatched / expired class logs every 1 minute
cronAdd("remove-expired-teacher-student-class-logs", "*/1 * * * *", () => {
    $app.db()
        .newQuery(`
            DELETE FROM classLogs 
            WHERE status = 'CREATED' 
            AND NOT EXISTS (
                SELECT 1 FROM teacherStudentRel tsr 
                WHERE tsr.studentId = classLogs.studentId 
                AND tsr.teacherId = classLogs.teacherId
            )
        `)
        .execute()
    console.log("Class logs cleaned 🙏")
})

// get logged in user data
routerAdd("GET", "/api/self", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const userInfo = new DynamicModel({
        isTeacher: '',
        isStudent: '',
        isSuperUser: '',
        superUserRole: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE (
                    (SELECT CASE WHEN t.id IS NOT NULL THEN TRUE ELSE FALSE END 
                    FROM teachers t WHERE t.userId = {:userId} 
                    LIMIT 1), FALSE
                ) AS isTeacher,
                COALESCE (
                    (SELECT CASE WHEN s.id IS NOT NULL THEN TRUE ELSE FALSE END 
                    FROM students s WHERE s.userId = {:userId}
                    LIMIT 1), FALSE
                ) AS isStudent,
                COALESCE (
                    (SELECT CASE WHEN s.id IS NOT NULL THEN TRUE ELSE FALSE END 
                    FROM _superusers s WHERE s.id = {:userId}
                    LIMIT 1), FALSE
                ) AS isSuperUser,
                COALESCE (
                    (SELECT s.role FROM _superusers s WHERE s.id = {:userId})
                    , ''
                ) AS superUserRole
        `)
        .bind({
            userId
        })
        .one(userInfo)

    return c.json(200, {
        isTeacher: userInfo.isTeacher == 1,
        isStudent: userInfo.isStudent == 1,
        isSuperUser: userInfo.isSuperUser == 1,
        superUserRole: userInfo.superUserRole
    })
})

// ======================================================================
// TEACHER API
// ======================================================================

// get student list with routines
// it need to use latest info so use teacher student rel for package
routerAdd("GET", "/api/t/students", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const studentsInfo = arrayOf(new DynamicModel({
        id: '',
        name: '',
        packageName: '',
        packageClassMins: '',
        location: '',
        whatsAppNo: '',
        avatar: '',
        teachersPrice: '',
        utcOffset: '',
        satTime: '',
        sunTime: '',
        monTime: '',
        tueTime: '',
        wedTime: '',
        thuTime: '',
        friTime: '',
        startDate: '',
        endDate: '',
    }))

    $app.db()
        .newQuery(`
            SELECT 
                s.id ,
                us.name ,
                us.location ,
                us.whatsAppNo ,
                us.avatar ,
                dcp.title AS packageName ,
                dcp.classMins AS packageClassMins ,
                tsr.dailyClassTeachersPrice AS teachersPrice ,
                COALESCE (r.utcOffset, '') AS utcOffset ,
                COALESCE (r.satTime, '') AS satTime ,
                COALESCE (r.sunTime, '') AS sunTime ,
                COALESCE (r.monTime, '') AS monTime ,
                COALESCE (r.tueTime, '') AS tueTime ,
                COALESCE (r.wedTime, '') AS wedTime ,
                COALESCE (r.thuTime, '') AS thuTime ,
                COALESCE (r.friTime, '') AS friTime ,
                COALESCE (r.startDate, '') AS startDate ,
                COALESCE (r.endDate, '') AS endDate 
            FROM users u 
            JOIN teachers t ON t.userId = u.id
            JOIN teacherStudentRel tsr ON tsr.teacherId = t.id 
            JOIN students s ON tsr.studentId = s.id 
            JOIN users us ON us.id = s.userId 
            JOIN dailyClassPackages dcp ON tsr.dailyClassPackageId = dcp.id 
            LEFT JOIN routines r ON r.teacherStudentRelId = tsr.id
            WHERE u.id = {:userId}
        `)
        .bind({
            userId
        })
        .all(studentsInfo)

    return c.json(200, studentsInfo)
})

// create student routine and related class logs
// it need to use latest info so use teacher student rel for package
routerAdd("POST", "/api/t/routine", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { studentId, utcOffset, startDate, endDate, satTime, sunTime, monTime, tueTime, wedTime, thuTime, friTime } = c.requestInfo().body

    // match utc offset using regex
    const utcOffsetRegex = new RegExp('^[+-](0[0-9]|1[0-4]):[0-5][0-9]$');
    if (!utcOffsetRegex.test(utcOffset)) throw ForbiddenError()

    // match times using regex
    const times = [satTime, sunTime, monTime, tueTime, wedTime, thuTime, friTime].filter(e => e.trim().length > 0)
    const timeRegex = new RegExp('^([01][0-9]|2[0-3]):([0-5][0-9])$')
    times.forEach(e => {
        if (!timeRegex.test(e)) throw ForbiddenError()
    })

    // confirm start date is not in past
    const todayDate = new Date()
    if (todayDate > new Date(startDate)) throw ForbiddenError()

    // confirm end date is later than start date
    if (new Date(endDate) < new Date(startDate)) throw ForbiddenError()

    // confirm that date range is max 1 year
    const noOfDaysDiff = Math.ceil((Math.abs(new Date(endDate) - new Date(startDate))) / (1000 * 60 * 60 * 24))
    if (noOfDaysDiff > 365) throw ForbiddenError()

    const data = new DynamicModel({
        teacherStudentRelId: '',
        dailyClassPackageId: '',
        routineId: '',
        teacherId: '',
        dailyClassTeachersPrice: '',
        dailyClassStudentsPrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                tsr.id AS teacherStudentRelId,
                tsr.dailyClassPackageId,
                COALESCE (r.id, '') AS routineId,
                t.id AS teacherId,
                tsr.dailyClassTeachersPrice,
                tsr.dailyClassStudentsPrice
            FROM users u 
            JOIN teachers t ON t.userId = u.id
            JOIN teacherStudentRel tsr ON tsr.teacherId = t.id 
            JOIN students s ON tsr.studentId = s.id 
            LEFT JOIN routines r ON r.teacherStudentRelId = tsr.id
            WHERE u.id = {:teacherUserId}
            AND s.id = {:studentId}
        `)
        .bind({
            teacherUserId: userId,
            studentId
        })
        .one(data)

    const { teacherStudentRelId, routineId, teacherId, dailyClassPackageId } = data


    const getClassTimes = () => {
        const result = [];

        // routine start date
        const start = new Date(startDate);

        // routine end date
        const end = new Date(endDate);

        // local timezone offset
        const localOffsetMinutes = start.getTimezoneOffset();

        const offsetSign = utcOffset.startsWith("+") ? -1 : 1;
        const [hours, minutes] = utcOffset.slice(1).split(":").map(Number);

        // payload timezone offset
        const payloadOffsetMinutes = offsetSign * (hours * 60 + minutes)

        // overall timezone offset
        const totalOffsetMinutes = payloadOffsetMinutes - localOffsetMinutes;

        // create weekdays data
        const weekdays = []
        
        if (sunTime.trim().length > 0) weekdays.push({
            dayOfWeek: 0,
            hh: Number(sunTime.split(":")[0]),
            mm: Number(sunTime.split(":")[1])
        })
        if (monTime.trim().length > 0) weekdays.push({
            dayOfWeek: 1,
            hh: Number(monTime.split(":")[0]),
            mm: Number(monTime.split(":")[1])
        })
        if (tueTime.trim().length > 0) weekdays.push({
            dayOfWeek: 2,
            hh: Number(tueTime.split(":")[0]),
            mm: Number(tueTime.split(":")[1])
        })
        if (wedTime.trim().length > 0) weekdays.push({
            dayOfWeek: 3,
            hh: Number(wedTime.split(":")[0]),
            mm: Number(wedTime.split(":")[1])
        })
        if (thuTime.trim().length > 0) weekdays.push({
            dayOfWeek: 4,
            hh: Number(thuTime.split(":")[0]),
            mm: Number(thuTime.split(":")[1])
        })
        if (friTime.trim().length > 0) weekdays.push({
            dayOfWeek: 5,
            hh: Number(friTime.split(":")[0]),
            mm: Number(friTime.split(":")[1])
        })
        if (satTime.trim().length > 0) weekdays.push({
            dayOfWeek: 6,
            hh: Number(satTime.split(":")[0]),
            mm: Number(satTime.split(":")[1])
        })

        while (start <= end) {
            const dayOfWeek = start.getUTCDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
            const foundIndex = weekdays.findIndex(e => e.dayOfWeek == dayOfWeek)
            if (foundIndex != -1) {
                const adjustedDate = new Date(start);
                const hours = Math.floor((weekdays[foundIndex].hh * 60 + weekdays[foundIndex].mm + totalOffsetMinutes) / 60)
                const minutes = (weekdays[foundIndex].hh * 60 + weekdays[foundIndex].mm + totalOffsetMinutes) % 60
                adjustedDate.setHours(hours)
                adjustedDate.setMinutes(minutes);
                result.push(adjustedDate.toISOString().replace("T", " "));
            }
            start.setUTCDate(start.getUTCDate() + 1);
        }
        return result;
    }

    $app.runInTransaction((txDao) => {
        // create routine
        let routineRecord;
        if (routineId.length == 0) {
            const routineCollection = txDao.findCollectionByNameOrId("routines")
            routineRecord = new Record(routineCollection)
        } else {
            routineRecord = txDao.findRecordById("routines", routineId)
        }
        routineRecord.set("teacherStudentRelId", teacherStudentRelId)
        routineRecord.set("satTime", satTime)
        routineRecord.set("sunTime", sunTime)
        routineRecord.set("monTime", monTime)
        routineRecord.set("tueTime", tueTime)
        routineRecord.set("wedTime", wedTime)
        routineRecord.set("thuTime", thuTime)
        routineRecord.set("friTime", friTime)
        routineRecord.set("startDate", startDate)
        routineRecord.set("endDate", endDate)
        routineRecord.set("utcOffset", utcOffset)
        
        txDao.save(routineRecord)

        // delete incomplete class logs
        txDao.db()
            .newQuery(`
                DELETE FROM classLogs
                WHERE teacherId = {:teacherId}
                AND studentId = {:studentId}
                AND status = 'CREATED'
            `)
            .bind({
                teacherId,
                studentId
            })
            .execute()

        // create class logs by date
        const classLogCollection = txDao.findCollectionByNameOrId("classLogs")
        const classTimes = getClassTimes()
        classTimes.forEach(startedAt => {
            const record = new Record(classLogCollection)
            record.set("teacherId", teacherId)
            record.set("studentId", studentId)
            record.set("dailyClassPackageId", dailyClassPackageId)
            record.set("status", "CREATED")
            record.set("teachersPrice", data.dailyClassTeachersPrice)
            record.set("studentsPrice", data.dailyClassStudentsPrice)
            record.set("startedAt", startedAt)
            txDao.save(record)
        })
    })
})

// create custom class logs
// it need to use latest info so use teacher student rel for package
routerAdd("POST", "/api/t/class-logs", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { studentId, utcOffset, logs } = c.requestInfo().body

    // match utc offset using regex
    const utcOffsetRegex = new RegExp('^[+-](0[0-9]|1[0-4]):[0-5][0-9]$');
    if (!utcOffsetRegex.test(utcOffset)) throw ForbiddenError()

    // match times using regex
    const times = logs.map(e => e.time.trim())
    const timeRegex = new RegExp('^([01][0-9]|2[0-3]):([0-5][0-9])$')
    times.forEach(e => {
        if (!timeRegex.test(e)) throw ForbiddenError()
    })

    // confirm date is not in past
    const todayDate = new Date()
    const dates = logs.map(e => e.date.trim())
    dates.forEach(e => {
        if (todayDate > new Date(e)) throw ForbiddenError()
    })

    const data = new DynamicModel({
        dailyClassPackageId: '',
        teacherId: '',
        dailyClassTeachersPrice: '',
        dailyClassStudentsPrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                tsr.dailyClassPackageId,
                t.id AS teacherId,
                tsr.dailyClassTeachersPrice,
                tsr.dailyClassStudentsPrice
            FROM users u 
            JOIN teachers t ON t.userId = u.id
            JOIN teacherStudentRel tsr ON tsr.teacherId = t.id 
            JOIN students s ON tsr.studentId = s.id 
            WHERE u.id = {:teacherUserId}
            AND s.id = {:studentId}
        `)
        .bind({
            teacherUserId: userId,
            studentId
        })
        .one(data)

    const { teacherId, dailyClassPackageId } = data


    const getClassTimes = () => {
        const result = [];

        const start = new Date()

        // local timezone offset
        const localOffsetMinutes = start.getTimezoneOffset();

        const offsetSign = utcOffset.startsWith("+") ? -1 : 1;
        const [hours, minutes] = utcOffset.slice(1).split(":").map(Number);

        // payload timezone offset
        const payloadOffsetMinutes = offsetSign * (hours * 60 + minutes)

        // overall timezone offset
        const totalOffsetMinutes = payloadOffsetMinutes - localOffsetMinutes;

        logs.forEach(log => {
            const adjustedDate = new Date(log.date)
            const hours = Math.floor((Number(log.time.split(":")[0]) * 60 + Number(log.time.split(":")[1]) + totalOffsetMinutes) / 60)
            const minutes = (Number(log.time.split(":")[0]) * 60 + Number(log.time.split(":")[1]) + totalOffsetMinutes) % 60
            adjustedDate.setHours(hours)
            adjustedDate.setMinutes(minutes);
            result.push(adjustedDate.toISOString().replace("T", " "));
        })

        return result;
    }

    $app.runInTransaction((txDao) => {
        // create class logs by date
        const classLogCollection = txDao.findCollectionByNameOrId("classLogs")
        const classTimes = getClassTimes()
        classTimes.forEach(startedAt => {
            const record = new Record(classLogCollection)
            record.set("teacherId", teacherId)
            record.set("studentId", studentId)
            record.set("dailyClassPackageId", dailyClassPackageId)
            record.set("status", "CREATED")
            record.set("teachersPrice", data.dailyClassTeachersPrice)
            record.set("studentsPrice", data.dailyClassStudentsPrice)
            record.set("startedAt", startedAt)
            txDao.save(record)
        })
    })
})

// get class logs by filters
routerAdd("POST", "/api/t/classes/filter", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    let pageSize = c.request.url.query().get("pageSize");
    let pageNo = c.request.url.query().get("pageNo");

    const { utcOffset, startDate, endDate, studentId } = c.requestInfo().body

    pageSize = Number(pageSize) > 0 && Number(pageSize) < 100 ? Number(pageSize) : 50;
    pageNo = Number(pageNo) > 0 ? Number(pageNo) : 1;

    // utcOffset pattern check
    const utcOffsetRegex = new RegExp('^[+-](0[0-9]|1[0-4]):[0-5][0-9]$');
    if (!utcOffsetRegex.test(utcOffset)) throw ForbiddenError()

    const getUTCMinMaxDates = () => {
        // local timezone offset
        const localOffsetMinutes = (new Date()).getTimezoneOffset();

        const offsetSign = utcOffset.startsWith("+") ? -1 : 1;
        const [hours, minutes] = utcOffset.slice(1).split(":").map(Number);

        // payload timezone offset
        const payloadOffsetMinutes = offsetSign * (hours * 60 + minutes)

        // overall timezone offset
        const totalOffsetMinutes = payloadOffsetMinutes - localOffsetMinutes;

        let minStartedAt = "";
        if (startDate?.length > 0) {
            const localStartDate = new Date(startDate);
            localStartDate.setHours(0, 0, 0, 0);
            minStartedAt = new Date(localStartDate.getTime() - totalOffsetMinutes).toISOString().replace("T", " ");
        }

        let maxStartedAt = "";
        if (endDate?.length > 0) {
            const localEndDate = new Date(endDate);
            localEndDate.setHours(23, 59, 59, 999);
            maxStartedAt = new Date(localEndDate.getTime() - totalOffsetMinutes).toISOString().replace("T", " ");
        }
        return {
            minStartedAt,
            maxStartedAt
        };
    }

    const { minStartedAt, maxStartedAt } = getUTCMinMaxDates()

    const filters = []
    if (studentId?.length > 0) filters.push(`AND (s.id = '${studentId}')`)
    if (minStartedAt.length > 0) filters.push(`AND (cl.startedAt) > '${minStartedAt}'`)
    if (maxStartedAt.length > 0) filters.push(`AND (cl.startedAt) < '${maxStartedAt}'`)
    const filter = filters.join(" ")

    const counted = new DynamicModel({
        totalItems: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE(count(cl.id), 0) AS totalItems
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            JOIN students s ON cl.studentId = s.id 
            WHERE tu.id = {:userId}
            ${filter}
        `)
        .bind({
            userId
        })
        .one(counted)

    const totalItems = Number(counted.totalItems)

    const classLogsInfo = arrayOf(new DynamicModel({
        id: '',
        startedAt: '',
        finishedAt: '',
        status: '',
        studentName: '',
        studentLocation: '',
        studentUserId: '',
        studentUserAvatar: '',
        teachersPrice: '',
        classMins: '',
        classNote: '',
        studentWhtsAppNo: '',
        utcOffset: '',
        packageName: ''
    }))

    $app.db()
        .newQuery(`
            SELECT DISTINCT
                cl.id ,
                cl.startedAt ,
                cl.finishedAt ,
                cl.status ,
                su.name AS studentName ,
                su.location AS studentLocation ,
                su.id AS studentUserId ,
                su.whatsAppNo AS studentWhtsAppNo ,
                COALESCE (su.avatar, '') AS studentUserAvatar ,
                dcp.title AS packageName ,
                cl.teachersPrice ,
                dcp.classMins ,
                cl.classNote ,
                COALESCE (su.utcOffset, '') AS utcOffset
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            JOIN students s ON cl.studentId = s.id 
            JOIN users su ON su.id = s.userId 
            JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId
            WHERE tu.id = {:userId}
            ${filter}
            ORDER BY cl.created DESC
            LIMIT ${Number(pageSize)} OFFSET ${(Number(pageNo) - 1) * Number(pageSize)}
        `)
        .bind({
            userId
        })
        .all(classLogsInfo)

    return c.json(200, {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems: totalItems,
        hasNext: pageNo < Math.ceil(totalItems / pageSize),
        hasPrev: pageNo > 1,
        items: classLogsInfo
    })
})

// get class logs by day
routerAdd("POST", "/api/t/classes/day", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { utcOffset, date, studentId } = c.requestInfo().body

    // utcOffset pattern check
    const utcOffsetRegex = new RegExp('^[+-](0[0-9]|1[0-4]):[0-5][0-9]$');
    if (!utcOffsetRegex.test(utcOffset)) throw ForbiddenError()

    const getUTCStartEndOfDay = () => {
        // local timezone offset
        const localOffsetMinutes = (new Date()).getTimezoneOffset();

        const offsetSign = utcOffset.startsWith("+") ? -1 : 1;
        const [hours, minutes] = utcOffset.slice(1).split(":").map(Number);

        // payload timezone offset
        const payloadOffsetMinutes = offsetSign * (hours * 60 + minutes)

        // overall timezone offset
        const totalOffsetMinutes = payloadOffsetMinutes - localOffsetMinutes;

        const localDate = new Date(date);
        localDate.setHours(0, 0, 0, 0);

        const startOfDay = new Date(localDate.getTime() - totalOffsetMinutes);
        const endOfDay = new Date(startOfDay.getTime() + 86400000 - 1);

        return {
            minStartedAt: startOfDay.toISOString().replace("T", " "),
            maxStartedAt: endOfDay.toISOString().replace("T", " ")
        };
    }

    const { minStartedAt, maxStartedAt } = getUTCStartEndOfDay()

    const classLogsInfo = arrayOf(new DynamicModel({
        id: '',
        startedAt: '',
        finishedAt: '',
        status: '',
        studentName: '',
        studentLocation: '',
        studentUserId: '',
        studentUserAvatar: '',
        teachersPrice: '',
        classMins: '',
        classNote: '',
        studentWhtsAppNo: '',
        utcOffset: '',
        packageName: ''
    }))

    const filter = studentId?.length > 0 ? `AND (s.id = '${studentId}')` : ""

    $app.db()
        .newQuery(`
            SELECT DISTINCT
                cl.id ,
                cl.startedAt ,
                cl.finishedAt ,
                cl.status ,
                su.name AS studentName ,
                su.location AS studentLocation ,
                su.id AS studentUserId ,
                su.whatsAppNo AS studentWhtsAppNo ,
                COALESCE (su.avatar, '') AS studentUserAvatar ,
                dcp.title AS packageName ,
                cl.teachersPrice ,
                dcp.classMins ,
                cl.classNote ,
                COALESCE (su.utcOffset, '') AS utcOffset
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            JOIN students s ON cl.studentId = s.id 
            JOIN users su ON su.id = s.userId 
            JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId
            WHERE tu.id = {:userId}
            AND cl.startedAt BETWEEN {:minStartedAt} AND {:maxStartedAt}
            ${filter}
        `)
        .bind({
            userId,
            minStartedAt,
            maxStartedAt
        })
        .all(classLogsInfo)

    return c.json(200, classLogsInfo)
})

// get class logs by month
routerAdd("POST", "/api/t/classes/month", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { utcOffset, year, month, studentId } = c.requestInfo().body

    // utcOffset pattern check
    const utcOffsetRegex = new RegExp('^[+-](0[0-9]|1[0-4]):[0-5][0-9]$');
    if (!utcOffsetRegex.test(utcOffset)) throw ForbiddenError()

    // check year and month
    if (Number(year) <= 2000 || Number(month) < 0 || Number(month) > 11) throw ForbiddenError()

    const getUTCStartEndOfMonth = () => {
        // local timezone offset
        const localOffsetMinutes = (new Date()).getTimezoneOffset();

        const offsetSign = utcOffset.startsWith("+") ? -1 : 1;
        const [hours, minutes] = utcOffset.slice(1).split(":").map(Number);

        // payload timezone offset
        const payloadOffsetMinutes = offsetSign * (hours * 60 + minutes)

        // overall timezone offset
        const totalOffsetMinutes = payloadOffsetMinutes - localOffsetMinutes;

        const startDate = new Date(Number(year), Number(month), 1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(Number(year), Number(month) + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        const startOfDay = new Date(startDate.getTime() - totalOffsetMinutes);
        const endOfDay = new Date(endDate.getTime() - totalOffsetMinutes);

        return {
            minStartedAt: startOfDay.toISOString().replace("T", " "),
            maxStartedAt: endOfDay.toISOString().replace("T", " ")
        };
    }

    const { minStartedAt, maxStartedAt } = getUTCStartEndOfMonth()

    const classLogsInfo = arrayOf(new DynamicModel({
        id: '',
        startedAt: '',
        finishedAt: '',
        status: '',
        studentName: '',
        studentLocation: '',
        studentUserId: '',
        studentUserAvatar: '',
        teachersPrice: '',
        packageName: '',
        classMins: '',
        classNote: '',
        studentWhtsAppNo: '',
        utcOffset: ''
    }))

    const filter = studentId?.length > 0 ? `AND (s.id = '${studentId}')` : ""

    $app.db()
        .newQuery(`
            SELECT DISTINCT
                cl.id ,
                cl.startedAt ,
                cl.finishedAt ,
                cl.status ,
                su.name AS studentName ,
                su.location AS studentLocation ,
                su.id AS studentUserId ,
                su.whatsAppNo AS studentWhtsAppNo ,
                COALESCE (su.avatar, '') AS studentUserAvatar ,
                dcp.title AS packageName ,
                cl.teachersPrice ,
                dcp.classMins ,
                cl.classNote ,
                COALESCE (su.utcOffset, '') AS utcOffset
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            JOIN students s ON cl.studentId = s.id 
            JOIN users su ON su.id = s.userId 
            JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId
            WHERE tu.id = {:userId}
            AND cl.startedAt BETWEEN {:minStartedAt} AND {:maxStartedAt}
            ${filter}
        `)
        .bind({
            userId,
            minStartedAt,
            maxStartedAt
        })
        .all(classLogsInfo)

    return c.json(200, classLogsInfo)
})

// get stats of class and earnings
routerAdd("POST", "/api/t/classes/stats", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { utcOffset, year, month } = c.requestInfo().body

    // utcOffset pattern check
    const utcOffsetRegex = new RegExp('^[+-](0[0-9]|1[0-4]):[0-5][0-9]$');
    if (!utcOffsetRegex.test(utcOffset)) throw ForbiddenError()

    // check year and month
    if (Number(year) <= 2000 || Number(month) < 0 || Number(month) > 11) throw ForbiddenError()

    const getUTCStartEndOfMonth = () => {
        // local timezone offset
        const localOffsetMinutes = (new Date()).getTimezoneOffset();

        const offsetSign = utcOffset.startsWith("+") ? -1 : 1;
        const [hours, minutes] = utcOffset.slice(1).split(":").map(Number);

        // payload timezone offset
        const payloadOffsetMinutes = offsetSign * (hours * 60 + minutes)

        // overall timezone offset
        const totalOffsetMinutes = payloadOffsetMinutes - localOffsetMinutes;

        const startDate = new Date(Number(year), Number(month), 1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(Number(year), Number(month) + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        const startOfDay = new Date(startDate.getTime() - totalOffsetMinutes);
        const endOfDay = new Date(endDate.getTime() - totalOffsetMinutes);

        return {
            minStartedAt: startOfDay.toISOString().replace("T", " "),
            maxStartedAt: endOfDay.toISOString().replace("T", " ")
        };
    }

    const { minStartedAt, maxStartedAt } = getUTCStartEndOfMonth()

    const completedClassInfo = new DynamicModel({
        totalClass: '',
        totalPrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT
                COALESCE (count(cl.id), 0) AS totalClass ,
                COALESCE (sum(cl.teachersPrice), 0) AS totalPrice
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            WHERE tu.id = {:userId}
            AND cl.status = 'FINISHED'
            AND cl.startedAt BETWEEN {:minStartedAt} AND {:maxStartedAt}
        `)
        .bind({
            userId,
            minStartedAt,
            maxStartedAt
        })
        .one(completedClassInfo)

    // it need to use latest info so use teacher student rel for package
    const pendingClassInfo = new DynamicModel({
        totalClass: '',
        totalPrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT
                COALESCE (count(cl.id), 0) AS totalClass ,
                COALESCE (sum(cl.teachersPrice), 0) AS totalPrice
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            WHERE tu.id = {:userId}
            AND cl.status != 'FINISHED'
            AND cl.startedAt BETWEEN {:minStartedAt} AND {:maxStartedAt}
        `)
        .bind({
            userId,
            minStartedAt,
            maxStartedAt
        })
        .one(pendingClassInfo)

    return c.json(200, {
        completedClassInfo,
        pendingClassInfo
    })
})

// get notices
routerAdd("GET", "/api/t/notices", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const limitQuery = c.request.url.query().get("limit")
    const limit = Number(limitQuery) > 0 ? Number(limitQuery) : 5

    const noticeInfo = arrayOf(new DynamicModel({
        id: '',
        title: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                n.id,
                n.title 
            FROM notices n 
            WHERE EXISTS (
                SELECT 1 FROM teachers t 
                JOIN users u ON t.userId = u.id
                AND u.id = {:userId}
            )
            AND n.userType = 'TEACHER'
            ORDER BY n.created DESC 
            LIMIT {:limit}
        `)
        .bind({
            userId,
            limit
        })
        .all(noticeInfo)

    return c.json(200, noticeInfo)
})

// get class note
routerAdd("GET", "/api/t/class-notes/{id}", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")

    const classNoteInfo = new DynamicModel({
        classNote: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                cl.classNote 
            FROM classLogs cl
            JOIN teachers t ON t.id = cl.teacherId 
            JOIN users u ON u.id = t.userId 
            WHERE u.id = {:userId}
            AND cl.id = {:id}   
        `)
        .bind({
            userId,
            id
        })
        .one(classNoteInfo)

    return c.json(200, classNoteInfo.classNote)
})

// update class note
routerAdd("POST", "/api/t/class-notes/{id}", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")
    const { classNote } = c.requestInfo().body

    $app.db()
        .newQuery(`
            UPDATE classLogs SET classNote = {:classNote}
            WHERE id = {:id} AND teacherId = (
                SELECT t.id FROM teachers t
                JOIN users u ON t.userId = u.id
                WHERE u.id = {:userId}
            )
        `)
        .bind({
            classNote,
            id,
            userId
        })
        .execute()

    return c.json(200)
})

// get class logs id
routerAdd("GET", "/api/t/class-logs/{id}", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")

    const classLogInfo = new DynamicModel({
        id: '',
        studentUserId: '',
        studentName: '',
        studentAvatar: '',
        studentWhatsAppNo: '',
        studentLocation: '',
        studentOffset: '',
        teacherUserId: '',
        teacherName: '',
        teacherAvatar: '',
        teacherWhatsAppNo: '',
        teacherLocation: '',
        teacherOffset: '',
        startedAt: '',
        finishedAt: '',
        status: '',
        classNote: '',
        packageId: '',
        packageTitle: '',
        classMins: '',
        teachersPrice: '',
        classLink: '',
        disableClass: ''
    });

    $app.db()
        .newQuery(`
            SELECT DISTINCT
                cl.id,
                su.id AS studentUserId,
                su.name AS studentName ,
                su.avatar AS studentAvatar ,
                su.whatsAppNo AS studentWhatsAppNo ,
                su.location AS studentLocation ,
                su.utcOffset AS studentOffset ,
                tu.id AS teacherUserId,
                tu.name AS teacherName ,
                tu.avatar AS teacherAvatar ,
                tu.whatsAppNo AS teacherWhatsAppNo ,
                tu.location AS teacherLocation ,
                tu.utcOffset AS teacherOffset ,
                cl.startedAt ,
                COALESCE (cl.finishedAt, '') AS finishedAt ,
                cl.status ,
                COALESCE (cl.classNote, '') AS classNote ,
                dcp.id AS packageId ,
                dcp.title AS packageTitle ,
                dcp.classMins ,
                cl.teachersPrice ,
                COALESCE (tsr.classLink, '') AS classLink,
                s.disableClass
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            JOIN students s ON cl.studentId = s.id 
            JOIN users su ON su.id = s.userId 
            JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId
            JOIN teacherStudentRel tsr ON tsr.teacherId = t.id AND tsr.studentId = s.id
            WHERE cl.id = {:id}
            AND tu.id = {:userId}
        `)
        .bind({
            id,
            userId
        })
        .one(classLogInfo)

    return c.json(200, classLogInfo)
})

// start class
routerAdd("POST", "/api/t/class-logs/{id}/start", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")

    $app.db()
        .newQuery(`
            UPDATE classLogs 
            SET 
                startedAt = CURRENT_TIMESTAMP , 
                status = 'STARTED' 
            WHERE id = {:id}
            AND status = 'CREATED'
            AND teacherId = (
                SELECT id FROM teachers WHERE userId = {:userId}
            )
        `)
        .bind({
            id,
            userId
        })
        .execute()

    return c.json(200)
})

// finish class
routerAdd("POST", "/api/t/class-logs/{id}/finish", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")

    $app.db()
        .newQuery(`
            UPDATE classLogs 
            SET 
                finishedAt = CURRENT_TIMESTAMP , 
                status = 'FINISHED'
            WHERE id = {:id}
            AND status = 'STARTED'
            AND teacherId = (
                SELECT id FROM teachers WHERE userId = {:userId}
            )
        `)
        .bind({
            id,
            userId
        })
        .execute()

    return c.json(200)
})

// delete class
// Once invoice has been issued you can not delete class
routerAdd("POST", "/api/t/class-logs/{id}/delete", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")

    const invoiceInfo = new DynamicModel({
        studentInvoiceId: '',
        teacherInvoiceId: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE (si.id, '') AS studentInvoiceId,
                COALESCE (ti.id, '') AS teacherInvoiceId
            FROM classLogs cl 
            LEFT JOIN invoices si ON si.id = cl.studentInvoiceId 
            LEFT JOIN invoices ti ON ti.id = cl.teacherInvoiceId 
            WHERE cl.id = {:id}   
        `)
        .bind({
            id
        })
        .one(invoiceInfo)

    if (invoiceInfo.studentInvoiceId.length > 0 || invoiceInfo.teacherInvoiceId.length > 0) {
        throw ApiError(500, "Class has already been invoiced!")
    }

    $app.db()
        .newQuery(`
            DELETE FROM classLogs 
            WHERE id = {:id}
            AND teacherId = (
                SELECT id FROM teachers WHERE userId = {:userId}
            )
        `)
        .bind({
            id,
            userId
        })
        .execute()

    return c.json(200)
})

// update calss package
// Once invoice has been issued you can not update daily package
routerAdd("POST", "/api/t/class-logs/{id}/package", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")
    const { dailyClassPackageId } = c.requestInfo().body

    const invoiceInfo = new DynamicModel({
        studentInvoiceId: '',
        teacherInvoiceId: '',
        dailyClassPackageId: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE (si.id, '') AS studentInvoiceId,
                COALESCE (ti.id, '') AS teacherInvoiceId,
                cl.dailyClassPackageId
            FROM classLogs cl 
            LEFT JOIN studentInvoices si ON si.id = cl.studentInvoiceId 
            LEFT JOIN teacherInvoices ti ON ti.id = cl.teacherInvoiceId 
            WHERE cl.id = {:id}   
        `)
        .bind({
            id
        })
        .one(invoiceInfo)

    if (invoiceInfo.studentInvoiceId.length > 0 || invoiceInfo.teacherInvoiceId.length > 0) {
        throw ApiError(500, "Class has already been invoiced!")
    }

    if (invoiceInfo.dailyClassPackageId != dailyClassPackageId) {
        $app.db()
            .newQuery(`
            UPDATE classLogs 
            SET 
                dailyClassPackageId = {:dailyClassPackageId} ,
                teachersPrice = (
                    SELECT teachersPrice FROM dailyClassPackages WHERE id = {:dailyClassPackageId}
                ),
                studentsPrice = (
                    SELECT studentsPrice FROM dailyClassPackages WHERE id = {:dailyClassPackageId}
                )
            WHERE id = {:id}
            AND status = 'FINISHED'
            AND teacherId = (
                SELECT id FROM teachers WHERE userId = {:userId}
            )
        `)
            .bind({
                id,
                userId,
                dailyClassPackageId
            })
            .execute()
    }

    return c.json(200)
})

// ======================================================================
// STUDENT API
// ======================================================================

routerAdd("GET", "/api/s/notices", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const limitQuery = c.request.url.query().get("limit")
    const limit = Number(limitQuery) > 0 ? Number(limitQuery) : 5

    const noticeInfo = arrayOf(new DynamicModel({
        id: '',
        title: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                n.id,
                n.title 
            FROM notices n 
            WHERE EXISTS (
                SELECT 1 FROM students s 
                JOIN users u ON s.userId = u.id
                AND u.id = {:userId}
            )
            AND n.userType = 'STUDENT'
            ORDER BY n.created DESC 
            LIMIT {:limit}
        `)
        .bind({
            userId,
            limit
        })
        .all(noticeInfo)

    return c.json(200, noticeInfo)
})

// ======================================================================
// ADMIN API
// ======================================================================

// create student
routerAdd("POST", "/api/a/student", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    const { email, name, password, whatsAppNo, utcOffset, location, teacherId, classLink, dailyClassPackageId, dailyClassTeachersPrice, dailyClassStudentsPrice } = c.requestInfo().body

    $app.runInTransaction((txDao) => {
        const userCollection = txDao.findCollectionByNameOrId("users")
        const userRecord = new Record(userCollection)
        userRecord.setPassword(password)
        userRecord.set("email", email)
        userRecord.set("name", name)
        userRecord.set("whatsAppNo", whatsAppNo)
        userRecord.set("utcOffset", utcOffset)
        userRecord.set("location", location)
        txDao.save(userRecord)

        const userId = userRecord.get("id")
        const studentCollection = txDao.findCollectionByNameOrId("students")
        const studentRecord = new Record(studentCollection)
        studentRecord.set("userId", userId)
        txDao.save(studentRecord)

        if(teacherId.length > 0){
            const studentId = studentRecord.get("id")
            const teacherStudentRelCollection = txDao.findCollectionByNameOrId("teacherStudentRel")
            const teacherStudentRelRecord = new Record(teacherStudentRelCollection)
            teacherStudentRelRecord.set("studentId", studentId)
            teacherStudentRelRecord.set("teacherId", teacherId)
            teacherStudentRelRecord.set("classLink", classLink)
            teacherStudentRelRecord.set("dailyClassPackageId", dailyClassPackageId)
            teacherStudentRelRecord.set("dailyClassTeachersPrice", dailyClassTeachersPrice)
            teacherStudentRelRecord.set("dailyClassStudentsPrice", dailyClassStudentsPrice)
            txDao.save(teacherStudentRelRecord)
        }
    })

    return c.json(200)    
})

// create student
routerAdd("POST", "/api/a/teacher", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    const { email, name, password, whatsAppNo, utcOffset, location} = c.requestInfo().body

    $app.runInTransaction((txDao) => {
        const userCollection = txDao.findCollectionByNameOrId("users")
        const userRecord = new Record(userCollection)
        userRecord.setPassword(password)
        userRecord.set("email", email)
        userRecord.set("name", name)
        userRecord.set("whatsAppNo", whatsAppNo)
        userRecord.set("utcOffset", utcOffset)
        userRecord.set("location", location)
        txDao.save(userRecord)

        const userId = userRecord.get("id")
        const teacherCollection = txDao.findCollectionByNameOrId("teachers")
        const teacherRecord = new Record(teacherCollection)
        teacherRecord.set("userId", userId)
        txDao.save(teacherRecord)
    })

    return c.json(200)    
})

// get list of students with last invoice data
routerAdd("GET", "/api/a/student-last-invoices", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    let pageSize = c.request.url.query().get("pageSize");
    let pageNo = c.request.url.query().get("pageNo");
    const studentId = c.request.url.query().get("studentId")

    pageSize = Number(pageSize) > 0 && Number(pageSize) < 100 ? Number(pageSize) : 50;
    pageNo = Number(pageNo) > 0 ? Number(pageNo) : 1;

    const filters = []
    if (studentId?.length > 0) filters.push(`s.id = '${studentId}'`)
    const filter = filters.join(" AND ")

    const counted = new DynamicModel({
        totalItems: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE(count(s.id), 0) AS totalItems
            FROM students s 
            JOIN users u ON u.id = s.userId 
            ${filter.length > 0 ? "WHERE" : ""}
            ${filter}
        `)
        .one(counted)

    const totalItems = Number(counted.totalItems)

    const studentInvoiceInfo = arrayOf(new DynamicModel({
        userId: '',
        studentId: '',
        name: '',
        email: '',
        location: '',
        whatsAppNo: '',
        created: ''
    }))

    $app.db()
        .newQuery(`
            SELECT
                u.id AS userId ,
                s.id AS studentId ,
                u.name ,
                u.email ,
                u.whatsAppNo ,
                u.location ,
                COALESCE (MAX (si.created), '') AS created
            FROM students s 
            JOIN users u ON u.id = s.userId 
            LEFT JOIN classLogs cl ON cl.studentId = s.id 
            LEFT JOIN studentInvoices si ON si.id = cl.studentInvoiceId 
            ${filter.length > 0 ? "WHERE" : ""}
            ${filter}
            GROUP BY s.id 
            ORDER BY (CASE WHEN MAX (si.created) IS NULL THEN 0 ELSE 1 END), MAX (si.created) DESC
            LIMIT ${Number(pageSize)} OFFSET ${(Number(pageNo) - 1) * Number(pageSize)}
        `)
        .all(studentInvoiceInfo)

    return c.json(200, {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems: totalItems,
        hasNext: pageNo < Math.ceil(totalItems / pageSize),
        hasPrev: pageNo > 1,
        items: studentInvoiceInfo
    })
})

// get list of teachers with last invoice data
routerAdd("GET", "/api/a/teacher-last-invoices", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    let pageSize = c.request.url.query().get("pageSize");
    let pageNo = c.request.url.query().get("pageNo");
    const teacherId = c.request.url.query().get("teacherId")

    pageSize = Number(pageSize) > 0 && Number(pageSize) < 100 ? Number(pageSize) : 50;
    pageNo = Number(pageNo) > 0 ? Number(pageNo) : 1;

    const filters = []
    if (teacherId?.length > 0) filters.push(`t.id = '${teacherId}'`)
    const filter = filters.join(" AND ")

    const counted = new DynamicModel({
        totalItems: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE(count(t.id), 0) AS totalItems
            FROM teachers t 
            JOIN users u ON u.id = t.userId 
            ${filter.length > 0 ? "WHERE" : ""}
            ${filter}
        `)
        .one(counted)

    const totalItems = Number(counted.totalItems)

    const teacherInvoiceInfo = arrayOf(new DynamicModel({
        userId: '',
        teacherId: '',
        name: '',
        email: '',
        location: '',
        whatsAppNo: '',
        created: ''
    }))

    $app.db()
        .newQuery(`
            SELECT
                u.id AS userId ,
                t.id AS teacherId ,
                u.name ,
                u.email ,
                u.whatsAppNo ,
                u.location ,
                COALESCE (MAX (ti.created), '') AS created
            FROM teachers t 
            JOIN users u ON u.id = t.userId 
            LEFT JOIN classLogs cl ON cl.teacherId = t.id 
            LEFT JOIN teacherInvoices ti ON ti.id = cl.teacherInvoiceId 
            ${filter.length > 0 ? "WHERE" : ""}
            ${filter}
            GROUP BY t.id
            ORDER BY (CASE WHEN MAX (ti.created) IS NULL THEN 0 ELSE 1 END), MAX (ti.created) DESC
            LIMIT ${Number(pageSize)} OFFSET ${(Number(pageNo) - 1) * Number(pageSize)}
        `)
        .all(teacherInvoiceInfo)

    return c.json(200, {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems: totalItems,
        hasNext: pageNo < Math.ceil(totalItems / pageSize),
        hasPrev: pageNo > 1,
        items: teacherInvoiceInfo
    })
})

// create student invoices
routerAdd("POST", "/api/a/student-invoices", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    const { studentIds } = c.requestInfo().body
    if (studentIds.length == 0) return;

    $app.runInTransaction((txDao) => {
        // create student invoice
        const invoiceCollection = txDao.findCollectionByNameOrId("studentInvoices")
        const invoiceRecord = new Record(invoiceCollection)
        txDao.save(invoiceRecord)

        // get student invoice id
        const studentInvoiceId = invoiceRecord.get("id")

        // populate class logs
        const filter = studentIds.map(e => `'${e}'`).join(",")
        txDao.db()
            .newQuery(`
                UPDATE classLogs 
                SET studentInvoiceId = {:studentInvoiceId}
                WHERE status = 'FINISHED'
                AND studentInvoiceId = ''
                AND studentId IN (${filter})
            `)
            .bind({
                studentInvoiceId
            })
            .execute()
    })

    return c.json(200)
})

// create teacher invoices
routerAdd("POST", "/api/a/teacher-invoices", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    const { teacherIds } = c.requestInfo().body
    if (teacherIds.length == 0) return;

    $app.runInTransaction((txDao) => {
        // create student invoice
        const invoiceCollection = txDao.findCollectionByNameOrId("teacherInvoices")
        const invoiceRecord = new Record(invoiceCollection)
        txDao.save(invoiceRecord)

        // get student invoice id
        const teacherInvoiceId = invoiceRecord.get("id")

        // populate class logs
        const filter = teacherIds.map(e => `'${e}'`).join(",")
        txDao.db()
            .newQuery(`
                UPDATE classLogs 
                SET teacherInvoiceId = {:teacherInvoiceId}
                WHERE status = 'FINISHED'
                AND teacherInvoiceId = ''
                AND teacherId IN (${filter})
            `)
            .bind({
                teacherInvoiceId
            })
            .execute()
    })

    return c.json(200)
})

// rollback student invoice
routerAdd("POST", "/api/a/student-invoices-rollback", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    const { studentInvoiceId } = c.requestInfo().body

    $app.runInTransaction((txDao) => {
        // remove student invoice id from class logs
        txDao.db()
            .newQuery(`
                UPDATE classLogs 
                SET studentInvoiceId = ''
                WHERE studentInvoiceId = {:studentInvoiceId}
            `)
            .bind({
                studentInvoiceId
            })
            .execute()

        // delete student invoice
        const record = txDao.findRecordById("studentInvoices", studentInvoiceId)
        txDao.delete(record)
    })

    return c.json(200)
})

// rollback teacher invoice
routerAdd("POST", "/api/a/teacher-invoices-rollback", (c) => {
    const isSuperUser = c.hasSuperuserAuth()
    if (!isSuperUser) throw ForbiddenError()

    const { teacherInvoiceId } = c.requestInfo().body

    $app.runInTransaction((txDao) => {
        // remove teacher invoice id from class logs
        txDao.db()
            .newQuery(`
                UPDATE classLogs 
                SET teacherInvoiceId = ''
                WHERE teacherInvoiceId = {:teacherInvoiceId}
            `)
            .bind({
                teacherInvoiceId
            })
            .execute()

        // delete teacher invoice
        const record = txDao.findRecordById("teacherInvoices", teacherInvoiceId)
        txDao.delete(record)
    })

    return c.json(200)
})

// ======================================================================
// PUBLIC INVOICE API
// ======================================================================

routerAdd("GET", "/invoice/student/{studentInvoiceId}/{studentId}/html", (c) => {
    const studentInvoiceId = c.request.pathValue("studentInvoiceId")
    const studentId = c.request.pathValue("studentId")

    const studentData = new DynamicModel({
        userId: '',
        studentId: '',
        name: '',
        email: '',
        whatsAppNo: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                u.id AS userId ,
                s.id AS studentId ,
                u.name ,
                u.email ,
                u.whatsAppNo 
            FROM students s 
            JOIN users u ON s.userId = u.id 
            WHERE s.id = {:studentId}
        `)
        .bind({
            studentId
        })
        .one(studentData)

    const emptyClassData = {
        id: '',
        startedAt: '',
        finishedAt: '',
        teacherName: '',
        teacherWhatsAppNo: '',
        packageName: '',
        packageClassMins: '',
        studentsPrice: ''
    }

    const classData = arrayOf(new DynamicModel({
        id: '',
        startedAt: '',
        finishedAt: '',
        teacherName: '',
        teacherWhatsAppNo: '',
        packageName: '',
        packageClassMins: '',
        studentsPrice: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                cl.id ,
                cl.startedAt ,
                cl.finishedAt ,
                tu.name AS teacherName ,
                tu.whatsAppNo AS teacherWhatsAppNo ,
                dcp.title AS packageName ,
                dcp.classMins AS packageClassMins ,
                cl.studentsPrice 
            FROM students s 
            JOIN users su ON s.userId = su.id 
            JOIN classLogs cl ON cl.studentId = s.id 
            JOIN studentInvoices si ON si.id = cl.studentInvoiceId 
            JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId 
            JOIN teachers t ON t.id = cl.teacherId 
            JOIN users tu ON tu.id = t.userId 
            WHERE si.id = {:studentInvoiceId}
            AND s.id = {:studentId}
        `)
        .bind({
            studentInvoiceId,
            studentId
        })
        .all(classData)

    const dueData = new DynamicModel({
        duePrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE (sum(cl.studentsPrice), 0) AS duePrice
            FROM students s 
            JOIN classLogs cl ON cl.studentId = s.id 
            JOIN studentInvoices si ON si.id = cl.studentInvoiceId 
            WHERE si.created <= (SELECT created FROM studentInvoices WHERE id = {:studentInvoiceId})
            AND s.id = {:studentId}
            AND si.id != {:studentInvoiceId}
        `)
        .bind({
            studentInvoiceId,
            studentId
        })
        .one(dueData)

    const paidData = new DynamicModel({
        paidPrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE (sum(sb.paidAmount), 0) AS paidPrice
            FROM students s 
            JOIN studentBalances sb ON sb.studentId = s.id 
            WHERE sb.created <= (SELECT created FROM studentInvoices WHERE id = {:studentInvoiceId})
            AND s.id = {:studentId}
        `)
        .bind({
            studentInvoiceId,
            studentId
        })
        .one(paidData)

    const invoiceDate = new DynamicModel({
        created: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                created
            FROM studentInvoices WHERE id = {:studentInvoiceId}
        `)
        .bind({
            studentInvoiceId
        })
        .one(invoiceDate)

    function formatDate(dateString) {
        const date = new Date(dateString);

        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Extract day, month name, and year
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
        const month = monthNames[date.getMonth()]; // Get month name
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    const html = $template.loadFiles(
        `${__hooks}/views/student-receipt.html`
    ).render({
        ...studentData,
        invoiceDate: formatDate(invoiceDate.created),
        classLogs: classData.length > 0 ? classData.map(e => { return { ...e } }) : [{ ...emptyClassData }],
        classPrice: classData.map(e => Number(e.studentsPrice)).reduce((b, a) => b + a, 0),
        duePrice: Number(dueData.duePrice) - Number(paidData.paidPrice),
        totalPrice: classData.map(e => Number(e.studentsPrice)).reduce((b, a) => b + a, 0) + Number(dueData.duePrice) - Number(paidData.paidPrice)
    })

    return c.html(200, html)
})

routerAdd("GET", "/invoice/teacher/{teacherInvoiceId}/{teacherId}/html", (c) => {
    const teacherInvoiceId = c.request.pathValue("teacherInvoiceId")
    const teacherId = c.request.pathValue("teacherId")

    const teacherData = new DynamicModel({
        userId: '',
        teacherId: '',
        name: '',
        email: '',
        whatsAppNo: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                u.id AS userId ,
                t.id AS teacherId ,
                u.name ,
                u.email ,
                u.whatsAppNo 
            FROM teachers t 
            JOIN users u ON t.userId = u.id 
            WHERE t.id = {:teacherId}
        `)
        .bind({
            teacherId
        })
        .one(teacherData)

    const emptyClassData = {
        id: '',
        startedAt: '',
        finishedAt: '',
        studentName: '',
        studentWhatsAppNo: '',
        packageName: '',
        packageClassMins: '',
        teachersPrice: ''
    }

    const classData = arrayOf(new DynamicModel({
        id: '',
        startedAt: '',
        finishedAt: '',
        studentName: '',
        studentWhatsAppNo: '',
        packageName: '',
        packageClassMins: '',
        teachersPrice: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                cl.id ,
                cl.startedAt ,
                cl.finishedAt ,
                su.name AS studentName ,
                su.whatsAppNo AS studentWhatsAppNo ,
                dcp.title AS packageName ,
                dcp.classMins AS packageClassMins ,
                cl.teachersPrice 
            FROM teachers t 
            JOIN users tu ON tu.id = t.userId 
            JOIN classLogs cl ON cl.teacherId = t.id 
            JOIN teacherInvoices ti ON ti.id = cl.teacherInvoiceId 
            JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId 
            JOIN students s ON s.id = cl.studentId
            JOIN users su ON s.userId = su.id 
            WHERE ti.id = {:teacherInvoiceId}
            AND t.id = {:teacherId}
        `)
        .bind({
            teacherInvoiceId,
            teacherId
        })
        .all(classData)

    const dueData = new DynamicModel({
        duePrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE (sum(cl.teachersPrice), 0) AS duePrice
            FROM teachers t 
            JOIN classLogs cl ON cl.teacherId = t.id 
            JOIN teacherInvoices ti ON ti.id = cl.teacherInvoiceId 
            WHERE ti.created <= (SELECT created FROM teacherInvoices WHERE id = {:teacherInvoiceId})
            AND t.id = {:teacherId}
            AND ti.id != {:teacherInvoiceId}
        `)
        .bind({
            teacherInvoiceId,
            teacherId
        })
        .one(dueData)

    const paidData = new DynamicModel({
        paidPrice: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE (sum(tb.paidAmount), 0) AS paidPrice
            FROM teachers t 
            JOIN teacherBalances tb ON tb.teacherId = t.id 
            WHERE tb.created <= (SELECT created FROM teacherInvoices WHERE id = {:teacherInvoiceId})
            AND t.id = {:teacherId}
        `)
        .bind({
            teacherInvoiceId,
            teacherId
        })
        .one(paidData)

    const invoiceDate = new DynamicModel({
        created: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                created
            FROM teacherInvoices WHERE id = {:teacherInvoiceId}
        `)
        .bind({
            teacherInvoiceId
        })
        .one(invoiceDate)

    function formatDate(dateString) {
        const date = new Date(dateString);

        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Extract day, month name, and year
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
        const month = monthNames[date.getMonth()]; // Get month name
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    const html = $template.loadFiles(
        `${__hooks}/views/teacher-receipt.html`
    ).render({
        ...teacherData,
        invoiceDate: formatDate(invoiceDate.created),
        classLogs: classData.length > 0 ? classData.map(e => { return { ...e } }) : [{ ...emptyClassData }],
        classPrice: classData.map(e => Number(e.teachersPrice)).reduce((b, a) => b + a, 0),
        duePrice: Number(dueData.duePrice) - Number(paidData.paidPrice),
        totalPrice: classData.map(e => Number(e.teachersPrice)).reduce((b, a) => b + a, 0) + Number(dueData.duePrice) - Number(paidData.paidPrice)
    })

    return c.html(200, html)
})