require([
    '../../lib/TextInputComponent',
    'bower_components/nn-react/React',
    //'bower_components/react/react',
    'bower_components/require-css/css!bower_components/nn-nested-node/lib/NestedNodeStyle/NestedNodeStyle'
], function(TextInputComponent, React) {

    var container = document.body.firstElementChild;
    render('asdf');

    function render(value, cb) {
        React.render(TextInputComponent.Element({
            className: 'nn__node-data',
            value: value,
            onChange: handleChange,
            onBlur: handleBlur
        }), container, cb);
    }

    function handleChange(newValue) {
        //console.log('change', newValue);
        render(newValue);
    }

    function handleBlur() {
        console.log('blur');
    }

});
