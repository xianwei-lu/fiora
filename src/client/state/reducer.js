import immutable from 'immutable';

const initState = immutable.fromJS({

});

export default function ($$state = initState, action) {
    switch (action.type) {
    case 'SetValue': {
        return $$state.setIn(
            action.key,
            immutable.fromJS(action.value),
        );
    }
    case 'SetMultiValue': {
        let $$newState = $$state;
        for (let i = 0; i < action.keys.length; i++) {
            if (action.values[i]) {
                $$newState = $$newState.setIn(
                    action.keys[i],
                    immutable.fromJS(action.values[i]),
                );
            }
        }
        return $$newState;
    }
    default: {
        return $$state;
    }
    }
}
