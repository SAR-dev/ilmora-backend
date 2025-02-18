/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2907260911",
        "hidden": false,
        "id": "relation3913794691",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "teacherId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation1689669068",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "userId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_gRXx",
        "max": 255,
        "min": 2,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1151323245",
        "hidden": false,
        "id": "relation2421991449",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "teacherInvoiceId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1863780343",
        "hidden": false,
        "id": "relation2158844552",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "teacherBalanceId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "json3499421427",
        "maxSize": 1,
        "name": "totalTeachersPrice",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "_clone_wqHq",
        "max": null,
        "min": null,
        "name": "paidAmount",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "_clone_NkbP",
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
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_P0tD",
        "max": 20,
        "min": 5,
        "name": "whatsAppNo",
        "pattern": "^\\+\\s?\\(\\d{1,4}\\)\\s?\\d+$",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "_clone_35KM",
        "name": "email",
        "onlyDomains": null,
        "presentable": false,
        "required": true,
        "system": true,
        "type": "email"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_dgDI",
        "max": 0,
        "min": 0,
        "name": "location",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_02lA",
        "max": 0,
        "min": 0,
        "name": "utcOffset",
        "pattern": "^[+-](0[0-9]|1[0-4]):[0-5][0-9]$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_rljl",
        "max": 0,
        "min": 0,
        "name": "paymentInfo",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_ID7a",
        "max": 0,
        "min": 0,
        "name": "paymentMethod",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "_clone_FaK2",
        "name": "paidAt",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_4037334995",
    "indexes": [],
    "listRule": null,
    "name": "teacherInvoicePaymentView",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER (ORDER BY t.id)) AS id,\n\tt.id AS teacherId ,\n    u.id AS userId ,\n\tu.name ,\n    ti.id AS teacherInvoiceId ,\n    tb.id AS teacherBalanceId,\n    (sum(cl.teachersPrice)) AS totalTeachersPrice,\n    tb.paidAmount ,\n\tu.avatar ,\n\tu.whatsAppNo,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\ttb.paymentInfo ,\n\ttb.paymentMethod ,\n\ttb.created AS paidAt\nFROM teachers t \nJOIN users u ON t.userId = u.id \nJOIN classLogs cl ON cl.`teacherId` = t.id \nJOIN `teacherInvoices` ti ON ti.id = cl.`teacherInvoiceId` \nLEFT JOIN `teacherBalances` tb ON tb.`teacherInvoiceId` = ti.id AND tb.`teacherId` = t.id\nGROUP BY t.id, ti.id, tb.id",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4037334995");

  return app.delete(collection);
})
