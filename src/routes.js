import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { isAuthenticated } from './services/auth';
import Login from './pages/login/index';
import Administrador from './pages/administrador';
import Validacao from './pages/validacao/index';
import PageNotFound from './components/PageNotFound';
import Secretaria from './pages/secretaria/index';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        // Passando as propriedades para a rota
        {...rest}
        // Redefindo o método render 
        render={props =>
            //renderizando o componente caso o usuário esteja autenticado
            isAuthenticated() ? (<Component {...props} />
            ) : (
                // caso contrário o usuário é redirecionado para a rota /
                //state impede que o usuário não perca seu histórico de rotas
                <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            )
        }
    />
);

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/validacao" component={Validacao} />
                <PrivateRoute path="/administrador" component={Administrador} />
                <Route path="/secretaria" component={Secretaria} />
                <Route path="*" component={PageNotFound} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;


