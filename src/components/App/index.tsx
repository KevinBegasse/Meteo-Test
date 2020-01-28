import React from 'react';

//Importing router
import { useRoutes, A } from 'hookrouter';

//local imports
import './App.css';
import Header from '../Header';
import Main from '../Main';
import NotFoundPage from '../NotFoundPage';

const routes: {} = {
  '/' : () => <Main />
} 

export const App: React.FC = () => {
  const routeResult = useRoutes(routes);

  return (
    <div className="App">
      <Header />
      <A href="/">Rennes</A> <br />
      {routeResult || <NotFoundPage /> }

    </div>
  );
}

export default App;
