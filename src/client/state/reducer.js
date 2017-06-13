import immutable from 'immutable';

const initState = immutable.fromJS({
    number: 0,
});

export default function (state = initState, action) {
    if (!Array.isArray(action.key) && action.type !== '@@redux/INIT') {
        console.warn('action.key 类型错误, 需要为Array', action);
        return state;
    }
    switch (action.type) {
    case 'SetValue': {
        return state.setIn(
            action.key,
            immutable.fromJS(action.value),
        );
    }
    default: {
        return state;
    }
    }
}
