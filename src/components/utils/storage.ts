export class StorageService {
  private keyPrefix: string;

  constructor(prefix: string = 'app_') {
    this.keyPrefix = prefix;
  }

  public save<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.keyPrefix + key, serializedData);
    } catch (error) {
      console.error('Error saving data to localStorage', error);
    }
  }

  public load<T>(key: string): T | null {
    try {
      const serializedData = localStorage.getItem(this.keyPrefix + key);
      if (serializedData) {
        return JSON.parse(serializedData) as T;
      }
    } catch (error) {
      console.error('Error loading data from localStorage', error);
    }
    return null;
  }

  public delete(key: string): void {
    try {
      localStorage.removeItem(this.keyPrefix + key);
    } catch (error) {
      console.error('Error deleting data from localStorage', error);
    }
  }
}
