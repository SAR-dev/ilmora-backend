/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2232997906")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n\ts.id,\n\tu.name ,\n    u.whatsAppNo,\n    cl.studentInvoiceId ,\n\tu.avatar ,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tsum(cl.studentsPrice) AS totalStudentsPrice,\n\tsb.paidAmount ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN classLogs cl ON cl.studentId = s.id \nJOIN studentInvoices si ON si.id = cl.studentInvoiceId \nLEFT JOIN studentBalances sb ON sb.studentInvoiceId = si.id AND sb.studentId = s.id\nGROUP BY s.id, cl.studentInvoiceId"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_aIrq")

  // remove field
  collection.fields.removeById("_clone_7zHv")

  // remove field
  collection.fields.removeById("_clone_XzUX")

  // remove field
  collection.fields.removeById("_clone_T4Ml")

  // remove field
  collection.fields.removeById("_clone_xjxC")

  // remove field
  collection.fields.removeById("_clone_FesJ")

  // remove field
  collection.fields.removeById("_clone_UDb4")

  // remove field
  collection.fields.removeById("_clone_NJqP")

  // remove field
  collection.fields.removeById("_clone_ChX1")

  // remove field
  collection.fields.removeById("_clone_RS01")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_fAz4",
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
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_hyu3",
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
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1513968520",
    "hidden": false,
    "id": "_clone_je8v",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "studentInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_0eUs",
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
  collection.fields.addAt(5, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_sQD3",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": true,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_nkQM",
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
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_X6LE",
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
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_18fd",
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
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_gEdE",
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
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_OSn7",
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
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_b4Dg",
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
    "viewQuery": "SELECT \n\ts.id,\n\tu.name ,\n\tu.avatar ,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tcl.studentInvoiceId ,\n\tsum(cl.studentsPrice) AS totalStudentsPrice,\n\tsb.paidAmount ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN classLogs cl ON cl.studentId = s.id \nJOIN studentInvoices si ON si.id = cl.studentInvoiceId \nLEFT JOIN studentBalances sb ON sb.studentInvoiceId = si.id AND sb.studentId = s.id\nGROUP BY s.id, cl.studentInvoiceId"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_aIrq",
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
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_7zHv",
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
  collection.fields.addAt(3, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_XzUX",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": true,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_T4Ml",
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
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_xjxC",
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
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1513968520",
    "hidden": false,
    "id": "_clone_FesJ",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "studentInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_UDb4",
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
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_NJqP",
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
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_ChX1",
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
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_RS01",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_fAz4")

  // remove field
  collection.fields.removeById("_clone_hyu3")

  // remove field
  collection.fields.removeById("_clone_je8v")

  // remove field
  collection.fields.removeById("_clone_0eUs")

  // remove field
  collection.fields.removeById("_clone_sQD3")

  // remove field
  collection.fields.removeById("_clone_nkQM")

  // remove field
  collection.fields.removeById("_clone_X6LE")

  // remove field
  collection.fields.removeById("_clone_18fd")

  // remove field
  collection.fields.removeById("_clone_gEdE")

  // remove field
  collection.fields.removeById("_clone_OSn7")

  // remove field
  collection.fields.removeById("_clone_b4Dg")

  return app.save(collection)
})
