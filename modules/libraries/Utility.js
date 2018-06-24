/**
 * get time stamp of now in Millisecond
 *
 * @return {number}
 */
module.exports.getNowTimeStamp = () => {
    return Math.floor(Date.now() / 1000);
};

/**
 * get a random number between two numbers
 *
 * @param from
 * @param to
 * @return {number}
 */
module.exports.getRandomNumber = (from, to) => {
    return Math.floor((Math.random() * to) + from);
};

/**
 * make a string with possible chars
 *
 * @param length
 * @return {string}
 */
module.exports.makeString = (length) => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

/**
 * remove an item from array
 *
 * @param data
 * @param id
 * @return {*}
 */
module.exports.removeFromArray = (data, id) => {
    for(let i = 0; i < data.length; i++) {
        if(String(data[i].id) === String(id)) {
            data.splice(i, 1);
            break;
        }
    }

    return data;
};