import immutable from 'immutable';

const initState = immutable.fromJS({
    currentGroup: '',
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
    case 'PushValue': {
        return $$state.updateIn(
            action.key,
            ($$items) => $$items.push(immutable.fromJS(action.value)),
        );
    }
    case 'InsertValue': {
        const itemsLength = $$state.getIn(action.key).size;
        const index = action.index > itemsLength ? itemsLength : action.index;
        return $$state.updateIn(
            action.key,
            ($$items) => {
                console.log(action.key);
                console.log($$state.getIn(action.key));
                console.log($$items);
                return $$items.insert(index, immutable.fromJS(action.value));
            },
        );
    }
    case 'UpdateValue': {
        return $$state.updateIn(
            action.key,
            ($$item) => $$item.mergeDeep(action.value),
        );
    }
    default: {
        return $$state;
    }
    }
}
