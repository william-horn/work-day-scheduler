/*
? @document-start
=====================
| LOCAL STORAGE API |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          datastore.js
? @document-created:       03/15/2022
? @document-modified:      03/15/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

- Coming soon

==================================================================================================================================

? @document-api
=============
| ABOUT API |
==================================================================================================================================

datastore.get(name)
datastore.set(name, "this", 500)
datastore.update(name, oldData => {
    oldData.push(new data)
})

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Add function that returns how full the localStorage is --NOT DONE
-   Add cache? --REMINDER

==================================================================================================================================
*/

const datastore = {}

datastore.get = function(datakey, def) {
    let oldData = localStorage.getItem(datakey);

    if (!oldData && def === null) {
        console.error("No previous data was found");
    } else if (!oldData) {
        oldData = def;
    } else {
        oldData = JSON.parse(oldData);
    }

    return oldData;
}

datastore.update = function(datakey, callback) {
    const savedData = this.get(datakey);
    this.save(datakey, callback(savedData));
}

datastore.save = function(datakey, value) {
    localStorage.setItem(datakey, JSON.stringify(value));
}

datastore.remove = function(datakey) {
    localStorage.removeItem(datakey);
}

datastore.clear = function(datakey) {
    localStorage.clear();
}

export default datastore