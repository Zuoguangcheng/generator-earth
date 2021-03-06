//import base&&tools
import 'whatwg-fetch'
import 'scss_mixin/<%= resetCss %>' //reset 样式
import 'tools/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store/index'
import {Provider} from 'react-redux'
import createHashHistory from 'history/lib/createHashHistory'
import { IndexRedirect,
    Route,
    Router,
    Redirect } from 'react-router';
// import containers
import App from './containers/App'
import Home from './containers/Home'
import Site from './containers/Site'
//import My from 'containers/My'

import List from './containers/Site/list'
import Detail from './containers/Site/detail'

// 解决路由切换时页面滚动问题
// https://github.com/webpack/webpack/issues/1949
const history = createHashHistory();
history.listen(location => {

    setTimeout(() => {

        if (location.action === 'POP') {
            return;
        }

        window.scrollTo(0, 0);

    });

});

const rootElement = document.getElementById('root');

ReactDOM.render(

    <Provider store={store}>

        <Router history={history}>

            <Route path="/" component={App}>

                <IndexRedirect to="home"/>

                <Route path="home" component={Home}/>

                <Route path="site" component={Site}>

                    <IndexRedirect to="list"/>

                    <Route path="list" component={List}/>
                    <Route path=":id" component={Detail}/>

                </Route>

                <Route path="my" getComponent={(location, callback) => {

                    require.ensure([], function (require) {
                        callback(null, require('./containers/My').default)
                    }, 'My')

                }}/>

            </Route>

            <Redirect from="*" to="/home"/>

        </Router>

    </Provider>,

    rootElement

)
