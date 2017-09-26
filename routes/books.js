'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex')

// List of all books
router.get('/books', function(req, res, next) {
  knex('books')
  .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
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
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('id')
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
    .insert({ item: item }, 'id')
    .then((id) => {
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

// patch
router.patch('/books/:id', function(req, res, next) {
  const { item } = req.body
  const id = req.params.id

  knex('books')
    .update({ item: item })
    .where('id', id)
    .then((rowsAffected) => {
      if (rowsAffected !== 1) {
        return res.sendStatus(404)
      }
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
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

module.exports = router;
