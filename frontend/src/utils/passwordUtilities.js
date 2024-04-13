export const togglePasswordVisibility = (visiblePasswords, setId) => {
    return {
      ...visiblePasswords,
      [setId]: !visiblePasswords[setId]
    };
  };
  
  export const handleCopyToClipboard = (password) => {
    navigator.clipboard.writeText(password).then(() => {
      alert('Password copied to clipboard!');
    }, (err) => {
      console.error('Could not copy password: ', err);
    });
  };
  