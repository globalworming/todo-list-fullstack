import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'todomvc-app-css/index.css';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorDisplayBoundary from './context/ErrorContext';
import ShowsErrorFromContext from './components/ShowsErrorFromContext';
import ToDoListBoundary from './context/ToDoListContext';
import OauthCallback from './components/OauthCallback';

function App() {
  return (
    <ErrorDisplayBoundary>
      <ShowsErrorFromContext />
      <BrowserRouter>
        <div className="todoapp">
          <ToDoListBoundary>
            <Routes>
              <Route path="/oauth-callback" element={<OauthCallback />} />
              <Route path="/:filter?" element={<TodoList />} />
            </Routes>
          </ToDoListBoundary>
        </div>
      </BrowserRouter>
      <Footer />
    </ErrorDisplayBoundary>
  );
}

export default App;
