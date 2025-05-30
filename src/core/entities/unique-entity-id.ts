import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private readonly value: string;

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  equals(id: UniqueEntityId) {
    return id.value === this.value;
  }
}
