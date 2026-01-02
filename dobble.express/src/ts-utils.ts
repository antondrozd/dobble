export type Cortege<
  T,
  Length extends number,
  Result extends unknown[] = []
> = Result["length"] extends Length
  ? Result
  : Cortege<T, Length, [...Result, T]>;
