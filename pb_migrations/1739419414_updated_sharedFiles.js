/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3503708074")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_dP7LjZKyh0` ON `resources` (`title`)"
    ],
    "name": "resources"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3503708074")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_dP7LjZKyh0` ON `sharedFiles` (`title`)"
    ],
    "name": "sharedFiles"
  }, collection)

  return app.save(collection)
})
