import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

class UserFactory {
  /**
   * Define the model's default state.
   *
   * @return {Object}
   */
  definition() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      email_verified_at: new Date(),
      password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      remember_token: this.generateRandomString(10),
    };
  }

  /**
   * Generate a random string of specified length
   *
   * @param {Number} length
   * @return {String}
   */
  generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Indicate that the model's email address should be unverified.
   *
   * @return {Object}
   */
  unverified() {
    return {
      email_verified_at: null,
    };
  }

  /**
   * Apply state transformations to the model.
   *
   * @param {Function} callback
   * @return {Object}
   */
  state(callback) {
    return callback(this.definition());
  }
}

export default new UserFactory();