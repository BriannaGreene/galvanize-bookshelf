'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex')
let jwt = require('jsonwebtoken')
let cp = require('cookie-parser')
let bcrypt = require('bcrypt')

router.use(cp())

router.get('/favorites', function(req, res, next) {
  if (!req.cookies.token) {
    return res.sendStatus(401)
  }

  knex('favorites as f')
    .join('books as b', function() {
      this.on('b.id', 'f.book_id')
    })
    .select('b.id', 'b.author', 'f.user_id', 'f.book_id', 'b.cover_url', 'b.created_at', 'b.description', 'b.genre', 'b.title', 'b.updated_at')
    .then((items) => {
      let infoObj = [{
        id: items[0].id,
        bookId: items[0].book_id,
        userId: items[0].user_id,
        createdAt: items[0].created_at,
        updatedAt: items[0].updated_at,
        title: items[0].title,
        author: items[0].author,
        genre: items[0].genre,
        description: items[0].description,
        coverUrl: items[0].cover_url
      }]
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      return res.send(infoObj)
    })
})

router.get('/favorites/check?', function(req, res, next) {
  if (!req.cookies.token) {
    return res.sendStatus(401)
  }

  let reqId = req.query.bookId

  knex('favorites')
    .select('book_id')
    .then((data) => {
      if (data[0].book_id == reqId) {
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        return res.send(true)
      }
      else {
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        return res.send(false)
      }
    })
})

router.post('/favorites', function(req, res, next) {
  let reqBody = req.body

  if (!req.cookies.token) {
    return res.sendStatus(401)
  }
  else {
    var token = req.cookies.token
    var decoded = jwt.verify(token, 'cookiez?');
  }

  knex('favorites')
    .insert({'user_id': decoded.userId, 'book_id': reqBody.bookId}, '*')
    .then((items) => {
      let newFav = {
        id: items[0].id,
        bookId: items[0].book_id,
        userId: items[0].user_id
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(newFav)
    })
})

router.delete('/favorites', function(req, res, next) {
  if (!req.cookies.token) {
    return res.sendStatus(401)
  }

  let id = req.body.bookId
  knex('favorites')
    .where('id', id)
    .del()
    .returning('*')
    .then((fav) => {
      if (fav == undefined) {
        return res.status(404)
      }
      const newObj = {
        bookId: fav[0].book_id,
        userId: fav[0].user_id
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(newObj)
    })
    .catch((err) => next(err))
})

module.exports = router;
