describe('Profile statistic page', () => {
  beforeEach(() => {
    cy.visit('/profile/statistic', {
      onBeforeLoad(win) {
        win.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });

  it('opens statistic page', () => {
    cy.url().should('include', '/profile/statistic');
    cy.get('[data-testid="statistic-page"]').should('exist');
  });

  it('stays on statistic page after reload', () => {
    cy.url().should('include', '/profile/statistic');

    cy.reload();

    cy.location('pathname', { timeout: 10000 }).should('eq', '/profile/statistic');
  });
});
