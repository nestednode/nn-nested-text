import React = require('pkg/React/React');
import dom = React.DOM;

import NNDocument = require('pkg/NestedNode/lib/NestedNode/NNDocument');
import DataFunctions = require('pkg/NestedNode/lib/NestedNode/DataFunctions');
import NNDocumentView = require('pkg/NestedNode/lib/NestedNodeView/NNDocumentView');
import NestedNodeView = require('pkg/NestedNode/lib/NestedNodeView/NestedNodeView');
import KeyboardUtil = require('pkg/NestedNode/lib/NestedNodeView/KeyboardUtil');


declare var require;
require(['pkg/require-css/css!pkg/NestedNode/lib/NestedNodeStyle/NestedNodeStyle']);


interface TextData {
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

    render() {
        return dom['div']({
            className: this.props.className,
            contentEditable: true,
            onInput: this.handleInput,
            onBlur: this.props.onBlur,
            dangerouslySetInnerHTML: { __html: this.props.value }
        })
    }

    handleInput(e) {
        this.props.onChange && this.props.onChange(e.target.innerText);
    }

    componentDidMount() {
        var domNode = React.findDOMNode(this);
        // курсор почему-то в начале строки, перемещаем его в конец
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

    renderData(data, editMode) {
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

    handleTextChange(value) {
        this.context.documentActions.updateNodeData({ text: value });
    }

    handleTextBlur() {
        this.context.documentActions.exitEditMode();
    }

    handleKeyPress(e: KeyboardEvent) {
        if (this.props.editing) {
            return;
        }
        var clearCurrentValue = e.charCode != KeyboardUtil.KeyCode.SPACE;
        this.context.documentActions.enterEditMode(clearCurrentValue);
    }

}


function render(doc: NNDocument<TextData>) {
    var docElem = NNDocumentView.Element<TextData>({
        documentActions: doc,
        documentProps: doc,
        nestedNodeViewComponent: NestedTextNodeView
    });
    React.render(docElem, document.body);
}


var docData = { data: { text: 'hello world!' }, nested: [
    { data: { text: 'космос' }, nested: [
        { data: { text: '9'} },
        { data: { text: '8'} },
        { data: { text: '7'} },
        { data: { text: '6'} },
        { data: { text: '5'} },
        { data: { text: '4'} },
        { data: { text: '3'} },
        { data: { text: '2'} },
        { data: { text: '1'} },
        { data: { text: 'поехали!'} }
    ]},
    { data: { text: 'foo bar'}, nested: [

    ]}
]};


var doc = new NNDocument<TextData>(docData, new TextDataFunctions());
doc.addListener('change', render);
render(doc);
