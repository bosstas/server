var express = require('express')
var router = express.Router()
var bp = require('body-parser')

var database = require('../database')
var textbase = require('../textbase')

var urlencludedParser = bp.urlencoded({ extended: false })

router.get('/login', function (req, res) {
  res.render('login')
})
router.get('/register', function (req, res) {
  return res.render('register')
})
router.get('/welcome', function (req, res) {
  //  TODO: Aici trebuie să verifici dacă utilizatorul nu are mesaje deja
  // salvate în baza de date, și dacă sunt -> să le afișezi pe pagină.
  // Pentru început, încearcă să afișezi toate mesajele din baza de date.
  return textbase
    .getText()
    .then(texts => res.render('welcome', { texts: texts }))
    .catch(error => res.render('welcome', { erros: [error] }))
})
router.post('/register', urlencludedParser, function (req, res) {
  const { name, email, password, password2 } = req.body
  const errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ mgs: 'Va rugam,introduceti toate datele!' })
  }
  if (password !== password2) {
    errors.push({ mgs: 'Parolele introduse nu coincid!' })
  }
  if (password.length < 6 || password2 < 6) {
    errors.push({
      mgs: 'Parola introdusa trebuie sa aiba cel putin de 6 caractere!'
    })
  }
  if (errors.length === 0) {
    database
      .getUsers()
      .then(function (users) {
        if (
          users.filter(function (user) {
            return user.name === name || user.email === email
          }).length
        ) {
          errors.push({ msg: 'Utilizatorul deja exista' })

          return res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          })
        }

        users.push({
          name: name,
          email: email,
          password: password
        })

        database
          .setUsers(users)
          .then(function () {
            // TODO: Aici nu trebuie să faci render,
            // ci trebuie să redirecționezi la ruta / welcome

            res.redirect('/users/welcome')
          })
          .catch(function (err) {
            errors.push({ msg: err.message })

            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            })
          })
      })
      .catch(function (err) {
        errors.push({ msg: err.message })

        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        })
      })
  } else {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  }
})

router.post('/login', urlencludedParser, function (req, res) {
  var { email, password } = req.body
  const errors = []
  if (!email || !password) {
    errors.push({ msg: 'Logati-va!' })
  }
  if (errors.length > 0) {
    res.render('login', {
      errors,
      email,
      password
    })
  } else {
    database
      .getUsers()
      .then(function (users) {
        var filteredUsers = users.filter(function (user) {
          return user.email === email && user.password === password
        })
        if (filteredUsers.length) {
          res.redirect('/users/welcome')
        } else {
          errors.push({ msg: 'Nu sunt corecte datele de acces' })

          res.render('login', {
            errors,
            email,
            password
          })
        }
      })
      .catch(function (err) {
        errors.push({ msg: err.message })

        res.render('login', {
          errors,
          email,
          password
        })
      })
  }
})
router.post('/welcome', urlencludedParser, function (req, res) {
  var text = req.body
  const errors = []
  if (!text) {
    errors.push({ msg: 'Nu ati introdus textul!' })
  } else {
    // BUG: Linia asta nu face sens
    /* 1. Express.js nu oferă așa funcție și nici tu nu ai declarat-o.
           2. De ce textbase e argument la funcția asta???
           3. Nu uita natura ASYNC a limbajului. Toate aceste declarații
           vor fi executate concomitent, fără a aștepta răspunsul. */
    textbase
      .setText(text)
      .then(function (texts) {
        return res.render('welcome', { texts: texts })
      })
      .catch(function (err) {
        errors.push({ msg: err.message })

        res.render('welcome', {
          errors,
          text: [text]
        })
      })
  }
})
module.exports = router
