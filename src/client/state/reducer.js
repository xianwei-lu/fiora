import immutable from 'immutable';

const initState = immutable.fromJS({
    number: 0,
});

export default function (state = initState, action) {
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
