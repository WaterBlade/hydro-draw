export abstract class Builder<T, U, P> {
  constructor(protected struct: T, protected specs: U, protected figures: P) {}
}