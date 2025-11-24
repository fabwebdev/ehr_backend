class TrimStrings {
  constructor() {
    // The names of the attributes that should not be trimmed
    this.except = [
      'current_password',
      'password',
      'password_confirmation',
    ];
  }
}

export default TrimStrings;