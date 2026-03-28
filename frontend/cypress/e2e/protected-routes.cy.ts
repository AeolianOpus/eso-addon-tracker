describe('Protected Routes', () => {
const testPassword = 'password123';

before(() => {
  Cypress.on('window:confirm', () => true);
});


  it('should show login screen when not authenticated', () => {
    cy.visit('/');
    cy.contains('Login to manage your addons').should('be.visible');
    cy.contains('button', 'My Addons').should('not.exist');
  });

  it('should access addon pages when logged in', () => {
    const username = `testuser${Date.now()}`;
    cy.register(username, testPassword);

    // Should see the main app
    cy.contains('button', 'My Addons').should('be.visible');
    cy.contains('button', 'Add New').should('be.visible');
    cy.contains('h2', 'My Collection').should('be.visible');
  });

  it('should redirect to login after logout', () => {
    const username = `testuser${Date.now()}`;
    cy.register(username, testPassword);

    // Should be on main app
    cy.contains('h2', 'My Collection').should('be.visible');

    // Logout
    cy.contains('button', 'Logout').click();

    // Should be back to auth screen
    cy.contains('ESO Addon Tracker').should('be.visible');

    // Make sure we're on Login screen (not Register)
    cy.get('body').then($body => {
      if ($body.text().includes('Create an account')) {
        cy.contains('button', 'Login').click();
      }
    });

    // Verify we're on login screen
    cy.contains('Login to manage your addons').should('be.visible');
    cy.contains('button', 'My Addons').should('not.exist');
  });

  it('should maintain session on page refresh when logged in', () => {
    const username = `testuser${Date.now()}`;
    cy.register(username, testPassword);

    // Refresh the page
    cy.reload();

    // Should still be logged in
    cy.contains('button', 'Logout').should('be.visible');
  });
});