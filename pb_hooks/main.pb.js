// remove mismatched / expired class logs every minute every 1 minute
cronAdd("remove-expired-teacher-student-class-logs", "*/1 * * * *", () => {
    $app.db()
        .newQuery(`
            DELETE FROM classLogs 
            WHERE status = 'CREATED' 
            AND EXISTS (
                SELECT 1 FROM teacherStudentRel tsr 
                WHERE tsr.studentId = classLogs.studentId 
                AND tsr.teacherId != classLogs.teacherId
            )
        `)
        .execute()
    console.log("Class logs cleaned 🙏")
})

routerAdd("GET", "/api/self", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const userInfo = new DynamicModel({
        isTeacher: '',
        isStudent: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                CASE WHEN t.id IS NOT NULL THEN TRUE ELSE FALSE END AS isTeacher,
                CASE WHEN s.id IS NOT NULL THEN TRUE ELSE FALSE END AS isStudent
            FROM users u 
            LEFT JOIN students s ON s.userId = u.id 
            LEFT JOIN teachers t ON t.userId = u.id
            WHERE u.id = {:userId}
        `)
        .bind({
            userId
        })
        .one(userInfo)

    return c.json(200, {
        isTeacher: userInfo.isTeacher == 1,
        isStudent: userInfo.isStudent == 1,
    })
})

// it need to use latest info so use teacher student rel for package
routerAdd("GET", "/api/t/students", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const studentsInfo = arrayOf(new DynamicModel({
        id: '',
        name: '',
        packageName: '',
        packageClassMins: '',
        country: '',
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
                us.country ,
                us.whatsAppNo ,
                us.avatar ,
                dcp.title AS packageName ,
                dcp.classMins AS packageClassMins ,
                dcp.teachersPrice ,
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
        teacherId: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                tsr.id AS teacherStudentRelId,
                tsr.dailyClassPackageId,
                COALESCE (r.id, '') AS routineId,
                t.id AS teacherId
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
                adjustedDate.setMinutes(weekdays[foundIndex].hh * 60 + weekdays[foundIndex].mm + totalOffsetMinutes);
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
            // teachersPrice will be set when completed
            // studentsPrice will be set when completed
            record.set("startedAt", startedAt)
            txDao.save(record)
        })
    })
})

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
        teacherId: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                tsr.dailyClassPackageId,
                t.id AS teacherId
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
            adjustedDate.setMinutes(Number(log.time.split(":")[0]) * 60 + Number(log.time.split(":")[1]) + totalOffsetMinutes);
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
            // teachersPrice will be set when completed
            // studentsPrice will be set when completed
            record.set("startedAt", startedAt)
            txDao.save(record)
        })
    })
})

routerAdd("POST", "/api/t/classes/filter", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    let pageSize = c.request.url.query().get("pageSize");
    let pageNo = c.request.url.query().get("pageNo");

    const { utcOffset, startDate, endDate, studentId } = c.requestInfo().body

    pageSize = Number(pageSize) > 0 ? Number(pageSize) : 20;
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
        studentCountry: '',
        studentUserId: '',
        studentUserAvatar: '',
        teachersPrice: '',
        classMins: '',
        classNote: '',
        studentWhtsAppNo: ''
    }))

    $app.db()
        .newQuery(`
            SELECT DISTINCT
                cl.id ,
                cl.startedAt ,
                cl.finishedAt ,
                cl.status ,
                su.name AS studentName ,
                su.country AS studentCountry ,
                su.id AS studentUserId ,
                su.whatsAppNo AS studentWhtsAppNo ,
                COALESCE (su.avatar, '') AS studentUserAvatar ,
                dcp.teachersPrice ,
                dcp.classMins ,
                cl.classNote 
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
        studentCountry: '',
        studentUserId: '',
        studentUserAvatar: '',
        teachersPrice: '',
        classMins: '',
        classNote: '',
        studentWhtsAppNo: ''
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
                su.country AS studentCountry ,
                su.id AS studentUserId ,
                su.whatsAppNo AS studentWhtsAppNo ,
                COALESCE (su.avatar, '') AS studentUserAvatar ,
                dcp.teachersPrice ,
                dcp.classMins ,
                cl.classNote 
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
        studentCountry: '',
        studentUserId: '',
        studentUserAvatar: '',
        teachersPrice: '',
        classMins: '',
        classNote: '',
        studentWhtsAppNo: ''
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
                su.country AS studentCountry ,
                su.id AS studentUserId ,
                su.whatsAppNo AS studentWhtsAppNo ,
                COALESCE (su.avatar, '') AS studentUserAvatar ,
                dcp.teachersPrice ,
                dcp.classMins ,
                cl.classNote 
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
                COALESCE (sum(dcp.teachersPrice), 0) AS totalPrice
            FROM classLogs cl 
            JOIN teachers t ON cl.teacherId = t.id 
            JOIN users tu ON tu.id = t.userId 
            JOIN teacherStudentRel tsr ON tsr.teacherId = cl.teacherId AND tsr.studentId = cl.studentId
            JOIN dailyClassPackages dcp ON tsr.dailyClassPackageId = dcp.id  
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

routerAdd("GET", "/api/t/class-logs/{id}", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")

    const classLogInfo = new DynamicModel({
        id: '',
        studentName: '',
        studentAvatar: '',
        studentWhatsAppNo: '',
        studentCountry: '',
        studentOffset: '',
        teacherName: '',
        teacherAvatar: '',
        teacherWhatsAppNo: '',
        teacherCountry: '',
        teacherOffset: '',
        startedAt: '',
        finishedAt: '',
        status: '',
        classNote: '',
        packageId: '',
        packageTitle: '',
        classMins: '',
        teachersPrice: '',
        classLink: ''
    });

    $app.db()
        .newQuery(`
            SELECT DISTINCT
                cl.id,
                su.name AS studentName ,
                su.avatar AS studentAvatar ,
                su.whatsAppNo AS studentWhatsAppNo ,
                su.country AS studentCountry ,
                su.utcOffset AS studentOffset ,
                tu.name AS teacherName ,
                tu.avatar AS teacherAvatar ,
                tu.whatsAppNo AS teacherWhatsAppNo ,
                tu.country AS teacherCountry ,
                tu.utcOffset AS teacherOffset ,
                cl.startedAt ,
                COALESCE (cl.finishedAt, '') AS finishedAt ,
                cl.status ,
                COALESCE (cl.classNote, '') AS classNote ,
                dcp.id AS packageId ,
                dcp.title AS packageTitle ,
                dcp.classMins ,
                dcp.teachersPrice ,
                COALESCE (tsr.classLink, '') AS classLink
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

routerAdd("POST", "/api/t/class-logs/{id}/finish", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")

    $app.db()
        .newQuery(`
            UPDATE classLogs 
            SET 
                finishedAt = CURRENT_TIMESTAMP , 
                status = 'FINISHED' ,
                teachersPrice = (
                    SELECT dcp.teachersPrice FROM classLogs cl 
                    JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId 
                    WHERE cl.id = {:id}
                ),
                studentsPrice = (
                    SELECT dcp.studentsPrice FROM classLogs cl 
                    JOIN dailyClassPackages dcp ON dcp.id = cl.dailyClassPackageId 
                    WHERE cl.id = {:id}
                )
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

// Once invoice has been issued you can not update daily package
routerAdd("POST", "/api/t/class-logs/{id}/package", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const id = c.request.pathValue("id")
    const { dailyClassPackageId } = c.requestInfo().body

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

    return c.json(200)
})

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