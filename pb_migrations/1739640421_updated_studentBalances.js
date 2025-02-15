/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1340292942")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1513968520",
    "hidden": false,
    "id": "relation583096073",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "studentInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1340292942")

  // remove field
  collection.fields.removeById("relation583096073")

  return app.save(collection)
})
