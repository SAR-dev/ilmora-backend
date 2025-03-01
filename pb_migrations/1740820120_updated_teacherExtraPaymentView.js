/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2957713007")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY t.id)) AS id,\n\tt.id AS teacherId ,\n    u.id AS userId ,\n    FALSE AS messageSent,\n\tu.name ,\n    tb.teacherInvoiceId ,\n    tb.id AS teacherBalanceId,\n    0 AS totalTeachersPrice,\n    tb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\ttb.paymentInfo ,\n\ttb.paymentMethod ,\n    '' AS invoicedAt,\n  \ttb.created AS createdAt,\n\ttb.created AS paidAt\nFROM teachers t \nJOIN users u ON t.userId = u.id \nJOIN teacherBalances tb ON tb.teacherId = t.id\nWHERE COALESCE(tb.teacherInvoiceId, '') = ''"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_2Ri1")

  // remove field
  collection.fields.removeById("_clone_n7G2")

  // remove field
  collection.fields.removeById("_clone_QU6q")

  // remove field
  collection.fields.removeById("_clone_32dS")

  // remove field
  collection.fields.removeById("_clone_Zb77")

  // remove field
  collection.fields.removeById("_clone_BRLH")

  // remove field
  collection.fields.removeById("_clone_Ntwh")

  // remove field
  collection.fields.removeById("_clone_z6mb")

  // remove field
  collection.fields.removeById("_clone_2X94")

  // remove field
  collection.fields.removeById("_clone_ohTx")

  // remove field
  collection.fields.removeById("_clone_fAHt")

  // remove field
  collection.fields.removeById("_clone_Ma9j")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json2124945025",
    "maxSize": 1,
    "name": "messageSent",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_u3ZD",
    "max": 255,
    "min": 2,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1151323245",
    "hidden": false,
    "id": "_clone_oRVW",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "teacherInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_VJjj",
    "max": null,
    "min": null,
    "name": "paidAmount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_gzb5",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "avatar",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_NxKS",
    "max": 20,
    "min": 5,
    "name": "whatsAppNo",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_iyQ8",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": true,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_yYmd",
    "max": 0,
    "min": 0,
    "name": "location",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_J33r",
    "max": 0,
    "min": 0,
    "name": "utcOffset",
    "pattern": "^[+-](0[0-9]|1[0-4]):[0-5][0-9]$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_syXR",
    "max": 0,
    "min": 0,
    "name": "paymentInfo",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_z1hW",
    "max": 0,
    "min": 0,
    "name": "paymentMethod",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "_clone_aE8B",
    "name": "createdAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "_clone_ZN6H",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2957713007")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY t.id)) AS id,\n\tt.id AS teacherId ,\n    u.id AS userId ,\n\tu.name ,\n    tb.teacherInvoiceId ,\n    tb.id AS teacherBalanceId,\n    0 AS totalTeachersPrice,\n    tb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\ttb.paymentInfo ,\n\ttb.paymentMethod ,\n    '' AS invoicedAt,\n  \ttb.created AS createdAt,\n\ttb.created AS paidAt\nFROM teachers t \nJOIN users u ON t.userId = u.id \nJOIN teacherBalances tb ON tb.teacherId = t.id\nWHERE COALESCE(tb.teacherInvoiceId, '') = ''"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_2Ri1",
    "max": 255,
    "min": 2,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1151323245",
    "hidden": false,
    "id": "_clone_n7G2",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "teacherInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "_clone_QU6q",
    "max": null,
    "min": null,
    "name": "paidAmount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_32dS",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "avatar",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Zb77",
    "max": 20,
    "min": 5,
    "name": "whatsAppNo",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_BRLH",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": true,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Ntwh",
    "max": 0,
    "min": 0,
    "name": "location",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_z6mb",
    "max": 0,
    "min": 0,
    "name": "utcOffset",
    "pattern": "^[+-](0[0-9]|1[0-4]):[0-5][0-9]$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_2X94",
    "max": 0,
    "min": 0,
    "name": "paymentInfo",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_ohTx",
    "max": 0,
    "min": 0,
    "name": "paymentMethod",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "_clone_fAHt",
    "name": "createdAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "_clone_Ma9j",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("json2124945025")

  // remove field
  collection.fields.removeById("_clone_u3ZD")

  // remove field
  collection.fields.removeById("_clone_oRVW")

  // remove field
  collection.fields.removeById("_clone_VJjj")

  // remove field
  collection.fields.removeById("_clone_gzb5")

  // remove field
  collection.fields.removeById("_clone_NxKS")

  // remove field
  collection.fields.removeById("_clone_iyQ8")

  // remove field
  collection.fields.removeById("_clone_yYmd")

  // remove field
  collection.fields.removeById("_clone_J33r")

  // remove field
  collection.fields.removeById("_clone_syXR")

  // remove field
  collection.fields.removeById("_clone_z1hW")

  // remove field
  collection.fields.removeById("_clone_aE8B")

  // remove field
  collection.fields.removeById("_clone_ZN6H")

  return app.save(collection)
})
