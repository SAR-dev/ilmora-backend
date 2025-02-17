/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1151323245")

  // remove field
  collection.fields.removeById("date1269603864")

  // remove field
  collection.fields.removeById("date826688707")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1151323245")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "date1269603864",
    "max": "",
    "min": "",
    "name": "startDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(2, new Field({
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
})
