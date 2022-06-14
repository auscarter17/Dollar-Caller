// create variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'budget_keeper' and set it to version 1
const request = indexedDB.open('budget_keeper', 1);

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('budget', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    
    // check if app is online
    if (navigator.onLine) {
        // uploadBudget();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};