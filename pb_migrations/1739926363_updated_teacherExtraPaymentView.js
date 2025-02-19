/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2957713007")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY t.id)) AS id,\n\tt.id AS teacherId ,\n    u.id AS userId ,\n\tu.name ,\n    tb.teacherInvoiceId ,\n    tb.id AS teacherBalanceId,\n    0 AS totalTeachersPrice,\n    tb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\ttb.paymentInfo ,\n\ttb.paymentMethod ,\n    '' AS invoicedAt,\n  \ttb.created AS createdAt,\n\ttb.created AS paidAt\nFROM teachers t \nJOIN users u ON t.userId = u.id \nJOIN teacherBalances tb ON tb.teacherId = t.id\nWHERE COALESCE(tb.teacherInvoiceId, '') = ''"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_3LWq")

  // remove field
  collection.fields.removeById("_clone_UIeq")

  // remove field
  collection.fields.removeById("_clone_KzYa")

  // remove field
  collection.fields.removeById("_clone_k8R2")

  // remove field
  collection.fields.removeById("_clone_ZzwP")

  // remove field
  collection.fields.removeById("_clone_ohFQ")

  // remove field
  collection.fields.removeById("_clone_44QY")

  // remove field
  collection.fields.removeById("_clone_uQiT")

  // remove field
  collection.fields.removeById("_clone_MIan")

  // remove field
  collection.fields.removeById("_clone_n2PG")

  // remove field
  collection.fields.removeById("_clone_hv5s")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_y1EU",
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
    "id": "_clone_a1sy",
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
    "id": "_clone_O0OA",
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
    "id": "_clone_7S6l",
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
    "id": "_clone_g3ro",
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
    "id": "_clone_enLb",
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
    "id": "_clone_620L",
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
    "id": "_clone_Qi1U",
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
    "id": "_clone_wyL4",
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
    "id": "_clone_F5Yg",
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
    "id": "_clone_XVSR",
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
    "id": "_clone_ozfD",
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
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY t.id)) AS id,\n\tt.id AS teacherId ,\n    u.id AS userId ,\n\tu.name ,\n    tb.teacherInvoiceId ,\n    tb.id AS teacherBalanceId,\n    0 AS totalTeachersPrice,\n    tb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\ttb.paymentInfo ,\n\ttb.paymentMethod ,\n    '' AS invoicedAt,\n\ttb.created AS paidAt\nFROM teachers t \nJOIN users u ON t.userId = u.id \nJOIN teacherBalances tb ON tb.teacherId = t.id\nWHERE COALESCE(tb.teacherInvoiceId, '') = ''"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_3LWq",
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
    "id": "_clone_UIeq",
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
    "id": "_clone_KzYa",
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
    "id": "_clone_k8R2",
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
    "id": "_clone_ZzwP",
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
    "id": "_clone_ohFQ",
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
    "id": "_clone_44QY",
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
    "id": "_clone_uQiT",
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
    "id": "_clone_MIan",
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
    "id": "_clone_n2PG",
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
    "id": "_clone_hv5s",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_y1EU")

  // remove field
  collection.fields.removeById("_clone_a1sy")

  // remove field
  collection.fields.removeById("_clone_O0OA")

  // remove field
  collection.fields.removeById("_clone_7S6l")

  // remove field
  collection.fields.removeById("_clone_g3ro")

  // remove field
  collection.fields.removeById("_clone_enLb")

  // remove field
  collection.fields.removeById("_clone_620L")

  // remove field
  collection.fields.removeById("_clone_Qi1U")

  // remove field
  collection.fields.removeById("_clone_wyL4")

  // remove field
  collection.fields.removeById("_clone_F5Yg")

  // remove field
  collection.fields.removeById("_clone_XVSR")

  // remove field
  collection.fields.removeById("_clone_ozfD")

  return app.save(collection)
})
