import React, { Component } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

let ReactHighlight = null;

@immutableRenderDecorator
export default class Highlight extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            loadEnd: !!ReactHighlight,
        };
    }
    componentDidMount() {
        if (!this.state.loadEnd) {
            require.ensure([], (require) => {
                ReactHighlight = require('react-highlight');
                this.setState({ loadEnd: true });
            }, 'react-highlight');
        }
    }
    render() {
        if (!this.state.loadEnd) {
            return null;
        }
        return (
            <ReactHighlight {...this.props} />
        );
    }
}
