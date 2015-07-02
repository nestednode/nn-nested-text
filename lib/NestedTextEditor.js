var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'pkg/React/React', 'pkg/NestedNode/lib/NestedNode/NNDocument', 'pkg/NestedNode/lib/NestedNodeView/NNDocumentView', 'pkg/NestedNode/lib/NestedNodeView/NestedNodeView', 'pkg/NestedNode/lib/NestedNodeView/KeyboardUtil', './TextInputComponent'], function (require, exports, React, NNDocument, NNDocumentView, NestedNodeView, KeyboardUtil, TextInputComponent) {
    var dom = React.DOM;
    require(['pkg/require-css/css!pkg/NestedNode/lib/NestedNodeStyle/NestedNodeStyle']);
    // helper data functions
    exports.TextDataFunctions = {
        getBlank: function () { return ({ text: '' }); },
        isBlank: function (data) { return data.text == ''; },
        isEqual: function (data1, data2) { return data1.text == data2.text.trim(); },
        duplicate: function (data) { return ({ text: data.text }); }
    };
    // node view
    var NestedTextNodeViewComponent = (function (_super) {
        __extends(NestedTextNodeViewComponent, _super);
        function NestedTextNodeViewComponent() {
            _super.apply(this, arguments);
        }
        NestedTextNodeViewComponent.prototype.renderData = function (data, editMode) {
            var dataCls = 'nn__node-data';
            if (!editMode && !data.text) {
                dataCls += ' ' + (dataCls + '_empty');
            }
            return editMode ? TextInputComponent.Element({
                className: dataCls,
                value: data.text,
                onChange: this.handleTextChange.bind(this),
                onBlur: this.handleTextBlur.bind(this)
            }) : dom['div']({ className: dataCls }, data.text);
        };
        NestedTextNodeViewComponent.prototype.handleTextChange = function (value) {
            this.context.documentActions.updateNodeData({ text: value });
        };
        NestedTextNodeViewComponent.prototype.handleTextBlur = function () {
            this.context.documentActions.exitEditMode();
        };
        NestedTextNodeViewComponent.prototype.handleKeyPress = function (e) {
            if (this.props.editing) {
                return;
            }
            var clearCurrentValue = e.charCode != KeyboardUtil.KeyCode.SPACE;
            this.context.documentActions.enterEditMode(clearCurrentValue);
        };
        return NestedTextNodeViewComponent;
    })(NestedNodeView.Component);
    exports.NestedTextNodeViewComponent = NestedTextNodeViewComponent;
    // init and render
    function init(content, container, styleMods) {
        var render = function (document) { return React.render(NNDocumentView.Element({
            documentActions: document,
            documentProps: document,
            nestedNodeViewComponent: NestedTextNodeViewComponent,
            styleMods: styleMods
        }), container); };
        var document = new NNDocument(content, exports.TextDataFunctions);
        document.addListener('change', render);
        render(document);
    }
    exports.init = init;
});
