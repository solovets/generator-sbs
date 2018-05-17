###utils/config/prompting.js :: filters and validation

_Whitespaces in inputs and filtered strings replaced with ■_

#####Filter and validate collection suffix

Input | Filtered | Valid
----- | -------- | -----
_blank_ | _blank_ | Can't be empty
■■ | _blank_ | Can't be empty
--suffix | --suffix | true
■--suffix_ | --suffix | true
--collection_suffix | --collection_suffix | true
--collection■suffix | --collection■suffix | Allowed characters: 0-9, A-Z, dash and underscore
suffix | --suffix | true
collection■suffix | --collection■suffix | Allowed characters: 0-9, A-Z, dash and underscore
Suffix | --Suffix | true
Collection■Suffix | --Collection■Suffix | Allowed characters: 0-9, A-Z, dash and underscore
#####Filter and validate bem directory path

Input | Filtered | Valid
----- | -------- | -----
_blank_ | . | true
■■ | . | true
./ | . | true
some/path | some\path | true
■./some/path/ | some\path | true
some\path■ | some\path | true
path/ | path | true
some/con/path | some\con\path | Error in con
some■path | some■path | Error in some path
#####Filter and validate custom extension input

Input | Filtered | Valid
----- | -------- | -----
_blank_ | _blank_ | Allowed characters: A-Z, 0-9
■■ | _blank_ | Allowed characters: A-Z, 0-9
. | _blank_ | Allowed characters: A-Z, 0-9
.ext | ext | true
ext | ext | true
■.ext | ext | true
.some-ext | some-ext | Allowed characters: A-Z, 0-9
.some■ext■ | some■ext | Allowed characters: A-Z, 0-9
some1ext | some1ext | true
#####Test dot() function

Input | Output
----- | ------
filename | filename.ext
filename.ext | filename.ext
filename..some | filename..some.ext
#####Filter and validate "root" styles file for "classic" convention

Input | Filtered | Valid
----- | -------- | -----
filename | filename.ext | true
filename.ext | filename.ext | true
filename..some | filename..some.ext | Allowed characters: 0-9, A-Z, dash and underscore
.ext | .ext | Can't be empty
_blank_ | .ext | Can't be empty
■■ | .ext | Can't be empty
con.ext | con.ext | Forbidden file name
lpt | lpt.ext | true
file/name.ext | file/name.ext | Only filename expected
/filename.ext | /filename.ext | Only filename expected
file-name | file-name.ext | true
-file_name | file-name.ext | true
filename_ | filename.ext | true
file■name | file-name.ext | true
#####Filter and validate "root" styles file for "twoDashes" convention

Input | Filtered | Valid
----- | -------- | -----
filename | filename.ext | true
filename.ext | filename.ext | true
filename..some | filename..some.ext | Allowed characters: 0-9, A-Z, dash and underscore
.ext | .ext | Can't be empty
_blank_ | .ext | Can't be empty
■■ | .ext | Can't be empty
con.ext | con.ext | Forbidden file name
lpt | lpt.ext | true
file/name.ext | file/name.ext | Only filename expected
/filename.ext | /filename.ext | Only filename expected
file-name | file-name.ext | true
-file_name | file-name.ext | true
filename_ | filename.ext | true
file■name | file-name.ext | true
#####Filter and validate "root" styles file for "CamelCase" convention

Input | Filtered | Valid
----- | -------- | -----
filename | Filename.ext | true
filename.ext | Filename.ext | true
filename..some | filename..some.ext | Allowed characters: 0-9, A-Z, dash and underscore
.ext | .ext | Can't be empty
_blank_ | .ext | Can't be empty
■■ | .ext | Can't be empty
con.ext | Con.ext | Forbidden file name
lpt | Lpt.ext | true
file/name.ext | file/name.ext | Only filename expected
/filename.ext | /filename.ext | Only filename expected
file-name | FileName.ext | true
-file_name | FileName.ext | true
filename_ | Filename.ext | true
file■name | FileName.ext | true
#####Filter and validate "root" styles file for "noUnderscores" convention

Input | Filtered | Valid
----- | -------- | -----
filename | filename.ext | true
filename.ext | filename.ext | true
filename..some | filename..some.ext | Allowed characters: 0-9, A-Z, dash and underscore
.ext | .ext | Can't be empty
_blank_ | .ext | Can't be empty
■■ | .ext | Can't be empty
con.ext | con.ext | Forbidden file name
lpt | lpt.ext | true
file/name.ext | file/name.ext | Only filename expected
/filename.ext | /filename.ext | Only filename expected
file-name | fileName.ext | true
-file_name | fileName.ext | true
filename_ | filename.ext | true
file■name | fileName.ext | true
