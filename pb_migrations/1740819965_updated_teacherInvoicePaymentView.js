/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4037334995")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY t.id)) AS id,\n\tt.id AS teacherId ,\n    u.id AS userId ,\n    (tim.id IS NOT NULL) AS messageSent,\n\tu.name ,\n    ti.id AS teacherInvoiceId ,\n    tb.id AS teacherBalanceId,\n    (COALESCE (SUM (cl.teachersPrice), 0)) AS totalTeachersPrice,\n    tb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\ttb.paymentInfo ,\n\ttb.paymentMethod ,\n    ti.created AS invoicedAt,\n    ti.created AS createdAt,\n\ttb.created AS paidAt\nFROM teachers t \nJOIN users u ON t.userId = u.id \nJOIN classLogs cl ON cl.teacherId = t.id \nJOIN teacherInvoices ti ON ti.id = cl.teacherInvoiceId \nLEFT JOIN teacherBalances tb ON tb.teacherInvoiceId = ti.id AND tb.teacherId = t.id\nLEFT JOIN teacherInvoiceMsg tim ON tim.teacherInvoiceId = ti.id AND tim.teacherId = t.id \nGROUP BY t.id, ti.id, tb.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_kUNt")

  // remove field
  collection.fields.removeById("_clone_093L")

  // remove field
  collection.fields.removeById("_clone_Ki9t")

  // remove field
  collection.fields.removeById("_clone_XPya")

  // remove field
  collection.fields.removeById("_clone_bbmZ")

  // remove field
  collection.fields.removeById("_clone_x8Xa")

  // remove field
  collection.fields.removeById("_clone_DQkC")

  // remove field
  collection.fields.removeById("_clone_trMh")

  // remove field
  collection.fields.removeById("_clone_il2b")

  // remove field
  collection.fields.removeById("_clone_ZayN")

  // remove field
  collection.fields.removeById("_clone_02OK")

  // remove field
  collection.fields.removeById("_clone_vVLK")

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
    "id": "_clone_rvSW",
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
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_dkoq",
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
    "id": "_clone_d38K",
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
    "id": "_clone_rj4t",
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
    "id": "_clone_sEGA",
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
    "id": "_clone_yHNd",
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
    "id": "_clone_px95",
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
    "id": "_clone_SpFh",
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
    "id": "_clone_bNmC",
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
    "id": "_clone_01Hw",
    "name": "invoicedAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "_clone_HOAp",
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
    "id": "_clone_KZ2j",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4037334995")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY t.id)) AS id,\n\tt.id AS teacherId ,\n    u.id AS userId ,\n\tu.name ,\n    ti.id AS teacherInvoiceId ,\n    tb.id AS teacherBalanceId,\n    (COALESCE (SUM (cl.teachersPrice), 0)) AS totalTeachersPrice,\n    tb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\ttb.paymentInfo ,\n\ttb.paymentMethod ,\n    ti.created AS invoicedAt,\n    ti.created AS createdAt,\n\ttb.created AS paidAt\nFROM teachers t \nJOIN users u ON t.userId = u.id \nJOIN classLogs cl ON cl.teacherId = t.id \nJOIN teacherInvoices ti ON ti.id = cl.teacherInvoiceId \nLEFT JOIN teacherBalances tb ON tb.teacherInvoiceId = ti.id AND tb.teacherId = t.id\nGROUP BY t.id, ti.id, tb.id"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_kUNt",
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
    "id": "_clone_093L",
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
    "id": "_clone_Ki9t",
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
    "id": "_clone_XPya",
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
    "id": "_clone_bbmZ",
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
    "id": "_clone_x8Xa",
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
    "id": "_clone_DQkC",
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
    "id": "_clone_trMh",
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
    "id": "_clone_il2b",
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
    "id": "_clone_ZayN",
    "name": "invoicedAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "_clone_02OK",
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
    "id": "_clone_vVLK",
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
  collection.fields.removeById("_clone_rvSW")

  // remove field
  collection.fields.removeById("_clone_dkoq")

  // remove field
  collection.fields.removeById("_clone_d38K")

  // remove field
  collection.fields.removeById("_clone_rj4t")

  // remove field
  collection.fields.removeById("_clone_sEGA")

  // remove field
  collection.fields.removeById("_clone_yHNd")

  // remove field
  collection.fields.removeById("_clone_px95")

  // remove field
  collection.fields.removeById("_clone_SpFh")

  // remove field
  collection.fields.removeById("_clone_bNmC")

  // remove field
  collection.fields.removeById("_clone_01Hw")

  // remove field
  collection.fields.removeById("_clone_HOAp")

  // remove field
  collection.fields.removeById("_clone_KZ2j")

  return app.save(collection)
})
