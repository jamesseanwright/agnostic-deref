# Agnostic Dereference

Dereference JSON pointers in a JSON schemas with their true resolved values. A custom parsing function can be specified to support dereferencing of any file format.
This has been forked from [json-schema-deref](https://github.com/bojand/json-schema-deref).

## Installation

`npm install agnostic-deref`

## Overview

Let's say you have the following JSON Schema:

```json
{
  "description": "Just some JSON schema.",
  "title": "Basic Widget",
  "type": "object",
  "definitions": {
    "id": {
      "description": "unique identifier",
      "type": "string",
      "minLength": 1,
      "readOnly": true
    }
  },
  "properties": {
    "id": {
      "$ref": "#/definitions/id"
    },
    "foo": {
      "$ref": "http://www.mysite.com/myschema.json#/definitions/foo"
    },
    "bar": {
      "$ref": "bar.json"
    }
  }
}
```

Sometimes you just want that schema to be fully expanded, with `$ref`'s being their (true) resolved values:

```json
{
  "description": "Just some JSON schema.",
  "title": "Basic Widget",
  "type": "object",
  "definitions": {
    "id": {
      "description": "unique identifier",
      "type": "string",
      "minLength": 1,
      "readOnly": true
    }
  },
  "properties": {
    "id": {
      "description": "unique identifier",
      "type": "string",
      "minLength": 1,
      "readOnly": true
    },
    "foo": {
      "description": "foo property",
      "readOnly": true,
      "type": "number"
    },
    "bar": {
      "description": "bar property",
      "type": "boolean"
    }
  }
}
```

This utility lets you do that:


```js
var deref = require('agnostic-deref');
var myschema = require('schema.json');

var fullSchema = deref(myschema);
```

Agnostic Deference also allows refs of any format to be parsed via the `options.parser` function. This is useful if you specify your schemas in a non-JSON format, such as YAML:

```yaml
# schema.yaml
---
  description: User
  title: User
  type: object

  properties:
    subschema:
      $ref: subschema.yaml

# subschema.yaml
---
  description: "Some subschema"
  properties:
    foo:
      type: string
    bar:
      type: object
```

```js
const yaml = require('js-yaml');
const deref = require('agnostic-deref');
const fs = require('fs');

const schema = yaml.safeLoad(fs.readFileSync('schema.yaml'));

const fullSchema = deref(schema, { parser: yaml.safeLoad });
```

## API Reference

<a name="deref"></a>

## deref(schema, options) ⇒ <code>Object</code> &#124; <code>Error</code>
Derefs <code>$ref</code>'s in JSON Schema to actual resolved values. Supports local, and file refs.

**Kind**: global function
**Returns**: <code>Object</code> &#124; <code>Error</code> - the deref schema oran instance of <code>Error</code> if error.

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Object</code> | The JSON schema |
| options | <code>Object</code> | options |
| options.baseFolder | <code>String</code> | the base folder to get relative path files from. Default is <code>process.cwd()</code> |
| options.failOnMissing | <code>Boolean</code> | By default missing / unresolved refs will be left as is with their ref value intact.                                        If set to <code>true</code> we will error out on first missing ref that we cannot                                        resolve. Default: <code>false</code>. |
| options.parser | `Function` | The function invoked to parse the contents of files located at each `$ref`. This defaults to `JSON.parse`. |

