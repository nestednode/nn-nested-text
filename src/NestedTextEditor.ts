import React = require('pkg/React/React');
import dom = React.DOM;

import NestedNodeProps = require('pkg/NestedNode/lib/NestedNodeProps/NestedNodeProps');
import NNDocument = require('pkg/NestedNode/lib/NestedNode/NNDocument');
import DataFunctions = require('pkg/NestedNode/lib/NestedNode/DataFunctions');
import NNDocumentView = require('pkg/NestedNode/lib/NestedNodeView/NNDocumentView');
import NestedNodeView = require('pkg/NestedNode/lib/NestedNodeView/NestedNodeView');
import KeyboardUtil = require('pkg/NestedNode/lib/NestedNodeView/KeyboardUtil');

import TextInputComponent = require('./TextInputComponent');

declare var require;
require(['pkg/require-css/css!pkg/NestedNode/lib/NestedNodeStyle/NestedNodeStyle']);


// data stored in node
export interface TextData {
    text: string;
}

// helper data functions
export var TextDataFunctions: DataFunctions<TextData> = {

    getBlank: () => {
        return { text: '' };
    },

    isBlank: (data: TextData) => {
        return data.text == '';
    },

    isEqual: (data1: TextData, data2: TextData) => {
        return data1.text == data2.text.trim();
    },

    duplicate: (data: TextData) => {
        return { text: data.text };
    }
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



// init and render
export function init(content: NestedNodeProps<TextData>, container: Element): void {
    var render = document => React.render(
        NNDocumentView.Element<TextData>({
            documentActions: document,
            documentProps: document,
            nestedNodeViewComponent: NestedTextNodeViewComponent
        }),
        container);
    var document = new NNDocument<TextData>(content, TextDataFunctions);
    document.addListener('change', render);
    render(document);
}
