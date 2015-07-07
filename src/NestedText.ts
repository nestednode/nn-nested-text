import React = require('bower_components/nn-react/React');
import dom = React.DOM;

import NestedNodeProps = require('bower_components/nn-nested-node/lib/NestedNodeProps/NestedNodeProps');
import NNDocument = require('bower_components/nn-nested-node/lib/NestedNode/NNDocument');
import DataFunctions = require('bower_components/nn-nested-node/lib/NestedNode/DataFunctions');
import NNDocumentView = require('bower_components/nn-nested-node/lib/NestedNodeView/NNDocumentView');
import NestedNodeView = require('bower_components/nn-nested-node/lib/NestedNodeView/NestedNodeView');
import KeyboardUtil = require('bower_components/nn-nested-node/lib/NestedNodeView/KeyboardUtil');

import TextInputComponent = require('./TextInputComponent');


// data stored in node
export interface TextData {
    text: string;
}


// helper data functions
export var TextDataFunctions: DataFunctions<TextData> = {

    getBlank: () => ({ text: '' }),

    isBlank: (data: TextData) => data.text == '',

    isEqual: (data1: TextData, data2: TextData) => data1.text == data2.text.trim(),

    duplicate: (data: TextData) => ({ text: data.text })
};


// node view
export class NestedTextNodeViewComponent extends NestedNodeView.Component<TextData> {

    protected renderData(data, editMode) {
        var dataCls = 'nn__node-data';
        if (!editMode && !data.text) {
            dataCls += ' ' + (dataCls + '_empty');
        }
        return editMode ?
            TextInputComponent.Element({
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


export function createDocument(content: NestedNodeProps<TextData>): NNDocument<TextData> {
    return new NNDocument<TextData>(content, TextDataFunctions);
}

export function createDocumentViewElement(document: NNDocument<TextData>, styleMods: {}): React.ReactElement {
    return NNDocumentView.Element<TextData>({
        documentActions: document,
        documentProps: document,
        nestedNodeViewComponent: NestedTextNodeViewComponent,
        styleMods: styleMods
    })
}

export function renderToContainer(container: Element, styleMods: {}, document: NNDocument<TextData>) {
    return React.render(createDocumentViewElement(document, styleMods), container);
}
