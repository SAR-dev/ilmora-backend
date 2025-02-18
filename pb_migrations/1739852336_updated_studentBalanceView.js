/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_825159563")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n\ts.id,\n\tu.name ,\n    sb.studentInvoiceId ,\n    sb.id AS studentBalanceId,\n    0 AS totalStudentsPrice,\n    sb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN studentBalances sb ON sb.studentId = s.id\nWHERE COALESCE(sb.studentInvoiceId, '') = ''"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_BgIE")

  // remove field
  collection.fields.removeById("json583096073")

  // remove field
  collection.fields.removeById("_clone_aUOP")

  // remove field
  collection.fields.removeById("_clone_VYtp")

  // remove field
  collection.fields.removeById("_clone_VHdV")

  // remove field
  collection.fields.removeById("_clone_K5eS")

  // remove field
  collection.fields.removeById("_clone_mLS3")

  // remove field
  collection.fields.removeById("_clone_Sid9")

  // remove field
  collection.fields.removeById("_clone_NW8t")

  // remove field
  collection.fields.removeById("_clone_uMqn")

  // remove field
  collection.fields.removeById("_clone_NAxV")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Ytww",
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
    "id": "_clone_gHV2",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "studentInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_7AUw",
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
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_O8EL",
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
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_V1IO",
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
  collection.fields.addAt(8, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_XTD2",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": true,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_yn4g",
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
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_zwrl",
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
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_PD9V",
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
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_DsUL",
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
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "_clone_vfhm",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_825159563")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n\ts.id,\n\tu.name ,\n    '' AS studentInvoiceId ,\n    sb.id AS studentBalanceId,\n    0 AS totalStudentsPrice,\n    sb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN studentBalances sb ON sb.studentId = s.id\nWHERE COALESCE(sb.studentInvoiceId, '') = ''"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_BgIE",
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
    "id": "json583096073",
    "maxSize": 1,
    "name": "studentInvoiceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_aUOP",
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
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_VYtp",
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
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_VHdV",
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
  collection.fields.addAt(8, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_K5eS",
    "name": "email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": true,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_mLS3",
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
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Sid9",
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
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_NW8t",
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
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_uMqn",
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
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "_clone_NAxV",
    "name": "paidAt",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_Ytww")

  // remove field
  collection.fields.removeById("_clone_gHV2")

  // remove field
  collection.fields.removeById("_clone_7AUw")

  // remove field
  collection.fields.removeById("_clone_O8EL")

  // remove field
  collection.fields.removeById("_clone_V1IO")

  // remove field
  collection.fields.removeById("_clone_XTD2")

  // remove field
  collection.fields.removeById("_clone_yn4g")

  // remove field
  collection.fields.removeById("_clone_zwrl")

  // remove field
  collection.fields.removeById("_clone_PD9V")

  // remove field
  collection.fields.removeById("_clone_DsUL")

  // remove field
  collection.fields.removeById("_clone_vfhm")

  return app.save(collection)
})
