import * as Schema from "@effect/schema/Schema";
import * as Option from "effect/Option";
import * as RRecord from "effect/ReadonlyRecord";

import qs from "qs";

export type StructField<T> = (search: URLSearchParams, name: string) => T;

export type IterableField<I, T> = Schema.Schema<I, T>;

export const string = (search: URLSearchParams, name: string) => {
  return Option.fromNullable(search.get(name));
};

export const number = (search: URLSearchParams, name: string) => {
  return Option.flatMap(string(search, name), (_) => {
    const r = Number.parseFloat(_);
    if (Number.isNaN(r)) return Option.none();
    return Option.some(r);
  });
};

export const integer = (search: URLSearchParams, name: string) => {
  return Option.map(number(search, name), Math.round);
};

export const struct = <I extends Record<string, StructField<any>>>(
  search: URLSearchParams,
  input: I
): {
  [K in keyof I]: I[K] extends StructField<infer T> ? T : I[K];
} => {
  // @ts-expect-error
  return RRecord.map(input, (v, k) => v(search, k));
};

export const object = (search: URLSearchParams, name: string) => {
  return Option.flatMap(string(search, name), (_) =>
    Schema.parseOption(Schema.object)(qs.parse(_))
  );
};

export const array = (
  search: URLSearchParams,
  name: string,
  schema: IterableField<any, any>
) => {
  return Option.flatMap(string(search, name), (_) =>
    Schema.parseOption(Schema.array(schema))(_.split(","))
  );
};

export const map =
  <A, B>(self: (search: URLSearchParams) => A, f: (a: A) => B) =>
  (search: URLSearchParams) =>
    f(self(search));

export const flatMap =
  <A, B>(
    self: (search: URLSearchParams) => Option.Option<A>,
    f: (a: A) => Option.Option<B>
  ) =>
  (search: URLSearchParams) =>
    Option.flatMap(self(search), f);

export const orElse =
  <A, B>(
    self: (search: URLSearchParams) => Option.Option<A>,
    f: () => Option.Option<B>
  ) =>
  (search: URLSearchParams) =>
    Option.orElse(self(search), f);

export const getOrElse =
  <A, B>(self: (search: URLSearchParams) => Option.Option<A>, f: () => B) =>
  (search: URLSearchParams) =>
    Option.getOrElse(self(search), f);

export const getOrNull =
  <A>(self: (search: URLSearchParams) => Option.Option<A>) =>
  (search: URLSearchParams) =>
    Option.getOrNull(self(search));
