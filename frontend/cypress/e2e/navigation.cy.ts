describe('Navigation Tests', () => {
const testPassword = 'password123';

before(() => {
  Cypress.on('window:confirm', () => true);
});


  it('should display the login screen for unauthenticated users', () => {
    cy.visit('/');
    cy.contains('ESO Addon Tracker').should('be.visible');
    cy.contains('Login to manage your addons').should('be.visible');
  });

  it('should navigate to Add New after login', () => {
    const username = `testuser${Date.now()}`;
    cy.register(username, testPassword);

    cy.contains('button', 'Add New').click();
    cy.contains('h2', 'Add New Addon').should('be.visible');
  });

  it('should navigate back to My Addons from Add New', () => {
    const username = `testuser${Date.now()}`;
    cy.register(username, testPassword);

    cy.contains('button', 'Add New').click();
    cy.contains('button', 'My Addons').click();
    
    cy.contains('h2', 'My Collection').should('be.visible');
  });

  it('should switch between Login and Register modes', () => {
    cy.visit('/');
    
    // Should start on Login
    cy.contains('Login to manage your addons').should('be.visible');
    
    // Switch to Register
    cy.contains('button', 'Register').click();
    cy.contains('Create an account to get started').should('be.visible');
    
    // Switch back to Login
    cy.contains('button', 'Login').click();
    cy.contains('Login to manage your addons').should('be.visible');
  });
});