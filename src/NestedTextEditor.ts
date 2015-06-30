import React = require('pkg/React/React');
import dom = React.DOM;

import NestedNodeProps = require('pkg/NestedNode/lib/NestedNodeProps/NestedNodeProps');
import NNDocument = require('pkg/NestedNode/lib/NestedNode/NNDocument');
import DataFunctions = require('pkg/NestedNode/lib/NestedNode/DataFunctions');
import NNDocumentView = require('pkg/NestedNode/lib/NestedNodeView/NNDocumentView');
import NestedNodeView = require('pkg/NestedNode/lib/NestedNodeView/NestedNodeView');
import KeyboardUtil = require('pkg/NestedNode/lib/NestedNodeView/KeyboardUtil');


declare var require;
require(['pkg/require-css/css!pkg/NestedNode/lib/NestedNodeStyle/NestedNodeStyle']);


export interface TextData {
    text: string;
}


class TextDataFunctions implements DataFunctions<TextData> {

    getBlank(): TextData {
        return { text: '' };
    }

    isBlank(data: TextData):boolean {
        return data.text == '';
    }

    isEqual(data1: TextData, data2: TextData):boolean {
        return data1.text == data2.text.trim();
    }

    duplicate(data: TextData): TextData {
        return { text: data.text };
    }

}


interface TextInputComponentProps {
    className?: string;
    value?: string;
    onChange?: (newValue: string) => void;
    onBlur?: () => void;
}

class TextInputComponent extends React.Component<TextInputComponentProps, {}, {}> {

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


class NestedTextNodeView extends NestedNodeView.Component<TextData> {

    protected renderData(data, editMode) {
        var dataCls = 'nn__node-data';
        if (!editMode && !data.text) {
            dataCls += ' ' + (dataCls + '_empty');
        }
        return editMode ?
            React.createElement<TextInputComponentProps>(TextInputComponent, {
                className: dataCls,
                value: data.text,
                onChange: this.handleTextChange.bind(this),
                onBlur: this.handleTextBlur.bind(this)
            }) :
            dom['div']({ className: dataCls }, data.text);
    }

    private handleTextChange(value) {
        this.context.documentActions.updateNodeData({ text: value });
    }

    private handleTextBlur() {
        this.context.documentActions.exitEditMode();
    }

    protected handleKeyPress(e: KeyboardEvent) {
        if (this.props.editing) {
            return;
        }
        var clearCurrentValue = e.charCode != KeyboardUtil.KeyCode.SPACE;
        this.context.documentActions.enterEditMode(clearCurrentValue);
    }

}


export function init(content: NestedNodeProps<TextData>, container: Element) {
    var doc = new NNDocument<TextData>(content, new TextDataFunctions());
    var renderToContainer = render.bind(undefined, container);
    doc.addListener('change', renderToContainer);
    renderToContainer(doc);
}

function render(container: Element, doc: NNDocument<TextData>) {
    var docElem = NNDocumentView.Element<TextData>({
        documentActions: doc,
        documentProps: doc,
        nestedNodeViewComponent: NestedTextNodeView
    });
    React.render(docElem, container);
}
