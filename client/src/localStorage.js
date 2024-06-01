export async function setLocalStorage(discordGuild, key, value) {
  try {
    const currentData = localStorage.getItem(discordGuild) ? JSON.parse(localStorage.getItem(discordGuild)) : {};
    currentData[key] = value;
    const jsonValue = JSON.stringify(currentData);
    localStorage.setItem(discordGuild, jsonValue);
  } catch (error) {
    console.error('Error setting localStorage key:', key, error);
  }
}

export async function getLocalStorage(discordGuild, key) {
  try {
    const jsonValue = localStorage.getItem(discordGuild);
    if (jsonValue) {
      const data = JSON.parse(jsonValue);
      return data[key] !== undefined ? data[key] : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting localStorage key:', key, error);
    return null;
  }
}
