export const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};

export const isObject = (o : Object | Array<any>) => {
    return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

export const isArray = (a : Object | Array<any>) => {
    return Array.isArray(a);
  };