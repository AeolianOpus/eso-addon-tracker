Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  
  // If we see logout button, we're already logged in, logout first
  cy.get('body').then($body => {
    if ($body.text().includes('Logout')) {
      cy.contains('button', 'Logout').click();
      cy.wait(500);
    }
  });
  
  // Now login
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  
  // Wait for successful login
  cy.contains('button', 'Logout').should('be.visible');
});

Cypress.Commands.add('register', (username: string, password: string) => {
  cy.visit('/');
  
  // If we see logout button, we're already logged in, logout first
  cy.get('body').then($body => {
    if ($body.text().includes('Logout')) {
      cy.contains('button', 'Logout').click();
      cy.wait(500);
    }
  });
  
  // Switch to Register mode
  cy.contains('button', 'Register').click();
  
  // Fill in registration form
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#confirmPassword').type(password);
  cy.get('button[type="submit"]').contains('Register').click();
  
  // After registration, should be logged in automatically
  cy.contains('button', 'Logout').should('be.visible');
});