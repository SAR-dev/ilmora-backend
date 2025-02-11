/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_884676139")

  // update field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text555562339",
    "max": 0,
    "min": 0,
    "name": "utcOffset",
    "pattern": "^[+-](0[0-9]|1[0-4]):[0-5][0-9]$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_884676139")

  // update field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text555562339",
    "max": 0,
    "min": 0,
    "name": "utcOffset",
    "pattern": "/^[+-](0[0-9]|1[0-4]):[0-5][0-9]$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
