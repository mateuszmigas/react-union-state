type ObjectWithKeys = { [key: string]: unknown };

export const overrideDefinedPropsOnly = <
  TResult,
  T1 extends ObjectWithKeys,
  T2 extends ObjectWithKeys
>(
  left: T1,
  right: T2
): TResult => {
  let result: ObjectWithKeys = { ...left };

  for (const key of Object.keys(right)) {
    const val = right[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }

  return (result as unknown) as TResult;
};

export const omitKeys = <T extends ObjectWithKeys>(
  obj: T,
  keys: string[]
): Partial<T> =>
  Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((result, key: string) => {
      Object.assign(result, { [key]: obj[key] });
      return result;
    }, {} as T);

export const overriddenProps = <T extends ObjectWithKeys>(
  left: Partial<T>,
  right: Partial<T>
) =>
  [...Object.keys(left), ...Object.keys(right)].reduce(
    (result, objectKey: PropertyKey) => {
      const key = objectKey as keyof T;

      if (left[key] !== right[key]) {
        result[key] = right[key];
      }
      return result;
    },
    {} as Partial<T>
  );

export const areShallowEqual = <
  T1 extends ObjectWithKeys,
  T2 extends ObjectWithKeys
>(
  left: T1,
  right: T2
) => {
  const keysLeft = Object.keys(left);
  const keysRight = Object.keys(right);

  if (keysLeft.length !== keysRight.length) {
    return false;
  }

  for (let key of keysLeft) {
    if (left[key] !== right[key]) {
      return false;
    }
  }

  return true;
};
