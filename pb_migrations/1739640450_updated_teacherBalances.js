/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1863780343")

  // add field
  collection.fields.addAt(5, new Field({
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1863780343")

  // remove field
  collection.fields.removeById("relation2421991449")

  return app.save(collection)
})
