import { isArray, isObject } from "./array.helper";

export function camelCaseKeysToUnderscore(obj: { [key: string]: any }) {
    if (typeof (obj) != "object") return obj;

    for (var oldName in obj) {

        // Camel to underscore
        const newName = oldName.replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });

        // Only process if names are different
        if (newName != oldName) {
            // Check for the old property name to avoid a ReferenceError in strict mode.
            if (obj.hasOwnProperty(oldName)) {
                obj[newName] = obj[oldName];
                delete obj[oldName];
            }
        }

        // Recursion
        if (typeof (obj[newName]) == "object") {
            obj[newName] = camelCaseKeysToUnderscore(obj[newName]);
        }

    }
    return obj;
}

export const toCamelCase = (s: string) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

export const underscoreKeysToCamelCase = async<T>(o: any) : Promise<T> => {
    if (isObject(o)) {
        const n  = {} as T;

        Object.keys(o).forEach((k) => {
            // return n[toCamelCase(k)] = underscoreKeysToCamelCase(o[k])
        });

        return n;
    } else if (isArray(o)) {
        return o.map((i: any) => underscoreKeysToCamelCase(i));
    }

    return o;
};


export type CamelizeString<ObjectProperty extends string> =
  ObjectProperty extends `${infer F}_${infer R}`
  ? `${F}${CamelizeString<Capitalize<R>>}`
  : ObjectProperty;

export type Camelize<GenericObject> = {
  [ObjectProperty in keyof GenericObject as CamelizeString<ObjectProperty & string>]:
    GenericObject[ObjectProperty] extends Array<infer ArrayItem>
    ? ArrayItem extends Record<string, unknown>
      ? Array<Camelize<ArrayItem>>
      : GenericObject[ObjectProperty]
    : GenericObject[ObjectProperty] extends Record<string, unknown>
      ? Camelize<GenericObject[ObjectProperty]>
      : GenericObject[ObjectProperty];
};