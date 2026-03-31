import { Route, Switch, Router as WouterRouter } from 'wouter';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/,  '');

export default function App() {
  return (
    <WouterRouter base={BASE_PATH}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}
