'use strict';

function hello(params) {
    const name = params.name || 'World';
    console.debug(params)
    console.log('log', { payload: `Hello, ${name}` });
    return { payload: `Hello, ${name}!` };
}

exports.hello = hello;
