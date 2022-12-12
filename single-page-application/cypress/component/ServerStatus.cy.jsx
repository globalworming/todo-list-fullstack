import React from 'react';
import ServerStatus from '../../src/components/ServerStatus';

describe('where se see server status', () => {
  it('shows ok', () => {
    cy.intercept('GET', '/health', {
      statusCode: 200, body: { services: [{ name: 'bff', serving: true }, { name: 'todo', serving: true }] },
    });
    cy.mount(<ServerStatus url="/health" />);
    cy.get('span').should('contain.text', 'bff ok');
    cy.get('span').should('contain.text', 'todo ok');
  });
  it('shows it is not connected', () => {
    cy.mount(<ServerStatus url="/noSuchEndpoint" />);
    cy.get('span').should('contain.text', 'disconnected');
  });
});
