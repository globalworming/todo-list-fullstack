import React from 'react';
import ErrorDisplayBoundary from '../../src/context/ErrorContext';
import ShowsErrorFromContext from '../../src/components/ShowsErrorFromContext';
import SaveList from '../../src/components/SaveList';

describe('compliance', () => {
  describe('Save List', () => {
    it('shows error when list is empty', () => {
      cy.mount(
        <ErrorDisplayBoundary>
          <SaveList toDoList={undefined} />
          <ShowsErrorFromContext />
        </ErrorDisplayBoundary>,
      );
      cy.get('[data-testid="save-list"]').click();
      cy.get('div[role="alert"]').should('exist');
    });
    xit('shows error when name already exists', () => {
      cy.intercept('POST', '/toDoLists', {
        statusCode: 400, body: { message: 'error validating ToDoList', errors: [{ path: '$.name', error: 'already exist' }] },
      });
      // TODO
    });
  });
});
