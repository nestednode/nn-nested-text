import React = require('bower_components/nn-react/React');
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
            this.props.onChange && this.props.onChange(e.target.textContent);
        }

        protected shouldComponentUpdate(nextProps: Props) {
            var domNode = React.findDOMNode(this);
            // в firefox курсор у contenteditable сбивается при setInnerHTML,
            // поэтому компонент обновляем полностью только при рассинхронизации value
            if (domNode.textContent != nextProps.value) {
                return true;
            }
            // не будем обновлять весь компонент, если изменилось только имя класса
            if (domNode.className !== nextProps.className) {
                domNode.className = nextProps.className;
            }
            return false;
            // каков бы не был результат, this.props и this.state react обновит и так
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
