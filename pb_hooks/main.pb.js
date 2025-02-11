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