/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2219109808")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2515961821",
    "max": null,
    "min": null,
    "name": "dailyClassTeachersPrice",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number1279148573",
    "max": null,
    "min": null,
    "name": "dailyClassStudentsPrice",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2219109808")

  // update field
  collection.fields.addAt(5, new Field({
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

  // update field
  collection.fields.addAt(6, new Field({
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
})
