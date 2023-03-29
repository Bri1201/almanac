module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
  ) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username must not be empty';
    }
    if (email.trim() === '') {
      errors.email = 'Email must not be empty';
    } else {
      const regexstudent = /[A-Za-z0-9]+\.[A-Za-z]+[0-9]+@vitstudent\.ac\.in$/;
      const regexprof = /[A-Za-z0-9]+\.[A-Za-z]+[0-9]+@vit\.ac\.in$/;
      const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
        if(!(email.match(regexprof) && email.match(regexstudent))){
          errors.email("Your email does not belong to the organisation. Please register with your official email")
        }
      }
    }
    if (password === '') {
      errors.password = 'Password must not empty';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };
  
  module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
      errors.password = 'Password must not be empty';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };