// Replaces the `server-only` package in unit tests. The real module throws
// when imported outside a server bundle; here the import is a no-op.
export {};
