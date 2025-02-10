/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3503708074")

  // remove field
  collection.fields.removeById("file2359244304")

  // add field
  collection.fields.addAt(3, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "url917281265",
    "name": "link",
    "onlyDomains": [],
    "presentable": false,
    "required": true,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3503708074")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file2359244304",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // remove field
  collection.fields.removeById("url917281265")

  return app.save(collection)
})
