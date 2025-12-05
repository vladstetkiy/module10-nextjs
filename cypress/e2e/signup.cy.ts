describe('end-to-end tests for sign-up page', () => {
  const email = 'admin@gmail.com';
  const password = '123456789';
  beforeEach(() => {
    cy.visit('http://localhost:3000/signup', {
      onBeforeLoad(window) {
        window.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });
  it('shows sign-up form', () => {
    cy.contains('h2', 'Create an account').should('be.visible');
    cy.get('.email-input').should('be.visible');
    cy.get('.password-input').should('be.visible');
    cy.get('.submit-auth-button').should('contain.text', 'Sign Up');

    cy.screenshot('sign-up-form-initial');
  });

  it('shows notifications for empty fields', () => {
    cy.get('.submit-auth-button').click();

    cy.get('.auth-error-message').should('contain.text', 'Input email please');
    cy.get('.auth-error-message').should('contain.text', 'Input password please');

    cy.screenshot('sign-up-form-empty-fields-error');
  });

  it('shows notification for short password', () => {
    cy.get('.email-input').type(email);
    cy.get('.password-input').type('123');
    cy.get('.submit-auth-button').click();

    cy.get('.auth-error-message').should(
      'contain.text',
      'Your password must be longer than 6 symbols',
    );

    cy.screenshot('sign-up-form-short-password-error');
  });

  it('signs up with valid data', () => {
    cy.get('.email-input').type(email);
    cy.get('.password-input').type(password);
    cy.get('.submit-auth-button').click();

    cy.url().should('include', '/');

    cy.screenshot('sign-up-success-redirect');
  });

  it('switches to sign-in page by switch link', () => {
    cy.contains('p a', 'Sign in').click();
    cy.url().should('include', '/signin');

    cy.screenshot('sign-in-page-after-switch');
  });
});
