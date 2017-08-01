import immutable from 'immutable';

const initState = immutable.fromJS({
    currentGroup: '',
    view: {
        autoScroll: true,
        showSearchGroup: false,
        userListSollapsed: false,
        showSelectExpression: false,
        showCodeEditor: false,
        insertInputValue: '',
    },
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
        let index = action.index;
        if (index > itemsLength) {
            index = itemsLength;
        }
        if (index < 0) {
            index = 0;
        }
        return $$state.updateIn(
            action.key,
            ($$items) => $$items.insert(index, immutable.fromJS(action.value)),
        );
    }
    case 'InsertValues': {
        const itemsLength = $$state.getIn(action.key).size;
        let index = action.index;
        if (index > itemsLength) {
            index = itemsLength;
        }
        if (index < 0) {
            index = 0;
        }
        return $$state.updateIn(
            action.key,
            ($$items) => $$items.splice(index, itemsLength).concat(immutable.fromJS(action.value)).concat($$items.splice(0, index)),
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
