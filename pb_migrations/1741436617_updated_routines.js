/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_884676139")

  // update field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3954109969",
    "max": 0,
    "min": 0,
    "name": "sunTime",
    "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_884676139")

  // update field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3954109969",
    "max": 0,
    "min": 0,
    "name": "sunTIme",
    "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
