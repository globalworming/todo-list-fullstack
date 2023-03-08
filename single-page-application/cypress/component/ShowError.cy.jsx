import React from 'react';
import ErrorDisplayBoundary from '../../src/context/ErrorContext';
import ShowsErrorFromContext from '../../src/components/ShowsErrorFromContext';
import PutErrorInContext from '../../src/components/PutErrorInContext';

describe('compliance', () => {
  describe('errors', () => {
    it('shows error', () => {
      cy.mount(
        <ErrorDisplayBoundary>
          <PutErrorInContext error={new Error('unexpected error')} />
          <ShowsErrorFromContext />
        </ErrorDisplayBoundary>,
      );
      cy.get('div').should('contain.text', 'unexpected error');
      cy.get('button').should('contain.text', 'dismiss');
    });
    it('can be dismissed', () => {
      cy.mount(
        <ErrorDisplayBoundary>
          <PutErrorInContext error={new Error('unexpected error')} />
          <ShowsErrorFromContext />
        </ErrorDisplayBoundary>,
      );
      cy.get('div[role="alert"]').should('exist');
      cy.get('button').click();
      cy.get('div[role="alert"]').should('not.exist');
    });
  });
});
