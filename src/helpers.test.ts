import {
  overrideDefinedPropsOnly,
  omitKeys,
  overriddenProps,
  areShallowEqual,
} from "./helpers";

describe("overlapDefinedProps", () => {
  test("returns new object reference", () => {
    const left = { firstName: "Zdzicho" };
    const right = { firstName: "Heniu" };

    const result = overrideDefinedPropsOnly(left, right);

    expect(result).not.toBe(left);
    expect(result).not.toBe(right);
  });

  test("right props overrides left props", () => {
    const result = overrideDefinedPropsOnly(
      {
        firstName: "Zdzicho",
        lastName: "Kopacz",
      },
      { firstName: "Heniu", age: 25 }
    );

    expect(result).toEqual({
      firstName: "Heniu",
      lastName: "Kopacz",
      age: 25,
    });
  });

  test("right undefined props don't overlap left defined", () => {
    const result = overrideDefinedPropsOnly(
      {
        firstName: "Zdzicho",
      },
      { firstName: undefined }
    );

    expect(result).toEqual({
      firstName: "Zdzicho",
    });
  });
});

describe("omitKeys", () => {
  test("returns new object reference", () => {
    const obj = { firstName: "Zdzicho" };

    const result = omitKeys(obj, ["country"]);

    expect(result).not.toBe(obj);
  });

  test("removes props correctly", () => {
    const result = omitKeys(
      {
        firstName: "Heniu",
        lastName: "Kopacz",
        age: 25,
      },
      ["firstName", "age", "country"]
    );

    expect(result).toEqual({
      lastName: "Kopacz",
    });
  });
});

describe("overriddenProps", () => {
  test("returns new object reference", () => {
    const left = { firstName: "Zdzicho" };
    const right = { firstName: "Heniu" };

    const result = overriddenProps(left, right);

    expect(result).not.toBe(left);
    expect(result).not.toBe(right);
  });

  test("returns object with right props overriding left props", () => {
    const result = overriddenProps(
      {
        firstName: "Zdzicho",
        lastName: "Kopacz",
        age: 25,
        country: "Poland",
      },
      {
        firstName: "Heniu",
        lastName: "Kopacz",
        age: 25,
        country: "Russia",
      }
    );

    expect(result).toEqual({
      firstName: "Heniu",
      country: "Russia",
    });
  });
});

describe("areShallowEqual", () => {
  test("returns true if all props are reference equal", () => {
    const country = { name: "Poland" };
    const result = areShallowEqual(
      {
        firstName: "Zdzicho",
        age: 25,
        country,
      },
      {
        firstName: "Zdzicho",
        age: 25,
        country,
      }
    );

    expect(result).toBeTruthy();
  });

  test.each([
    [
      {
        firstName: "Zdzicho",
      },
      {
        firstName: "Zdzicho2",
      },
    ],
    [
      {
        country: { name: "Poland" },
      },
      {
        country: { name: "Poland" },
      },
    ],
  ])(
    "returns false if any of the props are not reference equal (%o, %o)",
    (left, right) => {
      expect(areShallowEqual(left, right)).toBeFalsy();
    }
  );

  test("returns false if different amount of props", () => {
    const result = areShallowEqual(
      {
        firstName: "Zdzicho",
      },
      {
        firstName: "Zdzicho",
        lastName: "Kopacz",
      }
    );

    expect(result).toBeFalsy();
  });
});
