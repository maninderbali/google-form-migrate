export class StorageService {
    constructor(prefix = 'app_') {
        this.keyPrefix = prefix;
    }
    save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this.keyPrefix + key, serializedData);
        }
        catch (error) {
            console.error('Error saving data to localStorage', error);
        }
    }
    load(key) {
        try {
            const serializedData = localStorage.getItem(this.keyPrefix + key);
            if (serializedData) {
                return JSON.parse(serializedData);
            }
        }
        catch (error) {
            console.error('Error loading data from localStorage', error);
        }
        return null;
    }
    delete(key) {
        try {
            localStorage.removeItem(this.keyPrefix + key);
        }
        catch (error) {
            console.error('Error deleting data from localStorage', error);
        }
    }
}
