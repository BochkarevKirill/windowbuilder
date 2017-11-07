import {compose, createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';

// маршрутизация url
import createHistory from 'history/createBrowserHistory';
import {routerMiddleware} from 'react-router-redux';

// асинхронные действия
import thunk from 'redux-thunk';

// стандартные события pouchdb и метаданных
import {metaMiddleware} from 'metadata-redux';

// дополнительные события pouchdb
import {customPouchMiddleware} from './reducers/pouchdb';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();


export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    compose(
      // add middleware for intercepting and dispatching async and navigation actions
      applyMiddleware(thunk, routerMiddleware(history), metaMiddleware($p), customPouchMiddleware($p)),

      /**
       * Conditionally add the Redux DevTools extension enhancer
       * if it is installed.
       */
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );
}
