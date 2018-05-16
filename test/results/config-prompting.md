###utils/config/prompting.js :: filters and validation

#####Filter and validate collection suffix

Input | Filtered | Valid
----- | -------- | -----
_whitespace(s)_ | -- | Can't be empty
_whitespace(s)_ | -- | Can't be empty
--suffix | --suffix | true
 --suffix_ | --suffix | true
--collection_suffix | --collection_suffix | true
--collection suffix | --collection suffix | Allowed characters: 0-9, A-Z, dash and underscore
suffix | --suffix | true
collection suffix | --collection suffix | Allowed characters: 0-9, A-Z, dash and underscore
Suffix | --Suffix | true
Collection Suffix | --Collection Suffix | Allowed characters: 0-9, A-Z, dash and underscore
#####Filter and validate bem directory path

Input | Filtered | Valid
----- | -------- | -----
_whitespace(s)_ | . | true
_whitespace(s)_ | . | true
./ | . | true
some/path | some\path | true
 ./some/path/ | some\path | true
some\path  | some\path | true
path/ | path | true
some/con/path | some\con\path | Error in con
some path | some path | Error in some path
