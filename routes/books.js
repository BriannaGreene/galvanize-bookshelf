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
  const { item } = req.body

  knex('books')
    .insert({
      id: 9,
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    })
    .then(() => {
      res.setHeader('Content-Type', 'application/json')
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

// patch
router.patch('/books/:id', function(req, res, next) {
  const { item } = req.body
  const id = req.params.id

  knex('books')
    .update({title: req.body.title, author: req.body.author, genre: req.body.genre, description: req.body.description, cover_url: req.body.coverUrl })
    .where('id', id)
    .then((rowsAffected) => {
      if (rowsAffected !== 1) {
        return res.sendStatus(404)
      }
      res.setHeader('Content-Type', 'application/json')
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

// Delete
router.delete('/books/:id', function(req, res, next) {
  const id = req.params.id

  knex('books')
    .del()
    .where('id', id)
    .then((rowsAffected) => {
      if (rowsAffected !== 1) {
        return res.sendStatus(404)
      }
      res.setHeader('Content-Type', 'application/json')
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

module.exports = router;
