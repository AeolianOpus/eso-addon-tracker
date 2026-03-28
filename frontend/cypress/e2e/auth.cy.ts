describe('Authentication Flow', () => {
const testPassword = 'password123';

// Auto-accept ALL confirm dialogs for this entire test suite
before(() => {
  Cypress.on('window:confirm', () => true);
});

beforeEach(() => {
  cy.visit('/');
});


  describe('Register', () => {
    it('should register a new user successfully', () => {
      const username = `testuser${Date.now()}`;

      // Switch to Register
      cy.contains('button', 'Register').click();
      
      cy.get('#username').type(username);
      cy.get('#password').type(testPassword);
      cy.get('#confirmPassword').type(testPassword);
      cy.get('button[type="submit"]').contains('Register').click();

      // Should be logged in after registration
      cy.contains('button', 'Logout').should('be.visible');
    });

    it('should show validation error for password mismatch', () => {
      const username = `testuser${Date.now()}`;

      cy.contains('button', 'Register').click();
      cy.get('#username').type(username);
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('different');
      cy.get('button[type="submit"]').contains('Register').click();

      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should show error for duplicate username', () => {
      const username = `testuser${Date.now()}`;

      // Register first time
      cy.register(username, testPassword);
      
      // Logout
      cy.contains('button', 'Logout').click();

      // Try to register again with same username
      cy.contains('button', 'Register').click();
      cy.get('#username').type(username);
      cy.get('#password').type(testPassword);
      cy.get('#confirmPassword').type(testPassword);
      cy.get('button[type="submit"]').contains('Register').click();

      cy.contains('Username already exists').should('be.visible');
    });
  });

  describe('Login', () => {
    it('should login successfully with valid credentials', () => {
      const username = `testuser${Date.now()}`;
      cy.register(username, testPassword);

      // Logout
      cy.contains('button', 'Logout').click();

      // Make sure we're on Login screen (not Register)
      cy.get('body').then($body => {
        if ($body.text().includes('Create an account')) {
          cy.contains('button', 'Login').click();
        }
      });

      // Login again
      cy.get('#username').type(username);
      cy.get('#password').type(testPassword);
      cy.get('button[type="submit"]').click();

      cy.contains('button', 'Logout').should('be.visible');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', () => {
      const username = `testuser${Date.now()}`;
      cy.register(username, testPassword);

      cy.contains('button', 'Logout').click();

      // Should be back to auth screen
      cy.contains('ESO Addon Tracker').should('be.visible');

      // Make sure we're on Login screen (not Register)
      cy.get('body').then($body => {
        if ($body.text().includes('Create an account')) {
          cy.contains('button', 'Login').click();
        }
      });

      // Now verify we're on login screen
      cy.contains('Login to manage your addons').should('be.visible');
      cy.get('#username').should('be.visible');
    });
  });
});