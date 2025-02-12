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

routerAdd("GET", "/api/t/students", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const studentsInfo = arrayOf(new DynamicModel({
        id: '',
        name: '',
        packageName: '',
        packageClassMins: '',
        utcOffset: '',
        satTime: '',
        sunTime: '',
        monTime: '',
        tueTime: '',
        wedTime: '',
        thuTime: '',
        friTime: '',
        startDate: '',
        endDate: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                s.id ,
                us.name ,
                dcp.title AS packageName ,
                dcp.classMins AS packageClassMins ,
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

routerAdd("POST", "/api/t/classLogs/day", (c) => {
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
        classNote: ''
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

routerAdd("POST", "/api/t/classLogs/month", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { utcOffset, year, month, studentId } = c.requestInfo().body

    // utcOffset pattern check
    const utcOffsetRegex = new RegExp('^[+-](0[0-9]|1[0-4]):[0-5][0-9]$');
    if (!utcOffsetRegex.test(utcOffset)) throw ForbiddenError()

    // check year and month
    if(Number(year) <= 2000 || Number(month) < 0 || Number(month) > 11) throw ForbiddenError()

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
        teachersPrice: '',
        classMins: '',
        classNote: ''
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