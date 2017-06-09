let dispatch = null;

function init(storeDispatch) {
    dispatch = storeDispatch;
}

async function action1(data) {
    return dispatch({
        type: 'SetValue',
        key: ['number'],
        value: data,
    });
}

export default {
    action1,
};

export { init };
