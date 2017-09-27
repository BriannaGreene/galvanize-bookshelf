'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex')

// List of all books
router.get('/books', function(req, res, next) {
  knex('books')
  .select('id', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt')
  .orderBy('title')
  .then((items) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(items))
  })
  .catch((err) => next(err))
})

// select book by id
router.get('/books/:id', function(req, res, next) {
  const id = req.params.id

  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt')
    .where('id', id)
    .then((items) => {
      if (items.length < 1) {
        return res.sendStatus(404)
      }
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(items[0]))
    })
    .catch((err) => next(err))
})

// post a new books
router.post('/books', function(req, res, next) {

  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }, '*')
    .then((books) => {
      const newObj = {
        id: books[0].id,
        title: books[0].title,
        author: books[0].author,
        genre: books[0].genre,
        description: books[0].description,
        coverUrl: books[0].cover_url
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(newObj)

    })
    .catch((err) => next(err))
})

// patch
router.patch('/books/:id', function(req, res, next) {
  // const { item } = req.body
  const id = req.params.id
  // const title = req.body.title

  knex('books')
    .where('id', id )
    .returning('*')
    .update({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }, '*')
    .then((books) => {
      if (books == undefined) {
        return res.sendStatus(404)
      }
      const newObj = {
        id: books[0].id,
        title: books[0].title,
        author: books[0].author,
        genre: books[0].genre,
        description: books[0].description,
        coverUrl: books[0].cover_url
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(newObj)
    })
    .catch((err) => next(err))
})

// Delete
router.delete('/books/:id', function(req, res, next) {
  const id = req.params.id

  knex('books')
    .where('id', id)
    .del()
    .returning('*')
    .then((books) => {
      if (books == undefined) {
        return res.status(404)
      }
      const newObj = {
        title: books[0].title,
        author: books[0].author,
        genre: books[0].genre,
        description: books[0].description,
        coverUrl: books[0].cover_url
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(newObj)
    })
    .catch((err) => next(err))
})

module.exports = router;
