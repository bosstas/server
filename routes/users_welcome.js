var express = require('express')
var router = express.Router()
var bp = require('body-parser')

var textbase = require('../textbase')

var urlencludedParser = bp.urlencoded({ extended: false })
router.post('/welcome', urlencludedParser, function (req, res) {
  var text = req.body
  const errors = []
  if (!text) {
    errors.push({ msg: 'Nu ati introdus textul!' })
  }
  if (errors.length === 0) {
    res.render('welcome', {
      errors,
      text
    })
  } else {
    textbase
      .getText()
      .then(function (texts) {
        texts.push({
          text: text
        })
        textbase
          .setText(texts)
          .then(function () {
            res.render('welcome', { text: req.body })
          })
          .catch(function (err) {
            errors.push({ msg: err.message })

            res.render('welcome', {
              errors,
              text
            })
          })
      })
      .catch(function (err) {
        errors.push({ msg: err.message })

        res.render('welcome', {
          errors,
          text
        })
      })
  }
})

module.exports = router
