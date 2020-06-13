const isNonemptyArray = (value: any): boolean => Array.isArray(value) && Boolean(value.length);

export default isNonemptyArray;
