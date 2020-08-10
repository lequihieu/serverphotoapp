const express = require('express')
const images = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash');
const Image = require('../models/Image')
const { result } = require('lodash')

images.use(cors())

process.env.SECRET_KEY = 'secret'

images.post('/add', (req, res) => {

    const user_id = req.body.user;

    const imageData = {
        name: req.body.name,
        thumb: req.body.thumb,
        regular: req.body.regular
    }
    console.log(imageData.full_url);

    Image.getIdImageByName(imageData.name, function(err, row) {
        if (err) res.json(err);
        const image_id = _.get(row[0], 'id', 0);
        //if image_id exist
        if(image_id) {
            
            Image.findImageUser(image_id, user_id, function(err, results) {
                if (err) res.json(err);
                
                //if duplicate data on table image_user
                if ((image_id === results[0].image_id) && (user_id === results[0].user_id)) 
                {   
                    res.json("Duplicate");
                } 
                else {
                // if not duplicate   
                    Image.addImageUser(image_id, user_id, function(err,row){
                        if (err) res.json(err);
                        res.json("Added")
                    });
                }
            })
            
        }
        //if image_id not exist
        else {
            Image.addImage(imageData, function(err, results) {
                if (err) res.json(err);
                const insertedId = results.insertId;

                Image.addImageUser(insertedId, user_id, function(err){
                    if (err) res.json(err);
                    res.json("Added");
                });
            })
        }
    })
     
})

images.get('/list', (req, res) => {

    const user_id = req.query.user;

    Image.getAllImageByUserId(user_id, function(err, rows) {
        if (err) res.json(err);
        res.json(rows);
    })
   
})


module.exports = images