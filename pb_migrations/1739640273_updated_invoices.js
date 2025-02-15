/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1513968520")

  // update collection data
  unmarshal({
    "name": "studentInvoices"
  }, collection)

  // remove field
  collection.fields.removeById("select2324791398")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1513968520")

  // update collection data
  unmarshal({
    "name": "invoices"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select2324791398",
    "maxSelect": 1,
    "name": "userType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "TEACHER",
      "STUDENT"
    ]
  }))

  return app.save(collection)
})
