describe('Sign In page', () => {
  const email = 'helena.hills@social.com';
  const password = 'password789';

  beforeEach(() => {
    cy.visit('/sign-in', {
      onBeforeLoad(win) {
        win.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });

  it('renders sign-in form', () => {
    cy.get('[data-testid="auth-page"]').should('exist');
    cy.get('[data-testid="auth-form"]').should('exist');

    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
  });

  it('successfully signs in and redirects to home', () => {
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/');
  });
});
