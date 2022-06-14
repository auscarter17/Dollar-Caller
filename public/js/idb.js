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

// this function will fire if a budget adjustment is made while offline
function saveRecord(record) {
    const transaction = db.transaction(['budget'], 'readwrite');
    const budgetObjectStore = transaction.budgetObjectStore('budget');
    budgetObjectStore.add(record);
}

function uploadBudget() {
    // open a transaction on db
    const transaction = db.transaction(['budget'], readwrite);

    //access object store
    const budgetObjectStore = transaction.ObjectStore('pizza');

    // get records from store and set to a variable
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        // if there was data in idb store, send it to API
        if (getAll.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['budget'], 'readwrite');
                    const budgetObjectStore = transaction.ObjectStore('budget');
                    budgetObjectStore.clear();

                    alert('All saved budget changes have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}