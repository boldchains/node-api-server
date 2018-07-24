import assert from 'assert';
const request = require('supertest');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' })
});

describe('Test the root path', () => {
  test('It should response the GET method', () => {
    return request(app).get('/').expect(200)
  });
});
