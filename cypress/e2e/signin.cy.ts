describe('end-to-end tests for sign-in page', () => {
  const email = 'helena.hills@social.com';
  const password = 'password789';

  beforeEach(() => {
    cy.visit('http://localhost:3000/signin', {
      onBeforeLoad(window) {
        window.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });

  it('shows sign-in form', () => {
    cy.get('.email-input').should('be.visible');
    cy.get('.password-input').should('be.visible');
    cy.get('.submit-auth-button').should('contain.text', 'Sign In');

    cy.screenshot('sign-in-form-initial');
  });

  it('shows notifications for empty fields', () => {
    cy.get('.submit-auth-button').click();

    cy.get('.auth-error-message').should('contain.text', 'Input email please');
    cy.get('.auth-error-message').should('contain.text', 'Input password please');

    cy.screenshot('sign-in-form-empty-fields-error');
  });

  it('shows notification for short password', () => {
    cy.get('.email-input').type(email);
    cy.get('.password-input').type('123');
    cy.get('.submit-auth-button').click();

    cy.get('.auth-error-message').should(
      'contain.text',
      'Your password must be longer than 6 symbols',
    );

    cy.screenshot('sign-in-form-short-password-error');
  });

  it('successfully signs in with valid credentials', () => {
    cy.get('.email-input').type(email);
    cy.get('.password-input').type(password);
    cy.get('.submit-auth-button').click();

    cy.url().should('eq', 'http://localhost:3000/');

    cy.screenshot('sign-in-success-redirect');
  });

  it('switches to sign-up page by switch link', () => {
    cy.contains('p a', 'Sign up').click();
    cy.url().should('include', '/signup');

    cy.screenshot('sign-up-page-after-switch');
  });

  it('resets form when switching pages', () => {
    cy.get('.email-input').type('test@gmail.com');
    cy.get('.password-input').type('test123');

    cy.contains('p a', 'Sign up').click();
    cy.url().should('include', '/signup');

    cy.contains('p a', 'Sign in').click();
    cy.url().should('include', '/signin');

    cy.get('.email-input').should('have.value', '');
    cy.get('.password-input').should('have.value', '');
  });

  it('navigates to home page after successful login and back button', () => {
    cy.get('.email-input').type(email);
    cy.get('.password-input').type(password);
    cy.get('.submit-auth-button').click();

    cy.url().should('eq', 'http://localhost:3000/');
  });
});
