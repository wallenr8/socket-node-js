// Import required Node.js modules
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http) // Attach Socket.io to the HTTP server

// Serve static files (like index.html) from the root directory
app.use(express.static(__dirname))

// Middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// In-memory array storing initial sample messages
var messages = [
    {name: 'Alexa:', message: 'Say something in the text box'},
    {name: 'Alexa:', message: 'Dont be Shy'}
]

// GET Endpoint: Returns all stored messages as JSON
app.get('/messages', (req, res) => {
    res.send(messages)
})

// POST Endpoint: Accepts a new message from the client
app.post('/messages', (req, res) => {
    // Add the new message to the array
    messages.push(req.body)
    // Broadcast the message to all connected Socket.io clients in real time
    io.emit('message', req.body)
    // Respond with HTTP 200 OK
    res.sendStatus(200)
})

// Event handler for new WebSockets client connections
io.on('connection', (socket) => {
    console.log('a user connected')
})

// Start the server and listen on port 3000 (updated from 6000 to match client request URL)
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})