/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1340292942")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_WzsRaJ4N1g` ON `studentBalances` (\n  `studentId`,\n  `studentInvoiceId`\n) WHERE `studentInvoiceId` IS NOT NULL AND `studentInvoiceId` <> ''"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1340292942")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_WzsRaJ4N1g` ON `studentBalances` (\n  `studentId`,\n  `studentInvoiceId`\n) WHERE `studentInvoiceId` IS NOT NULL"
    ]
  }, collection)

  return app.save(collection)
})
