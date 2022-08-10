import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
// ①インポート
import Login from './features/login/Login';
import { Route, BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);

//②ブラウザラウターでコンポーネントを囲う
//③Route exact pathを記述
root.render(
  <React.StrictMode>
    <Provider store={store}>
      
      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route exact path="/tasks" component={App} />
      </BrowserRouter>
      
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
