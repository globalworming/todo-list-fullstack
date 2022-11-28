import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import 'todomvc-app-css/index.css';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <HashRouter>
        <div className="todoapp">
          <Route path="/:filter?" component={TodoList} />
        </div>
      </HashRouter>
      <Footer />
    </>
  );
}

export default App;
