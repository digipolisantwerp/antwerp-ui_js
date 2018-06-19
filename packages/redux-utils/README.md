# ACPaaS UI JS Redux Utils

[![js-redux-utils-status]][js-redux-utils-package]

The Redux Utils package provides some helpers and bootstrap utils to ease the redux setup.

## Installation
---

**NPM**
```
npm i -S @acpaas-ui/js-redux-utils
```

**Yarn**
```
yarn add @acpaas-ui/js-redux-utils
```

## Import
---

```
// ES2015
import { progressReducer } from '@acpaas-ui/js-redux-utils';
```

## Higher Order Reducers (HOR)
---
There are 3 HORs available: `progress`, `basicType` and `target`. The usage of `combineReducers` is required for these HORs to work.

### progress

The progress HOR wraps the state in an object detailing the status of your data:

``` json
{
    loading: true/false,
    created: 'Thu Feb 15 2018 13:36:31 GMT+0100 (CET)',
    lastUpdated: 'Thu Feb 15 2018 13:36:31 GMT+0100 (CET)',
    error: 'Custom error',
    result: {
        id: 'my-item'
    }
}
```

You can update the status by providing the `loading` flag or an `err` message in your action:

``` json
{
    type: 'DO_STUFF',
    loading: true/false,
    err: 'Something went wrong'
}
```

By wrapping your reducer, you maintain control over what is stored in the `result`, without having to bother with the loading state. You just have to provide a type and a reducer function:

``` javascript
const myReducer = (state, action) => {
    if (action.type === 'STUFF_LOAD') {
        return {
            ...state,
            stuff: action.stuff
        };
    }

    return state;
};

const progressReducer = progress('STUFF', myReducer);
```

The progressReducer will only trigger for actions starting with the type you provided. We use namespacing by trailing slash `/`:

```
type = 'ARTICLES';

'ARTICLES/LOAD' will match
'ARTICLES/LOAD' will match
'ARTICLES/PAGE' will match
'NEWS_ARTICLES' will not match
'ARTICLES_LOAD' will not match
'ARTICLE/LOAD' will not match
```

### basicType

In a lot of applications there are similar data types that require a minimum of functionality:

* load an item
* load multiple items
* append new items to the stored items
* clear an item/items

To avoid a lot of *copy pasta* the `redux-utils` package provides a very basic HOR to handle this use case.

Simply provide a type (defaults to `BASIC_DEFAULT`) and an (optional) initial value:

``` javascript
const newsReducer = basicType({
    type: 'NEWS'
}, null);
```

Now you can update the news type by dispatching actions using the type you provided as a namespace:

``` javascript
dispatch({
    type: 'NEWS/LOAD',              // <TYPE>/LOAD
    data: {                         // will always look for a 'data' property
        id: '1',
        title: 'How cool is this?'
    }
});
```

#### Data types

By default the `basicType` HOR will assume you are handling a single item. If you need to handle arrays, set the `dataType` option to `list`:

``` javascript
const newsReducer = basicType({
    type: 'NEWS',
    dataType: 'list',
}, []);
```

Now you can use the same `LOAD` action to set the state:

``` javascript
dispatch({
    type: 'NEWS/LOAD',
    data: [{
        id: '1',
        title: 'How cool is this?'
    }]
});
```

or use the `LOAD_MORE` action to append new items to the state:

``` javascript
dispatch({
    type: 'NEWS/LOAD_MORE',
    data: [{
        id: '2',
        title: 'Need more content.'
    }]
});
```

**Note:**
When you call the `LOAD_MORE` action on a `single` data type, the reducer will fallback to the `LOAD` action, overwriting the state.

#### Progress

You can use the `progress` HOR by setting `progress` to `true` in the settings:

``` javascript
const newsReducer = basicType({
    type: 'NEWS',
    dataType: 'list',
    progress: true,
}, []);
```

You can still dispatch `loading` and `error` states the same way:

``` javascript
dispatch({
    type: 'NEWS/LOAD',
    loading: true,
});
```

### target

The target reducer stores the result of the provided reducer for the provided target in the store.
This way, you can reuse reducer logic and without having to manage an extra layer of complexity.

``` json
{
    filters: {
        search: {...},
        home: {...},
        users: {...}
    }
}
```

The `targetReducer` expects a `type`, `reducer` and optional `initialState` to work:

``` javascript
const filterReducer = targetReducer({ type: 'FILTERS' }, myFilterReducer, {});
```

The `type` will be the namespace verified with the action type.

#### Updating a target

You can update targets by setting the `target` property on the dispatched action:

``` javascript
dispatch({
    type: 'FILTERS/LOAD',
    target: 'search',
    filters: [...],
});
```

The state will be updated accordingly:

``` json
{
    filters: {
        search: [...]
    }
}
```

#### Progress

You can wrap your targets in a `progressReducer` by setting `progress` to `true` in the settings:

``` javascript
const filterReducer = targetReducer({
    type: 'FILTERS',
    progress: true
}, myFilterReducer, {});
```

Now you can dispatch `loading` and `error` states the same as before:

``` javascript
dispatch({
    type: 'FILTERS/LOAD',
    loading: true,
    target: "search"
});
```

The state will be updated accordingly:

``` json
{
    filters: {
        search: {
            loading: true,
            error: null,
            result: null,
            ...
        }
    }
}
```

[js-redux-utils-package]: https://www.npmjs.com/package/@acpaas-ui/js-redux-utils
[js-redux-utils-status]: https://img.shields.io/npm/v/@acpaas-ui/js-redux-utils.svg