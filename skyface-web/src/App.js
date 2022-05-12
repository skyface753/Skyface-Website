import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import navbar from "./components/navbar/navbar";
import Dogs from "./pages/Dogs"
import Cats from "./pages/Cats"
import Sheeps from "./pages/Sheeps"
import Goats from "./pages/Goats"
function App() {
  return (
    <Router>
      <navbar />
      <Switch>
        <Route path='/' exact component={Dogs} />
        <Route path='/cats' component={Cats} />
        <Route path='/sheeps' component={Sheeps} />
        <Route path='/goats' component={Goats} />
      </Switch>
    </Router>
  );
}

export default App;