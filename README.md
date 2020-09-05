# React union state

This is a helper hook that solves the problem of controlled vs uncontrolled state when creating reusable components. Imagine you are creating a dropdown. In some cases, you want to make it easy to be used by controlling the selected item inside the component. Other times you want to give the power of controlling selected item to the component that will be using your component. With this hook, you can reuse all of your code and just pass "selectedItem" as an external state to expose it.

## How it works

```js
const [internalState, dispatch] = useUnionState(
  initialInternalState,
  externalState,
  reducer,
  onChange
);
```

state = internalState + externalState

| Param                  | Description                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `initialInternalState` | Initial values for part of the state that will be controlled by the hook                                         |
| `externalState`        | Current values of part of the state that will be controlled by the Component                                     |
| `reducer`              | Custom reducer that will be used to reduce state (union of internal and external)                                |
| `onChange`             | (Optional) Callback that will be invoked when state is changin. Use it to update externalState in your Component |
| `internalState`        | Current values of part of state controlled by the hook                                                           |
| `dispatch`             | Method to call when you want to modify state                                                                     |

## Features

- common reducer for the state
- batched state updates for both internal and external
- redux-like state management. Just create your own reducer and dispatch your own actions

## How to use it

```JSX
export const MyComponent = () => {
    const [age, setAge] = React.useState(25);

    //common reducer
    const reducer = (state, action) => {
        if (action.type === "ChangeAge") {
            return {
                ...state,
                age: action.payload.value,
            };
        else if (action.type === "ChangeFirstName") {
            return {
                ...state,
                firstName: action.payload.value,
            };
        }
        else return state;
    };

    //update external state
    const onChange = changes => {
        if (changes.age !== undefined) {
            setAge(changes.age);
        }
    };

    const [internalState, dispatch] = useUnionState(
        { firstName: "Zdzicho", lastName: "Kopacz" },
        { age },
        reducer,
        onChange
    );

    return (
        <div>
            <div>{internalState.firstName}</div>
            <div>{internalState.lastName}</div>
            <div>{age}</div>
            <Button onClick={() => dispatch([{type: "ChangeAge", value: 30 }])}></Button>
            <Button onClick={() => dispatch([{type: "ChangeFirstName", value: "Heniu" }])}></Button>
        </div>
    );
}
```

## Installation

https://www.npmjs.com/package/@mateuszmigas/react-union-state

`npm i @mateuszmigas/react-union-state`

or

`yarn add @mateuszmigas/react-union-state`

## License

[MIT](https://choosealicense.com/licenses/mit/)
