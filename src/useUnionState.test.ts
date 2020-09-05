import { renderHook, act } from "@testing-library/react-hooks";
import { useUnionState } from "./useUnionState";

type State = { firstName: string; lastName: string; age: number };
type Action =
  | { type: "ChangeFirstName"; value: string }
  | { type: "ChangeLastName"; value: string }
  | { type: "ChangeAge"; value: number };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ChangeFirstName":
      return {
        ...state,
        firstName: action.value,
      };
    case "ChangeLastName":
      return {
        ...state,
        lastName: action.value,
      };
    case "ChangeAge":
      return {
        ...state,
        age: action.value,
      };
    default:
      return state;
  }
};

describe("useUnionState", () => {
  test("first render returns correct initial internal state", () => {
    const age = 25;

    const { result } = renderHook(() =>
      useUnionState(
        { firstName: "Zdzicho", lastName: "Kopacz" },
        { age },
        reducer
      )
    );

    const [state] = result.current;
    expect(state).toEqual({ firstName: "Zdzicho", lastName: "Kopacz" });
  });

  test("second render returns correct modified internal state after actions dispatch", () => {
    const age = 25;

    const { result, rerender } = renderHook(() =>
      useUnionState(
        { firstName: "Zdzicho", lastName: "Kopacz" },
        { age },
        reducer
      )
    );

    const [, dispatch] = result.current;

    act(() => {
      dispatch([
        { type: "ChangeFirstName", value: "Heniu" },
        { type: "ChangeLastName", value: "Majster" },
      ]);
    });

    rerender();

    const [state] = result.current;
    expect(state).toEqual({ firstName: "Heniu", lastName: "Majster" });
  });

  test("array of actions should trigger onChange only once with correct values", () => {
    const onChange = jest.fn();

    const { result } = renderHook(() =>
      useUnionState(
        { firstName: "Zdzicho", lastName: "Kopacz", age: 25 },
        {},
        reducer,
        onChange
      )
    );

    const [, dispatch] = result.current;

    act(() => {
      dispatch([
        { type: "ChangeFirstName", value: "Heniu" },
        { type: "ChangeAge", value: 15 },
      ]);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      firstName: "Heniu",
      age: 15,
    });
  });

  test("action dispatch should call reducer with combined state and correct payload", () => {
    const reducer = jest.fn();
    reducer.mockReturnValue({});

    const { result } = renderHook(() =>
      useUnionState(
        { firstName: "Zdzicho", lastName: "Kopacz" },
        { age: 25 },
        reducer
      )
    );

    const [, dispatch] = result.current;

    act(() => {
      dispatch([{ type: "ChangeFirstName", value: "Heniu" }]);
    });

    expect(reducer).toHaveBeenCalledWith(
      { firstName: "Zdzicho", lastName: "Kopacz", age: 25 },
      { type: "ChangeFirstName", value: "Heniu" }
    );
  });

  test("returns same dispatch reference if external states are shallow equal", () => {
    const { result, rerender } = renderHook(
      externalState =>
        useUnionState({ age: 25 }, { ...externalState }, reducer),
      {
        initialProps: { firstName: "Zdzicho", lastName: "Kopacz" },
      }
    );

    const [, dispatch1] = result.current;
    rerender({ firstName: "Zdzicho", lastName: "Kopacz" });
    const [, dispatch2] = result.current;

    expect(dispatch1).toBe(dispatch2);
  });

  test("returns different dispatch reference if external states are not shallow equal", () => {
    const { result, rerender } = renderHook(
      externalState =>
        useUnionState({ age: 25 }, { ...externalState }, reducer),
      {
        initialProps: { firstName: "Zdzicho", lastName: "Kopacz" },
      }
    );

    const [, dispatch1] = result.current;
    rerender({ firstName: "Zdzicho", lastName: "Kopacz2" });
    const [, dispatch2] = result.current;

    expect(dispatch1).not.toBe(dispatch2);
  });
});
