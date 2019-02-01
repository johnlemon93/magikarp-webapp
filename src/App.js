import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Spin } from 'antd';
import UserInfoService from './services/user-info.service';

class App extends Component {
  componentDidMount() {
    UserInfoService.onChange(() => this.forceUpdate());
  }

  render() {
    const user = UserInfoService.getUser();
    return (
      <div className="App">
        {renderPages(user)}
      </div>
    );
  }
}

const createAsyncComponent = (loader, modules) => Loadable({
  loader: loader,
  loading: () => <Spin tip="loading..." style={{ display: 'block' }} size='large'></Spin>,
  modules: modules
});

const AsyncHomeComponent = createAsyncComponent(
  () => import(/* webpackChunkName: "homeChunk" */ "./components/pages/home/index"),
  ['homeChunk']
);
const AsyncLoginComponent = createAsyncComponent(
  () => import(/* webpackChunkName: "loginChunk" */ "./components/pages/admin/login"),
  ['loginChunk']
);
const AsyncAdminComponent = createAsyncComponent(
  () => import(/* webpackChunkName: "adminChunk" */ "./components/pages/admin/index"),
  ['adminChunk']
);

const renderPages = (userInfo) => {
  const requireAuthen = (comp) => userInfo === null ? redirect("/login") : comp;
  const requireUnAuthen = (comp) => userInfo !== null ? redirect("/admin") : comp;

  return (
    <HashRouter>
      <Switch>
        <Route path="/admin" component={requireAuthen(AsyncAdminComponent)} />
        <Route path="/login" component={requireUnAuthen(AsyncLoginComponent)} />
        <Route exact path="/:pageId/:psId" component={AsyncHomeComponent} />
      </Switch>
    </HashRouter>
  );
}

function redirect(location) {
  return () => <Redirect to={location} />
}

export default App;