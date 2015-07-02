import React = require('pkg/React/React');
import NestedNodeProps = require('pkg/NestedNode/lib/NestedNodeProps/NestedNodeProps');
import DataFunctions = require('pkg/NestedNode/lib/NestedNode/DataFunctions');
import NestedNodeView = require('pkg/NestedNode/lib/NestedNodeView/NestedNodeView');
export interface TextData {
    text: string;
}
export declare var TextDataFunctions: DataFunctions<TextData>;
export declare class NestedTextNodeViewComponent extends NestedNodeView.Component<TextData> {
    protected renderData(data: any, editMode: any): React.ReactElement;
    private handleTextChange(value);
    private handleTextBlur();
    protected handleKeyPress(e: KeyboardEvent): void;
}
export declare function init(content: NestedNodeProps<TextData>, container: Element): void;
