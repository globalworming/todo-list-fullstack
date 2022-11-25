import React from "react";
import {HashRouter, Route} from "react-router-dom";
import "todomvc-app-css/index.css";

import TodoList from './components/TodoList';

function App() {

    return <HashRouter>
        <React.Fragment>
            <div className="todoapp">
                <Route path="/:filter?" component={TodoList}/>
            </div>
        </React.Fragment>
    </HashRouter>

}

export default App;
