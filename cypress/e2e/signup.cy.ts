describe('Sign Up page', () => {
  const email = 'admin@gmail.com';
  const password = '123456789';

  beforeEach(() => {
    cy.visit('/sign-up', {
      onBeforeLoad(win) {
        win.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });

  it('renders sign-up form', () => {
    cy.get('[data-testid="page-title"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Create');

    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('contain.text', 'Sign Up');
  });

  it('shows validation errors for empty fields', () => {
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('shows error for short password', () => {
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('successfully signs up and redirects to home', () => {
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/');
  });

  it('switches to sign-in page', () => {
    cy.get('[data-testid="switch-to-signin-link"]').click();
    cy.url().should('include', '/sign-in');
  });
});
