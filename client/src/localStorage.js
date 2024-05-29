export async function setLocalStorage(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error setting localStorage key:', key, error);
    }
}

export async function getLocalStorage(key) {
    try {
        const jsonValue = localStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error getting localStorage key:', key, error);
        return null;
    }
}
