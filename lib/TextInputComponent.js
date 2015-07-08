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
                    onInput: this.handleInput,
                    onBlur: this.props.onBlur,
                    dangerouslySetInnerHTML: { __html: this.props.value }
                });
            };
            Component.prototype.handleInput = function (e) {
                this.props.onChange && this.props.onChange(e.target.textContent);
            };
            Component.prototype.shouldComponentUpdate = function (nextProps) {
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
            };
            Component.prototype.componentDidMount = function () {
                var domNode = React.findDOMNode(this);
                // перемещаем курсор в конец строки
                var range = document.createRange();
                range.selectNodeContents(domNode);
                range.collapse(false);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                domNode.focus();
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
