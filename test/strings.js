module.exports = {
    manipulate: [
        'test',
        'Test',
        'test string',
        'test String',
        'Test String',
        '0test',
        'TEST',
        ' test  ',
        ' Test  '
    ],
    nameValidation: [
        'test',
        'Test',
        'test string',
        'Test String',
        ' test  ',
        ' Test  ',
        'nul',
        'prn',
        'con',
        'lpt',
        'lpt0',
        'com1',
        'com1test'
    ],

    suffixes: [
        '',
        '  ',
        '--suffix',
        ' --suffix_',
        '--collection_suffix',
        '--collection suffix',
        'suffix',
        'collection suffix',
        'Suffix',
        'Collection Suffix'
    ],

    paths: [
        '',
        '  ',
        './',
        'some/path',
        ' ./some/path/',
        'some\\path ',
        'path/',
        'some/con/path',
        'some path'
    ],
    extensions: [
        '',
        '  ',
        '.',
        '.ext',
        'ext',
        ' .ext',
        '.some-ext',
        '.some ext ',
        'some1ext'
    ],

    dot: [
        'filename',
        'filename.ext',
        'filename..some'
    ],
    filenames: [
        'filename',
        'filename.ext',
        'filename..some',
        '.ext',
        '',
        '  ',
        'con.ext',
        'lpt',
        'file/name.ext',
        '/filename.ext',
        'file-name',
        '-file_name',
        'filename_',
        'file name'
    ]

};