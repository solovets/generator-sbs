var helpers = {
    merge: merge
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

module.exports = helpers;
