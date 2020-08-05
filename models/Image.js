var db = require('../database/mysqlDB');

var Image = {
  getAllImageByUserId:function(user_id, callback) {
    return db.query("SELECT * FROM images WHERE images.id IN (SELECT image_id FROM image_user WHERE user_id=?)", [user_id], callback);
  },
  getImageByName:function(name, callback) {
    return db.query("SELECT * FROM images WHERE name=?", [name], callback)
  },
  addImage:function(image, callback) {
    return db.query("INSERT INTO images(url, name) VALUES(?, ?)", [image.url, image.name], callback)
  },
  getIdImageByName:function(name, callback) {
    return db.query("SELECT images.id FROM images WHERE name=?", [name], callback)
  },
  addImageUser:function(image_id, user_id, callback) {
    return db.query("INSERT INTO image_user(image_id, user_id) VALUE(?, ?)", [image_id, user_id], callback)
  },
  findImageUser:function(image_id, user_id, callback) {
    return db.query("SELECT * FROM image_user WHERE image_id=? AND user_id=?", [image_id, user_id], callback)
  }
}
module.exports = Image;