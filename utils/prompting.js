var selectParentBlockFor = function (component) {
    return 'Please select parent block of ' + component;
};

var prompting = {
    defineCreatedComponent: defineCreaedComponent,
    describeCreatedElement: describeCreatedElement,
    describeCreatedModifier: describeCreatedModifier
};

function defineCreaedComponent(prefixForElement, prefixForModifier) {
    return [
        {
            type: 'list',
            name: 'creatingComponentType',
            message: 'What would you like to crate?',
            choices: [
                {
                    name: 'block',
                    value: 'block'
                },
                {
                    name: prefixForElement + 'element',
                    value: 'element'
                },
                {
                    name: prefixForModifier + 'modifier',
                    value: 'modifier'
                }
            ]
        },
        {
            type: 'input',
            name: 'creatingComponentName',
            message: 'Please define name:'
        }
    ];
}

function describeCreatedElement(prefixForElement, prefixForModifier) {
    return [
        {
            type: 'list',
            name: 'parentBlockOfElement',
            message: selectParentBlockFor(prefixForElement + 'element'),
            choices: [
                {
                    name: 'block-a',
                    value: 'block-a'
                },
                {
                    name: 'block-b',
                    value: 'block-b'
                },
                {
                    name: 'block-c',
                    value: 'block-c'
                }
            ]
        }
    ];
}

function describeCreatedModifier(prefixForElement, prefixForModifier) {
    return [
        {
            type: 'list',
            name: 'modifierFor',
            message: 'What is this ' + prefixForModifier + 'modifier for?',
            choices: [
                {
                    name: 'for block',
                    value: 'forBlock'
                },
                {
                    name: 'for ' + prefixForElement + 'element',
                    value: 'forElement'
                }
            ]
        }
    ]
}

module.exports = prompting;