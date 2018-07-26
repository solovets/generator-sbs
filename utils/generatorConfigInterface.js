module.exports = {
    'namingConvention': {
        type: 'string'
    },
    'useCollections': {
        type: 'boolean',
        deps: {
            'collectionSuffix': {
                type: 'string'
            }
        }
    },
    'bemDirectory': {
        type: 'string'
    },
    'ext': {
        type: 'string'
    },
    'rootStylesFile': {
        type: 'string'
    },
    'prefixForElement': {
        type: 'string'
    },
    'prefixForModifier': {
        type: 'string'
    }
};