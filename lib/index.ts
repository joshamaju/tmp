import { dual } from "effect/Function";
import * as Option from "effect/Option";

import * as internal from "./core";
import { IterableField, StructField } from "./core";

export const string = dual<
  (name: string) => (search: URLSearchParams) => Option.Option<string>,
  (search: URLSearchParams, name: string) => Option.Option<string>
>(2, (search, name) => internal.string(search, name));

export const number = dual<
  (name: string) => (search: URLSearchParams) => Option.Option<number>,
  (search: URLSearchParams, name: string) => Option.Option<number>
>(2, (search, name) => internal.number(search, name));

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
>(2, (search, input) => internal.struct(search, input));

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
>(3, (search, name, schema) => internal.array(search, name, schema));

export const map = dual<
  <A, B>(
    f: (a: A) => B
  ) => (
    self: (search: URLSearchParams, name: string) => Option.Option<A>
  ) => (search: URLSearchParams, name: string) => Option.Option<B>,
  <A, B>(
    self: (search: URLSearchParams, name: string) => Option.Option<A>,
    f: (a: A) => B
  ) => (search: URLSearchParams, name: string) => Option.Option<B>
>(2, (self, f) => internal.map(self, f));

export const flatMap = dual<
  <A, B>(
    f: (a: A) => Option.Option<B>
  ) => (
    self: (search: URLSearchParams, name: string) => Option.Option<A>
  ) => (search: URLSearchParams, name: string) => Option.Option<B>,
  <A, B>(
    self: (search: URLSearchParams, name: string) => Option.Option<A>,
    f: (a: A) => Option.Option<B>
  ) => (search: URLSearchParams, name: string) => Option.Option<B>
>(2, (self, f) => internal.flatMap(self, f));

export const orElse = dual<
  <A, B>(
    f: () => Option.Option<B>
  ) => (
    self: (search: URLSearchParams, name: string) => Option.Option<A>
  ) => (search: URLSearchParams, name: string) => Option.Option<A | B>,
  <A, B>(
    self: (search: URLSearchParams, name: string) => Option.Option<A>,
    f: () => Option.Option<B>
  ) => (search: URLSearchParams, name: string) => Option.Option<A | B>
>(2, (self, f) => internal.orElse(self, f));

export const getOrElse = dual<
  <A, B>(
    f: () => B
  ) => (
    self: (search: URLSearchParams, name: string) => Option.Option<A>
  ) => (search: URLSearchParams, name: string) => A | B,
  <A, B>(
    self: (search: URLSearchParams, name: string) => Option.Option<A>,
    f: () => B
  ) => (search: URLSearchParams, name: string) => A | B
>(2, (self, f) => internal.getOrElse(self, f));
