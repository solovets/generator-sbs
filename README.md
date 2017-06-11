Generator-sbs
=============
_**S**imple-**B**EM-**S**tructure Yeoman generator_

## Install

```
npm install -g generator-sbs
```

## Configuration

To set prefered settings run subgenerator `config`:

```
$ yo sbs:config
```

This generator helps to set following settings

### Naming convention

_allowed:_ `['classic', 'twoDashes', 'CamelCase', 'noUnderscores']`

_type:_ `list`

Depending on you answer you'll get:

**Classic style**
``` json
{
    "example": "block-name__element-name_modifier-key_modifier-val",
    "separatorForElement": "__",
    "separatorForModifier": "_"
}
```

**Two Dashes style**
``` json
{
    "example": "block-name__element-name--modifier-name",
    "separatorForElement": "__",
    "separatorForModifier": "--"
}
```

**CamelCase style**
``` json
{
    "example": "BlockName__ElementName_modifierKey_modifierVal",
    "separatorForElement": "__",
    "separatorForModifier": "_"
}
```

**"Sans underscore" style**
``` json
{
    "example": "blockName-elementName--modifierKey--modifierVal",
    "separatorForElement": "-",
    "separatorForModifier": "--"
}
```

### Use collections

_default:_ `false`

_type:_ `confirm`

Recommended file structure is:

```
block-a/
    __elem-a/
        _mod-a/
    _mod_a/
block-b/
    __elem-b/
        _mod-b/
    _mod-b/
```

But sometimes it's quite convenient to group some blocks, to put them in logical collection. For example to group blocks that related to forms, header or buttons:

```
forms--bem-collection
    select/
        __ietm/
            _selected/
        _short/
    checkbox/
        __icon/
            _checked/
        _theme-dark/
block-a/
    __elem-a/
        _mod-a/
    _mod_a/
```

If you set this to `true`, you'll be allowed to create and use collections.

### Collection suffix

Set suffix that will be added to all new collections. Also this suffix will be used to detedct existing collections.

_default:_ `--bem-collection`

_type:_ `string`

_when:_ `useCollections === true`

**Limitations:**

* suffix should starts with `--` (will be added automatically if needed)
* suffix can contains letters A-Z, numvers 0-9, dashes and underscores
* suffix can't be empty

### BEM root directory

_type_: `string`

Define "root" styles directory, for example `src/styles`. Will be created automatically if doesn't exist.

### Extension

_allowed:_ `['scss', 'sass', 'sytl', 'less', 'custom']`

_type:_ `list`

Please select extension that is used by your preprocessor. If `custom` is set, you'll be asked to define it.

### "Root" styles file

_type_: `string`

Define "root" styles file (for expamle `styles.scss` or `app.styl`). It should be places in BEM root directory. Will be created automatically if needed.

---
After all needed parameters are set your `.yo-rc.json` will be created.

## Usage

Run generator:

```
$ yo sbs
```

## Templates

Generated files will include special comments:

```
//<= bemBlocks =>
//<= endbemBlocks =>

//<= bemElements =>
//<= endbemElements =>

//<= bemModifiers =>
//<= endbemModifiers =>
```

All created blocks, elements or modifiers will be imported inside of these comments.

### "Root" styles file

```
//<= bemBlocks =>
... // @import rules
//<= endbemBlocks =>
```

### Block

```
.block-name {
    //<= bemElements =>
    ... // @import rules
    //<= endbemElements =>

    //<= bemModifiers =>
    ... // @import rules
    //<= endbemModifiers =>
}
```

### Element

```
&__element {
    //<= bemModifiers =>
    ... // @import rules
    //<= endbemModifiers =>
}
```

### Modifier

```
&--modifier {

}
```

## License

MIT License

Copyright (c) 2016 Denis Solovets

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

