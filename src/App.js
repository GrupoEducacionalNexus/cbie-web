import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/App.css';
import Routes from './routes';
import { UserProvider } from './UserContext';

function App() {
    return (
        <UserProvider>
            <Routes />
        </UserProvider>
    )
}
export default App;
