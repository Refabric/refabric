export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray;
}
export type JsonArray = Array<string | number | boolean | Date | Json | JsonArray>
