/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1513968520")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date826688707",
    "max": "",
    "min": "",
    "name": "endDate",
    "presentable": true,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1513968520")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date826688707",
    "max": "",
    "min": "",
    "name": "endDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
