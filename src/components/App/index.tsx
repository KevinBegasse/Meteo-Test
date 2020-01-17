import React from 'react';

//local imports
import logo from '../../logo.svg';
import './App.css';
import Header from '../Header';
import Main from '../Main';



export const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Main/>
    </div>
  );
}

export default App;
