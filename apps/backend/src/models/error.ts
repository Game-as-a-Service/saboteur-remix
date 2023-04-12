export type ErrorFactory = <const Name extends string>(
  name: Name
) => (message: string) => Error & { name: Name };
