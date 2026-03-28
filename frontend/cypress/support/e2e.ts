import './commands';

// Intercept all confirm dialogs globally - prevents popups from appearing
Cypress.on('window:before:load', (win) => {
  cy.stub(win, 'confirm').returns(true);
});