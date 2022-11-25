import { useState } from 'react'


export const useAsyncReducer = (reducer, initialState) => {
  const [state, setState] = useState(initialState),
    dispatch = async action => {
      setState(await reducer(state ?? initialState, action))
    };

  return [state, dispatch];
}

const todos = [
  {id: 1, title: "sometitlw", completed: false}
]

export const reducer = async (state, action) => {
  switch (action.type) {
    case 'all':
      state = todos
      break;

    case 'add':
      state.push(action.value);
      break;

    case 'update':
      state = state.map(todo => todo.id === action.value.id ? action.value : todo);
      break;

    case 'delete':
      state = state.filter(todo => todo.id !== action.value);
      break;

    case 'toggleCompletion':
      state = state.map(todo =>
        todo.id === action.value ? { ...todo, completed: !todo.completed } : todo
      )
      break;

    case 'toggleAll':
      state = state.map(todo => ({ ...todo, completed: !action.value }))
      break;

    case 'clearCompleted':
      state = state.filter(todo => !todo.completed);
      break;

    default:
      break;
  }
  return state;
}