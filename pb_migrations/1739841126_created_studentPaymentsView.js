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
      },
      {
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
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "_clone_XzUX",
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "json157035315",
        "maxSize": 1,
        "name": "totalStudentsPrice",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "_clone_RS01",
        "name": "paidAt",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_2232997906",
    "indexes": [],
    "listRule": null,
    "name": "studentPaymentsView",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n\ts.id,\n\tu.name ,\n\tu.avatar ,\n\tu.email ,\n\tu.location ,\n\tu.utcOffset ,\n\tcl.studentInvoiceId ,\n\tsum(cl.studentsPrice) AS totalStudentsPrice,\n\tsb.paidAmount ,\n\tsb.paymentInfo ,\n\tsb.paymentMethod ,\n\tsb.created AS paidAt\nFROM students s \nJOIN users u ON s.userId = u.id \nJOIN classLogs cl ON cl.studentId = s.id \nJOIN studentInvoices si ON si.id = cl.studentInvoiceId \nLEFT JOIN studentBalances sb ON sb.studentInvoiceId = si.id AND sb.studentId = s.id\nGROUP BY s.id, cl.studentInvoiceId",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2232997906");

  return app.delete(collection);
})
