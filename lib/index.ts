import { dual } from "effect/Function";
import * as Option from "effect/Option";

import * as core from "./core";
import { IterableField, StructField } from "./core";

export const string = dual<
  (name: string) => (search: URLSearchParams) => Option.Option<string>,
  (search: URLSearchParams, name: string) => Option.Option<string>
>(2, (search, name) => core.string(search, name));

export const number = dual<
  (name: string) => (search: URLSearchParams) => Option.Option<number>,
  (search: URLSearchParams, name: string) => Option.Option<number>
>(2, (search, name) => core.number(search, name));

export const struct = dual<
  <I extends Record<string, StructField<any>>>(
    input: I
  ) => (search: URLSearchParams) => {
    [K in keyof I]: I[K] extends StructField<infer T> ? T : I[K];
  },
  <I extends Record<string, StructField<any>>>(
    search: URLSearchParams,
    input: I
  ) => {
    [K in keyof I]: I[K] extends StructField<infer T> ? T : I[K];
  }
>(2, (search, input) => core.struct(search, input));

// @ts-expect-error
export const array = dual<
  <I, T>(
    name: string,
    schema: IterableField<I, T>
  ) => (search: URLSearchParams) => Option.Option<Array<T>>,
  <I, T>(
    search: URLSearchParams,
    name: string,
    schema: IterableField<I, T>
  ) => Option.Option<Array<T>>
>(3, (search, name, schema) => core.array(search, name, schema));

export const map = dual<
  <A, B>(
    f: (a: A) => B
  ) => (self: (search: URLSearchParams) => A) => (search: URLSearchParams) => B,
  <A, B>(
    self: (search: URLSearchParams) => A,
    f: (a: A) => B
  ) => (search: URLSearchParams) => B
>(2, (self, f) => core.map(self, f));

export const flatMap = dual<
  <A, B>(
    f: (a: A) => Option.Option<B>
  ) => (
    self: (search: URLSearchParams) => Option.Option<A>
  ) => (search: URLSearchParams) => Option.Option<B>,
  <A, B>(
    self: (search: URLSearchParams) => Option.Option<A>,
    f: (a: A) => Option.Option<B>
  ) => (search: URLSearchParams) => Option.Option<B>
>(2, (self, f) => core.flatMap(self, f));

export const orElse = dual<
  <A, B>(
    f: () => Option.Option<B>
  ) => (
    self: (search: URLSearchParams) => Option.Option<A>
  ) => (search: URLSearchParams) => Option.Option<A | B>,
  <A, B>(
    self: (search: URLSearchParams) => Option.Option<A>,
    f: () => Option.Option<B>
  ) => (search: URLSearchParams) => Option.Option<A | B>
>(2, (self, f) => core.orElse(self, f));

export const getOrElse = dual<
  <A, B>(
    f: () => B
  ) => (
    self: (search: URLSearchParams) => Option.Option<A>
  ) => (search: URLSearchParams) => A | B,
  <A, B>(
    self: (search: URLSearchParams) => Option.Option<A>,
    f: () => B
  ) => (search: URLSearchParams) => A | B
>(2, (self, f) => core.getOrElse(self, f));

export const getOrNull: <A>(
  self: (search: URLSearchParams) => Option.Option<A>
) => (search: URLSearchParams) => A | null = (self) => core.getOrNull(self);
