import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import 'todomvc-app-css/index.css';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorDisplayBoundary from './context/ErrorContext';
import ShowsErrorFromContext from './components/ShowsErrorFromContext';

function App() {
  return (
    <ErrorDisplayBoundary>
      <ShowsErrorFromContext />
      <HashRouter>
        <div className="todoapp">
          <Route path="/:filter?" component={TodoList} />
        </div>
      </HashRouter>
      <Footer />
    </ErrorDisplayBoundary>
  );
}

export default App;
