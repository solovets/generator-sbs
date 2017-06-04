var helpers = {
    merge: merge,
    capitalize: capitalize
};

// This function merge object {a} and object {b}
// and returns object {c}
function merge(a, b) {
    var key;
    for (key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }

    return a;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = helpers;
