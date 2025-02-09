/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3710560992")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number714634445",
    "max": null,
    "min": null,
    "name": "teachersPrice",
    "onlyInt": true,
    "presentable": true,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number4082151693",
    "max": null,
    "min": null,
    "name": "studentsPrice",
    "onlyInt": true,
    "presentable": true,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3710560992")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number714634445",
    "max": null,
    "min": null,
    "name": "teachersPrice",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number4082151693",
    "max": null,
    "min": null,
    "name": "studentsPrice",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
