import React = require('bower_components/nn-react/React');
declare module TextInputComponent {
    interface Props {
        className?: string;
        value?: string;
        onChange?: (newValue: string) => void;
        onBlur?: () => void;
    }
    class Component extends React.Component<Props, {}, {}> {
        constructor(props: any, context: any);
        protected render(): React.ReactElement;
        private handleInput(e);
        protected componentDidMount(): void;
    }
    function Element(props: Props): React.ReactElement;
}
export = TextInputComponent;
