/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4286520888")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2324791398",
    "maxSelect": 1,
    "name": "userType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "STUDENT",
      "TEACHER",
      "ADMIN"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4286520888")

  // remove field
  collection.fields.removeById("select2324791398")

  return app.save(collection)
})
