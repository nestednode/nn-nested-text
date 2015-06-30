require(['../../lib/NestedTextEditor'], function(NestedTextEditor) {

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

    NestedTextEditor.init(docData, document.body);

});
