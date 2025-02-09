/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2219109808")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3710560992",
    "hidden": false,
    "id": "relation1561754349",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "dailyClassPackageId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number2515961821",
    "max": null,
    "min": null,
    "name": "dailyClassTeachersPrice",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1279148573",
    "max": null,
    "min": null,
    "name": "dailyClassStudentsPrice",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2219109808")

  // remove field
  collection.fields.removeById("relation1561754349")

  // remove field
  collection.fields.removeById("number2515961821")

  // remove field
  collection.fields.removeById("number1279148573")

  return app.save(collection)
})
