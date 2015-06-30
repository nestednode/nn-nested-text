import NestedNodeProps = require('pkg/NestedNode/lib/NestedNodeProps/NestedNodeProps');
export interface TextData {
    text: string;
}
export declare function init(content: NestedNodeProps<TextData>, container: Element): void;
