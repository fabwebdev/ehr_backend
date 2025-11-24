// Utility functions for database operations

// Convert comma-separated string to array
export const stringToArray = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim()).filter(item => item !== '');
};

// Convert array to comma-separated string
export const arrayToString = (arr) => {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(',');
};

// Handle many-to-many relationship sync
export const syncAssociations = async (modelInstance, associationData, associationName) => {
  try {
    if (associationData && Array.isArray(associationData)) {
      await modelInstance[associationName].sync(associationData);
    }
  } catch (error) {
    console.error(`Error syncing ${associationName}:`, error);
    throw error;
  }
};