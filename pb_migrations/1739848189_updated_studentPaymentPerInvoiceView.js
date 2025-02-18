/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2232997906")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n\ts.id,\n\tu.name ,\n    si.id AS studentInvoiceId ,\n    sum(cl.studentsPrice) AS totalStudentsPrice,\n    sb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN classLogs cl ON cl.studentId = s.id \nJOIN studentInvoices si ON si.id = cl.studentInvoiceId \nLEFT JOIN studentBalances sb ON sb.studentInvoiceId = si.id AND sb.studentId = s.id\nGROUP BY s.id, si.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_Xeq9")

  // remove field
  collection.fields.removeById("_clone_0d4A")

  // remove field
  collection.fields.removeById("_clone_7yg3")

  // remove field
  collection.fields.removeById("_clone_zKPR")

  // remove field
  collection.fields.removeById("_clone_qbNL")

  // remove field
  collection.fields.removeById("_clone_JPEs")

  // remove field
  collection.fields.removeById("_clone_6Zxw")

  // remove field
  collection.fields.removeById("_clone_Is3Y")

  // remove field
  collection.fields.removeById("_clone_Hpng")

  // remove field
  collection.fields.removeById("_clone_5wfd")

  // remove field
  collection.fields.removeById("_clone_Xyn2")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_I3M9",
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

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_C81E",
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
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_vN1T",
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
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Vywt",
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
  collection.fields.addAt(7, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_tLq0",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": true,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_ieYP",
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
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_dvG6",
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
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_J1Xk",
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
    "id": "_clone_JF3g",
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
    "id": "_clone_4Yot",
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
    "viewQuery": "SELECT \n\ts.id,\n\tu.name ,\n    u.whatsAppNo,\n    cl.studentInvoiceId ,\n\tu.avatar ,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tsum(cl.studentsPrice) AS totalStudentsPrice,\n\tsb.paidAmount ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN classLogs cl ON cl.studentId = s.id \nJOIN studentInvoices si ON si.id = cl.studentInvoiceId \nLEFT JOIN studentBalances sb ON sb.studentInvoiceId = si.id AND sb.studentId = s.id\nGROUP BY s.id, cl.studentInvoiceId"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Xeq9",
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
    "id": "_clone_0d4A",
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
    "id": "_clone_7yg3",
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
    "id": "_clone_zKPR",
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
    "id": "_clone_qbNL",
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
    "id": "_clone_JPEs",
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
    "id": "_clone_6Zxw",
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
    "id": "_clone_Is3Y",
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
    "id": "_clone_Hpng",
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
    "id": "_clone_5wfd",
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
    "id": "_clone_Xyn2",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_I3M9")

  // remove field
  collection.fields.removeById("relation583096073")

  // remove field
  collection.fields.removeById("_clone_C81E")

  // remove field
  collection.fields.removeById("_clone_vN1T")

  // remove field
  collection.fields.removeById("_clone_Vywt")

  // remove field
  collection.fields.removeById("_clone_tLq0")

  // remove field
  collection.fields.removeById("_clone_ieYP")

  // remove field
  collection.fields.removeById("_clone_dvG6")

  // remove field
  collection.fields.removeById("_clone_J1Xk")

  // remove field
  collection.fields.removeById("_clone_JF3g")

  // remove field
  collection.fields.removeById("_clone_4Yot")

  return app.save(collection)
})
