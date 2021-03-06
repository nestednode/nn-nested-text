import React = require('bower_components/nn-react/React');
import NestedNodeProps = require('bower_components/nn-nested-node/lib/NestedNodeProps/NestedNodeProps');
import NNDocument = require('bower_components/nn-nested-node/lib/NestedNode/NNDocument');
import DataFunctions = require('bower_components/nn-nested-node/lib/NestedNode/DataFunctions');
import NestedNodeView = require('bower_components/nn-nested-node/lib/NestedNodeView/NestedNodeView');
export interface TextData {
    text: string;
}
export declare var TextDataFunctions: DataFunctions<TextData>;
export declare function createDocument(content: NestedNodeProps<TextData>): NNDocument<TextData>;
export declare class NestedTextNodeViewComponent extends NestedNodeView.Component<TextData> {
    protected renderData(data: TextData, editMode: boolean): React.ReactElement;
    private handleTextChange(value);
    private handleTextBlur();
    protected handleKeyPress(e: KeyboardEvent): void;
}
export declare function createDocumentViewElement(document: NNDocument<TextData>, styleMods: any): React.ReactElement;
export declare function renderToContainer(container: Element, styleMods: any, document: NNDocument<TextData>): React.Component<any, any, any>;
