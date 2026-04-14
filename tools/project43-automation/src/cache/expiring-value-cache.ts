export class ExpiringValueCache<T> {
  private hasValue = false;
  private value!: T;
  private cachedAt = 0;
  private inFlightLoad: Promise<T> | null = null;

  constructor(private readonly ttlMs: number) {}

  async getOrLoad(loader: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.hasValue && now - this.cachedAt < this.ttlMs) {
      return this.value;
    }

    if (this.inFlightLoad) {
      return this.inFlightLoad;
    }

    this.inFlightLoad = loader()
      .then((nextValue) => {
        this.value = nextValue;
        this.cachedAt = Date.now();
        this.hasValue = true;
        return nextValue;
      })
      .finally(() => {
        this.inFlightLoad = null;
      });

    return this.inFlightLoad;
  }

  clear(): void {
    this.hasValue = false;
    this.cachedAt = 0;
    this.inFlightLoad = null;
  }
}
