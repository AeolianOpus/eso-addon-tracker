declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>;
    register(username: string, password: string): Chainable<void>;
  }
}