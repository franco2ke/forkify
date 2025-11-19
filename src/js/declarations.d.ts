// Declaration file for Parcel url: imports and other modules

declare module 'url:*' {
  const content: string;
  export default content;
}

declare module 'fractional' {
  export class Fraction {
    constructor(value: number);
    toString(): string;
  }
}
