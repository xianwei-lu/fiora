export default class Props {
    constructor(initValue) {
        this.props = Object.assign({ className: '', style: {} }, initValue);
    }
    addClass(condition, className) {
        if (condition) {
            this.props.className += ` ${className}`;
        }
    }
    addStyle(condition, style) {
        if (condition) {
            for (const key in style) {
                if (Object.hasOwnProperty.call(style, key)) {
                    this.props.style[key] = style[key];
                }
            }
        }
    }
    value() {
        return this.props;
    }
}
