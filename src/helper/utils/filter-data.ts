function filterAndFlatten(data:any) {
    let result = {};
  
    // Iterate through each key in the object
    for (let key in data) {
      if (key === 'id') continue; // Skip 'id' fields
  
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        // Recursively flatten nested objects
        const nestedData = filterAndFlatten(data[key]);
        
        // Merge flattened data into the result object
        result = { ...result, ...nestedData };
      } else {
        // If it's not an object, add the key-value to the result
        result[key] = data[key];
      }
    }
  
    return result;
  }

  