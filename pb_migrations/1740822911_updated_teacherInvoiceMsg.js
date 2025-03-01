/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4201241413")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1151323245",
    "hidden": false,
    "id": "relation2421991449",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "teacherInvoiceId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4201241413")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1151323245",
    "hidden": false,
    "id": "relation2421991449",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "teacherInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
