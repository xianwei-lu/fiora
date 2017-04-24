import React, { Component, PropTypes } from 'react';

import 'styles/feature/form.less';
import Props from '../../utils/props';

class FormInput extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        name: PropTypes.string.isRequired,
    }
    render() {
        const { placeholder, name } = this.props;
        const props = new Props('feature-form-input', {
            placeholder,
            name,
        });

        return (
            <input {...props.value()} />
        );
    }
}

class FormButton extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    }
    render() {
        const { text, onClick } = this.props;
        return (
            <button className="feature-form-button" onClick={onClick}>{text}</button>
        );
    }
}

export default class Form extends Component {
    static Input = FormInput;
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array,
            PropTypes.string,
        ]),
        onSubmit: PropTypes.func,
    }

    onSubmitClick = () => {
        const { onSubmit } = this.props;
        const data = {};
        const $inputs = this.dom.querySelectorAll('input');
        for (const $input of $inputs) {
            data[$input.name] = $input.value;
        }

        if (onSubmit) {
            onSubmit(data);
        }
    }
    render() {
        const { children } = this.props;
        return (
            <div className="feature-form" ref={d => this.dom = d}>
                { children }
                <FormButton text="登录" onClick={this.onSubmitClick} />
            </div>
        );
    }
}
