// Starting point for application
import ReactDOM from 'react-dom/client';
//Browser Router will control all routing for application
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
       <App /> 
    </BrowserRouter>
)