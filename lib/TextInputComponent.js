var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'bower_components/nn-react/React'], function (require, exports, React) {
    var dom = React.DOM;
    var TextInputComponent;
    (function (TextInputComponent) {
        var Component = (function (_super) {
            __extends(Component, _super);
            function Component(props, context) {
                _super.call(this, props, context);
                this.handleInput = this.handleInput.bind(this);
            }
            Component.prototype.render = function () {
                return dom['div']({
                    className: this.props.className,
                    contentEditable: true,
                    onBlur: this.props.onBlur,
                    dangerouslySetInnerHTML: { __html: this.props.value }
                });
            };
            Component.prototype.handleInput = function () {
                // при copy/paste появляются левые span-элементы,
                // но дерево лучше не менять, иначе потрется undo history в contenteditable
                //if (this.domNode.children.length > 0) {
                //    this.domNode.innerHTML = this.domNode.textContent;
                //    return; //
                //}
                this.props.onChange && this.props.onChange(this.domNode.textContent);
            };
            Component.prototype.shouldComponentUpdate = function (nextProps) {
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
            };
            Component.prototype.componentDidMount = function () {
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
                }
                else {
                    this.domNode.addEventListener('input', this.handleInput);
                }
            };
            Component.prototype.componentWillUnmount = function () {
                if ('ActiveXObject' in window) {
                    this.mutationObserver.disconnect();
                }
                else {
                    this.domNode.removeEventListener('input', this.handleInput);
                }
            };
            return Component;
        })(React.Component);
        TextInputComponent.Component = Component;
        function Element(props) {
            return React.createElement(Component, props);
        }
        TextInputComponent.Element = Element;
    })(TextInputComponent || (TextInputComponent = {}));
    return TextInputComponent;
});
