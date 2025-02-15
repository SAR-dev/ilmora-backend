/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_259321596")

  // remove field
  collection.fields.removeById("relation2421991449")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_259321596")

  // add field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1513968520",
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
