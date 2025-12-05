describe('ProfileInfoAndStatisticPage', () => {
  beforeEach(() => {
    cy.visit('/profile-info-and-statistic');
  });

  it('should display the profile page by default', () => {
    cy.get('.profile-info').should('exist');
  });

  it('should switch between tabs correctly', () => {
    cy.get('.segment-control').click();
    cy.get('.statistic').should('be.visible');
    cy.get('.segment-control').click();
    cy.get('.profile-info').should('exist');
  });

  it('should preserve state on page reload', () => {
    cy.get('.segment-control').click();
    cy.get('.statistic').should('be.visible');
    cy.reload();
    cy.get('.statistic').should('be.visible');
  });
});
