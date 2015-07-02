import React = require('pkg/React/React');
import dom = React.DOM;


module TextInputComponent {

    export interface Props {
        className?: string;
        value?: string;
        onChange?: (newValue: string) => void;
        onBlur?: () => void;
    }

    export class Component extends React.Component<Props, {}, {}> {

        constructor(props, context) {
            super(props, context);
            this.handleInput = this.handleInput.bind(this);
        }

        protected render() {
            return dom['div']({
                className: this.props.className,
                contentEditable: true,
                onInput: this.handleInput,
                onBlur: this.props.onBlur,
                dangerouslySetInnerHTML: { __html: this.props.value }
            })
        }

        private handleInput(e) {
            this.props.onChange && this.props.onChange(e.target.innerText);
        }

        protected componentDidMount() {
            var domNode = React.findDOMNode(this);

            // перемещаем курсор в конец строки
            var range = document.createRange();
            range.selectNodeContents(domNode);
            range.collapse(false);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            domNode.focus();
        }

    }

    export function Element(props: Props): React.ReactElement {
        return React.createElement(Component, props);
    }

}


export = TextInputComponent;
