/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2232997906")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY s.id)) AS id,\n\ts.id AS studentId ,\n    u.id AS userId ,\n\tu.name ,\n    si.id AS studentInvoiceId ,\n    sb.id AS studentBalanceId,\n    (COALESCE (SUM (cl.studentsPrice), 0)) AS totalStudentsPrice,\n    sb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n    si.created AS invoicedAt,\n    si.created AS createdAt,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN classLogs cl ON cl.studentId = s.id \nJOIN studentInvoices si ON si.id = cl.studentInvoiceId \nLEFT JOIN studentBalances sb ON sb.studentInvoiceId = si.id AND sb.studentId = s.id\nGROUP BY s.id, si.id, sb.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_LqCw")

  // remove field
  collection.fields.removeById("_clone_h7bw")

  // remove field
  collection.fields.removeById("_clone_r5cv")

  // remove field
  collection.fields.removeById("_clone_1fbm")

  // remove field
  collection.fields.removeById("_clone_VfmF")

  // remove field
  collection.fields.removeById("_clone_ZkuV")

  // remove field
  collection.fields.removeById("_clone_wHi9")

  // remove field
  collection.fields.removeById("_clone_pizS")

  // remove field
  collection.fields.removeById("_clone_OJgn")

  // remove field
  collection.fields.removeById("_clone_9mTm")

  // remove field
  collection.fields.removeById("_clone_ds09")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_VxKI",
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
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "_clone_ZIAn",
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
    "id": "_clone_dA8T",
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
    "id": "_clone_jWVJ",
    "max": 20,
    "min": 5,
    "name": "whatsAppNo",
    "pattern": "^\\+\\s?\\(\\d{1,4}\\)\\s?\\d+$",
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
    "id": "_clone_V5h4",
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
    "id": "_clone_5GIh",
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
    "id": "_clone_itw1",
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
    "id": "_clone_VrtM",
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
    "id": "_clone_fpDW",
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
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "_clone_z64s",
    "name": "invoicedAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": true,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "_clone_Ukuf",
    "name": "createdAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": true,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "_clone_sBT4",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2232997906")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY s.id)) AS id,\n\ts.id AS studentId ,\n    u.id AS userId ,\n\tu.name ,\n    si.id AS studentInvoiceId ,\n    sb.id AS studentBalanceId,\n    (COALESCE (SUM (cl.studentsPrice), 0)) AS totalStudentsPrice,\n    sb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n    si.created AS invoicedAt,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN classLogs cl ON cl.studentId = s.id \nJOIN studentInvoices si ON si.id = cl.studentInvoiceId \nLEFT JOIN studentBalances sb ON sb.studentInvoiceId = si.id AND sb.studentId = s.id\nGROUP BY s.id, si.id, sb.id"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_LqCw",
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
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "_clone_h7bw",
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
    "id": "_clone_r5cv",
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
    "id": "_clone_1fbm",
    "max": 20,
    "min": 5,
    "name": "whatsAppNo",
    "pattern": "^\\+\\s?\\(\\d{1,4}\\)\\s?\\d+$",
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
    "id": "_clone_VfmF",
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
    "id": "_clone_ZkuV",
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
    "id": "_clone_wHi9",
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
    "id": "_clone_pizS",
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
    "id": "_clone_OJgn",
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
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "_clone_9mTm",
    "name": "invoicedAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": true,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "_clone_ds09",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_VxKI")

  // remove field
  collection.fields.removeById("_clone_ZIAn")

  // remove field
  collection.fields.removeById("_clone_dA8T")

  // remove field
  collection.fields.removeById("_clone_jWVJ")

  // remove field
  collection.fields.removeById("_clone_V5h4")

  // remove field
  collection.fields.removeById("_clone_5GIh")

  // remove field
  collection.fields.removeById("_clone_itw1")

  // remove field
  collection.fields.removeById("_clone_VrtM")

  // remove field
  collection.fields.removeById("_clone_fpDW")

  // remove field
  collection.fields.removeById("_clone_z64s")

  // remove field
  collection.fields.removeById("_clone_Ukuf")

  // remove field
  collection.fields.removeById("_clone_sBT4")

  return app.save(collection)
})
