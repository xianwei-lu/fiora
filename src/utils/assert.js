module.exports = (expression, status, data) => {
    if (expression) {
        const err = new Error(JSON.stringify({ status, data }));
        err.name = 'Assert Error';
        throw err;
    }
};
