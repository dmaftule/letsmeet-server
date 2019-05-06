/**
 Copyright Daniela Maftuleac 2019.
 */

let express = require('express');
let app = express();
let expressWs = require('express-ws')(app);
let fs = require('fs')
let IntervalTree = require('./IntervalTree.js');
let Node = require('./Node.js');
let Algo = require('./IntervalUtils.js');

/**
 * The set of connected WebSockets.
 */
let clients = new Set();

/**
 * The array storing the common overlapping time slots
 * of all users.
 */
let solution = [];

/**
 * The map binding user names to their available time slots
 * information (day index, slot index).
 */
let data = {};

/**
 * Starts the server.
 */
let server = app.listen(9123, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`app listening at http://${host}:${port}`);
    solution = [];
});

/**
 * Configures the WebSocket endpoints.
 */
app.ws('/', function (ws, req) {
    // A new client has connected. Remember it for later.
    clients.add(ws);

    // Send the current optimal solution to the client.
    ws.send(JSON.stringify(solution));

    // Callback invoked when messages are received from the client.
    ws.on('message', function (msg) {
        // Parse the message as a JSON object.
        let json = JSON.parse(msg);
        console.log(json);

        // when button Reset Everything on Server was pressed,
        // data and solution array should be cleared.
        if (json.hasOwnProperty("reset")) {
            solution = [];
            data = {};
            // Check if we have seen the user name before
        } else if (data[json.user] === undefined) {
            // We have discovered a new user, add him or her.
            data[json.user] = [];
        }
        // The user has selected a time slot.
        // Stored the selected time slot, recompute the solution,
        // and notify all clients of the new solution.
        if (json.type === "selected") {
            data[json.user].push({day: json.day, slot: json.slot});
            computeSolution();
            sendAll(solution);

            // The user has unselected a time slot.
            // Store the selected time slot, recompute the solution,
            // and notify all clients of the new solution.
        } else if (json.type === "unselected") {
            data[json.user] = data[json.user].filter((s => {
                return (s.day !== json.day || s.slot !== json.slot);
            }));
            computeSolution();
            sendAll(solution);
        }
    });

    // The client has disconnected. Remove it from the set of active clients.
    ws.on('close', () => {
        console.log('WebSocket closed');
        clients.delete(ws);
    });
});

/**
 * Computes the solution containing the common overlapping time slots
 * for all participants.
 */
function computeSolution() {
    // The array to be returned storing the common overlapping time slots.
    let result = [];

    // The array of users' interval trees.
    let trees = [];

    // Using the selected time slots data received from clients,
    // construct for each user an interval tree containing the selected
    // time slots intervals.
    Object.keys(data).forEach((user) => {
        // Initialize and populate the interval tree for each user.
        let tree = new IntervalTree();

        data[user].forEach((timeslot) => {
            // Transform the index of the time slot of the day to
            // a time slot for the week.
            let globalSlot = timeslot.day * 24 + timeslot.slot;

            // Create a tree node containing the interval of length 1 (1 hour).
            let node = new Node(globalSlot, globalSlot);

            // Insert the constructed node in the interval tree of the user.
            tree.insert(node);
        });
        // Add all users' interval trees in the array `trees` which is later used
        // to compute a resulting interval tree containing the common overlapping intervals.
        trees.push(tree);
    });

    // Construct the interval tree containing all the common overlapping intervals.
    let treeSolution = Algo.findSolution(trees);

    // Using the constructed interval tree containing all common intervals,
    // construct the time slots data (day index and slot index) to be sent to all users.
    // For this, collect all the intervals from the resulting interval tree and find the
    // indices of the day and the slot. The array's elements are the low and high values
    // common overlapping intervals.
    let arrayIntervalsSolution = treeSolution.collectIntervals();
    for (let i = 0; i < arrayIntervalsSolution.length; i += 2) {
        result.push({
            day: Math.floor(arrayIntervalsSolution[i] / 24),
            slot: arrayIntervalsSolution[i] % 24
        });
    }

    // Update the array storing the common overlapping time slots of all users.
    solution = result;
}

/**
 * Sends the object `obj` to the WebSocket `client`.
 *
 * @param client The WebSocket to send to.
 * @param obj The object to be sent.
 */
function send(client, obj) {
    console.log("Sending message to client");
    client.send(JSON.stringify(obj));
}

/**
 * Sends the object `obj` to all connected WebSockets.
 *
 * @param obj The object to be sent.
 */
function sendAll(obj) {
    clients.forEach((client) => {
        send(client, obj);
    })
}

/**
 * Every 10 minutes, the common availability slots are deleted.
 * This is used for demonstration purposes.
 */
let timer = setInterval(() => {
    solution = [];
    clients = new Set();
}, 600000);

module.exports = app;
