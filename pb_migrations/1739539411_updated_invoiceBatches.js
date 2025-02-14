/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1513968520")

  // update collection data
  unmarshal({
    "name": "invoices"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1513968520")

  // update collection data
  unmarshal({
    "name": "invoiceBatches"
  }, collection)

  return app.save(collection)
})
