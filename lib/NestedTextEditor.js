var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'pkg/React/React', 'pkg/NestedNode/lib/NestedNode/NNDocument', 'pkg/NestedNode/lib/NestedNodeView/NNDocumentView', 'pkg/NestedNode/lib/NestedNodeView/NestedNodeView', 'pkg/NestedNode/lib/NestedNodeView/KeyboardUtil'], function (require, exports, React, NNDocument, NNDocumentView, NestedNodeView, KeyboardUtil) {
    var dom = React.DOM;
    require(['pkg/require-css/css!pkg/NestedNode/lib/NestedNodeStyle/NestedNodeStyle']);
    var TextDataFunctions = (function () {
        function TextDataFunctions() {
        }
        TextDataFunctions.prototype.getBlank = function () {
            return { text: '' };
        };
        TextDataFunctions.prototype.isBlank = function (data) {
            return data.text == '';
        };
        TextDataFunctions.prototype.isEqual = function (data1, data2) {
            return data1.text == data2.text.trim();
        };
        TextDataFunctions.prototype.duplicate = function (data) {
            return { text: data.text };
        };
        return TextDataFunctions;
    })();
    var TextInputComponent = (function (_super) {
        __extends(TextInputComponent, _super);
        function TextInputComponent(props, context) {
            _super.call(this, props, context);
            this.handleInput = this.handleInput.bind(this);
        }
        TextInputComponent.prototype.render = function () {
            return dom['div']({
                className: this.props.className,
                contentEditable: true,
                onInput: this.handleInput,
                onBlur: this.props.onBlur,
                dangerouslySetInnerHTML: { __html: this.props.value }
            });
        };
        TextInputComponent.prototype.handleInput = function (e) {
            this.props.onChange && this.props.onChange(e.target.innerText);
        };
        TextInputComponent.prototype.componentDidMount = function () {
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
        return TextInputComponent;
    })(React.Component);
    var NestedTextNodeView = (function (_super) {
        __extends(NestedTextNodeView, _super);
        function NestedTextNodeView() {
            _super.apply(this, arguments);
        }
        NestedTextNodeView.prototype.renderData = function (data, editMode) {
            var dataCls = 'nn__node-data';
            if (!editMode && !data.text) {
                dataCls += ' ' + (dataCls + '_empty');
            }
            return editMode ? React.createElement(TextInputComponent, {
                className: dataCls,
                value: data.text,
                onChange: this.handleTextChange.bind(this),
                onBlur: this.handleTextBlur.bind(this)
            }) : dom['div']({ className: dataCls }, data.text);
        };
        NestedTextNodeView.prototype.handleTextChange = function (value) {
            this.context.documentActions.updateNodeData({ text: value });
        };
        NestedTextNodeView.prototype.handleTextBlur = function () {
            this.context.documentActions.exitEditMode();
        };
        NestedTextNodeView.prototype.handleKeyPress = function (e) {
            if (this.props.editing) {
                return;
            }
            var clearCurrentValue = e.charCode != KeyboardUtil.KeyCode.SPACE;
            this.context.documentActions.enterEditMode(clearCurrentValue);
        };
        return NestedTextNodeView;
    })(NestedNodeView.Component);
    function init(content, container) {
        var doc = new NNDocument(content, new TextDataFunctions());
        var renderToContainer = render.bind(undefined, container);
        doc.addListener('change', renderToContainer);
        renderToContainer(doc);
    }
    exports.init = init;
    function render(container, doc) {
        var docElem = NNDocumentView.Element({
            documentActions: doc,
            documentProps: doc,
            nestedNodeViewComponent: NestedTextNodeView
        });
        React.render(docElem, container);
    }
});
