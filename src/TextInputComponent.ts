import React = require('bower_components/nn-react/React');
import dom = React.DOM;

declare var MutationObserver;


module TextInputComponent {

    export interface Props {
        className?: string;
        value?: string;
        onChange?: (newValue: string) => void;
        onBlur?: () => void;
    }

    export class Component extends React.Component<Props, {}, {}> {

        domNode: HTMLElement;
        mutationObserver;

        constructor(props, context) {
            super(props, context);
            this.handleInput = this.handleInput.bind(this);
        }

        protected render() {
            return dom['div']({
                className: this.props.className,
                contentEditable: true,
                onBlur: this.props.onBlur,
                dangerouslySetInnerHTML: { __html: this.props.value }
            })
        }

        private handleInput() {
            // при copy/paste появляются левые span-элементы,
            // но дерево лучше не менять, иначе потрется undo history в contenteditable
            //if (this.domNode.children.length > 0) {
            //    this.domNode.innerHTML = this.domNode.textContent;
            //    return; //
            //}
            this.props.onChange && this.props.onChange(this.domNode.textContent);
        }

        protected shouldComponentUpdate(nextProps: Props) {
            // в firefox курсор у contenteditable сбивается при setInnerHTML,
            // поэтому компонент обновляем полностью только при рассинхронизации value
            if (this.domNode.textContent != nextProps.value) {
                return true;
            }
            // не будем обновлять весь компонент, если изменилось только имя класса
            if (this.domNode.className !== nextProps.className) {
                this.domNode.className = nextProps.className;
            }
            return false;
            // каков бы не был результат, this.props и this.state react обновит и так
        }

        protected componentDidMount() {
            this.domNode = React.findDOMNode(this);
            // перемещаем курсор в конец строки
            var range = document.createRange();
            range.selectNodeContents(this.domNode);
            range.collapse(false);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            this.domNode.focus();
            // ie11 не отрабатывает input event
            // а в safari observe-событие приходит только после отпускания кнопки на клавиатуре,
            // остальные могут и так, и эдак
            if ('ActiveXObject' in window) {
                this.mutationObserver = new MutationObserver(this.handleInput);
                this.mutationObserver.observe(this.domNode, { subtree: true, childList: true, characterData: true });
            } else {
                this.domNode.addEventListener('input', this.handleInput);
            }
        }

        protected componentWillUnmount() {
            if ('ActiveXObject' in window) {
                this.mutationObserver.disconnect();
            } else {
                this.domNode.removeEventListener('input', this.handleInput);
            }
        }

    }

    export function Element(props: Props): React.ReactElement {
        return React.createElement(Component, props);
    }

}


export = TextInputComponent;
