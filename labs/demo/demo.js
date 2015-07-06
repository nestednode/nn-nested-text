require(['../../lib/NestedText'], function(NestedText) {

    var nestedTextData = { data: { text: 'hello world!' }, nested: [
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

    var nestedTextDoc = NestedText.createDocument(nestedTextData);
    var container = document.body;
    var styleMods = { theme: 'dark', zoom: 200, compact: true };
    var render = NestedText.renderToContainer.bind(undefined, container, styleMods);

    nestedTextDoc.addListener('change', render);
    render(nestedTextDoc);

});
