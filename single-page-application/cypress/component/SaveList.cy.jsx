import React from 'react';
import App from '../../src/App';

describe('where we save a todo list', () => {
  it('shows error when list is empty', () => {
    cy.intercept('POST', '/toDoLists', {
      statusCode: 400, body: { message: 'error validating ToDoList', errors: [{ path: '$.toDos', error: 'is empty' }] },
    });
    // cy.mount(<App />);
    // TODO set name "some name" of list
    // we know there will be an input with className "set-name"
    // TODO click "save"
    // we know that there will be some kind of button className "save-list"
    // then we should see error message
  });

  it('list name already exists', () => {
    cy.intercept('POST', '/toDoLists', {
      statusCode: 400, body: { message: 'error validating ToDoList', errors: [{ path: '$.name', error: 'already exist' }] },
    });
    // TODO
  });
});
