export type ErrorFactory = <Name extends string>(
  name: Name
) => (message: string) => Error & { name: Name };
