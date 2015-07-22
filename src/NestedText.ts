import React = require('bower_components/nn-react/React');
import dom = React.DOM;

import NestedNodeProps = require('bower_components/nn-nested-node/lib/NestedNodeProps/NestedNodeProps');
import NNDocument = require('bower_components/nn-nested-node/lib/NestedNode/NNDocument');
import DataFunctions = require('bower_components/nn-nested-node/lib/NestedNode/DataFunctions');
import NNDocumentView = require('bower_components/nn-nested-node/lib/NestedNodeView/NNDocumentView');
import NestedNodeView = require('bower_components/nn-nested-node/lib/NestedNodeView/NestedNodeView');
import KeyboardUtil = require('bower_components/nn-nested-node/lib/NestedNodeView/KeyboardUtil');

import TextInputComponent = require('./TextInputComponent');


// Как построить редактор под требуемый тип узлов:

// определяем, данные какой структуры будут редактироваться в узлах документа —
// для простоты примера, пусть это будет текстовая строка

export interface TextData {
    text: string;
}


// реализуем набор функций над этими данными,
// они необходимы для работы внутренних методов документа

export var TextDataFunctions: DataFunctions<TextData> = {

    getBlank: () => ({ text: '' }),

    isBlank: (data: TextData) => data.text == '',

    isEqual: (data1: TextData, data2: TextData) => data1.text == data2.text.trim(),

    duplicate: (data: TextData) => ({ text: data.text })
};


// предыдущего достаточно, чтобы получить документ, работающий с деревом узлов нужного нам типа

export function createDocument(content: NestedNodeProps<TextData>): NNDocument<TextData> {
    return new NNDocument<TextData>(content, TextDataFunctions);
}


// переходим к View: опеределяем React-компонент, который будет отображать данные узла,
// отвечать за их редактирование, а также интерперетировать действия пользователя
// в вызовы соответствующих операций над документом

export class NestedTextNodeViewComponent extends NestedNodeView.Component<TextData> {

    protected renderData(data: TextData, editMode: boolean) {
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

    private handleTextChange(value: string) {
        this.context.documentActions.updateNodeData({ text: value });
    }

    private handleTextBlur() {
        this.context.documentActions.exitEditMode();
    }

    protected handleKeyPress(e: KeyboardEvent) {
        if (this.props.editing) {
            return;
        }
        if (e.ctrlKey || e.metaKey || e.altKey || e.charCode == KeyboardUtil.KeyCode.SPACE) {
            return;
        }
        // chrome успевает напечатать символ в создаваемом contenteditable, а firefox - нет
        // чтобы поведение было одинаковым, приходится отменять действие по-умолчанию и передавать символ явно
        e.preventDefault();
        this.context.documentActions.enterEditMode({ text: e.key });
    }
}


// после того как компонент для работы с отдельными узлами готов,
// React-элемент для всего документа создается следующим образом:

export function createDocumentViewElement(document: NNDocument<TextData>, styleMods): React.ReactElement {
    return NNDocumentView.Element<TextData>({
        documentActions: document,
        documentProps: document,
        nestedNodeViewComponent: NestedTextNodeViewComponent,
        styleMods: styleMods
    })
}


// теперь дело за React (см. также demo.js)

export function renderToContainer(container: Element, styleMods, document: NNDocument<TextData>) {
    return React.render(createDocumentViewElement(document, styleMods), container);
}
