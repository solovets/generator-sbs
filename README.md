Generator-sbs
=============
_Simple-BEM-Structure Yeoman generator_

## Install

## Configuration

To set prefered settings run subgenerator `config`:

```
$ yo sbs:config
```

This generator hlps to set following settings

#### Naming convention

_allowed:_ `['classic', 'twoDashes', 'CamelCase', 'noUnderscores']`

_type:_ `list`

Depending on you answer you'll get:

**Classic style**
``` json
{
    'example': 'block-name__element-name_modifier-key_modifier-val',
    'separatorForElement': '__',
    'separatorForModifier': '_'
}
```

**Two Dashes style**
``` json
{
    'example': 'block-name__element-name--modifier-name',
    'separatorForElement': '__',
    'separatorForModifier': '--'
}
```

**CamelCase style**
``` json
{
    'example': 'BlockName__ElementName_modifierName_modifierVal',
    'separatorForElement': '__',
    'separatorForModifier': '_'
}
```

**"Sans underscore" style**
``` json
{
    'example': 'blockName-elementName--modifierName--modifierVal',
    'separatorForElement': '-',
    'separatorForModifier': '--'
}
```

#### Use collections

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

But sometimes it's quite convenient to group some blocks, to put them in logical collections. For example to group blocks that according to forms, header, buttons:

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

If you set this setting to `true`, you'll be allowed to create collections and to select collection to put creating block in it.

#### Collection suffix

Set suffix that will be added to all new collections. Also this suffix will be used to detedcted existing collections.

_default:_ `--bem-collection`

_type:_ `string`

_when:_ `useCollections === true`

**Limitations:**

* suffix should starts with `--` (will be added automatically if needed)
* suffix can contains letters A-Z, numvers 0-9, dashes and underscores
* suffix can't be empty

#### BEM root directory

_type_: `string`

Define "root" styles directory, for example `src/styles`. Will be created automatically if doesn't exist.

#### Extension

_allowed:_ `['scss', 'sass', 'sytl', 'less', 'custom']`

_type:_ `list`

Please select extension that is used by your preprocessor. If `custom` is set, you'll be asked to define it.

#### "Root" styles file

_type_: `string`

Define "root" styles file (for expamle `styles.scss` or `app.styl`). It should be places in BEM root directory. Will be created automaticvally if needed.

---
After all needed parameters are set your `.yo-rc.json` will be created.

## Usage

Run generator:

```
$ yo sbs
```



## License



