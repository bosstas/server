var express = require('express')
var el = require('express-ejs-layouts')
var app = express()

app.use(express.urlencoded({ extended: false }))
app.get(el)
app.set('view engine', 'ejs')

app.use('/public', express.static('public'))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(3000)
