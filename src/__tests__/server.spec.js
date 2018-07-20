//var assert = require('assert')
import assert from 'assert'
import request from 'superfast'
import appHttpServer from '../server'

describe('Test - Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal(-1, [1, 2, 3].indexOf(4))
    })
  })
})
