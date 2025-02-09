/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_2219109808",
        "hidden": false,
        "id": "relation1349964097",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "teacherStudentRelId",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text555562339",
        "max": 0,
        "min": 0,
        "name": "utcOffset",
        "pattern": "^[+-](0[0-9]|1[0-4]):[0-5][0-9]$",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1643407199",
        "max": 0,
        "min": 0,
        "name": "satTime",
        "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3954109969",
        "max": 0,
        "min": 0,
        "name": "sunTIme",
        "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1179610783",
        "max": 0,
        "min": 0,
        "name": "monTime",
        "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1637132142",
        "max": 0,
        "min": 0,
        "name": "tueTime",
        "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1858770648",
        "max": 0,
        "min": 0,
        "name": "wedTime",
        "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3191611817",
        "max": 0,
        "min": 0,
        "name": "thuTime",
        "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1226897200",
        "max": 0,
        "min": 0,
        "name": "friTime",
        "pattern": "^([01][0-9]|2[0-3]):([0-5][0-9])$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_884676139",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_7zBOROj8uP` ON `routines` (`teacherStudentRelId`)"
    ],
    "listRule": null,
    "name": "routines",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_884676139");

  return app.delete(collection);
})
