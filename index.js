// load up express
const express = require('express')
const app = express()

// configure the port number
const port = 8080

// just set up simple static routing
app.use('/', express.static(__dirname + '/public'))


// and start listening
app.listen(port, () => console.log('example app listening on port %s!', port))
