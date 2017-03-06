var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, Navigator, TouchableHighlight, DeviceEventEmitter } from 'react-native';
//import * as RNShakeEvent from 'react-native-shake-event';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { log, dir, increment, decrement, unlink } from './api';
//import Video from 'react-native-video';
const logger = createLogger();
console.log('logger is: ', logger, ' thunk is', thunk);
const args = (logger) ? [logger, thunk] : [thunk];
//const createStoreWithMiddleware = applyMiddleware(...args)(createStore);
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
function filelist(state = [], action) {
    switch (action.type) {
        case 'LOADED':
            return action.data;
        default:
            return state;
    }
}
const reducers = combineReducers({ counter, filelist });
const store = createStore(reducers, applyMiddleware(thunk, logger));
const routes = [{ title: 'First Scene', index: 0 }, { title: 'Second Scene', index: 1 }];
const uris = ['http://mail.ru', 'http://ya.ru'];
function mapStateToProps(state, own) {
    return {
        count: state.counter,
        title: own.title,
        list: state.filelist
    };
}
class info extends Component {
    render() {
        return (React.createElement(View, null,
            React.createElement(Text, null,
                this.props.title,
                " ",
                this.props.count,
                "!"),
            React.createElement(Text, null, JSON.stringify(this.props.list))));
    }
}
const Info = connect(mapStateToProps)(info);
let listener = null;
class awesomenative extends Component {
    componentWillMount() {
        listener = DeviceEventEmitter.addListener('ShakeEvent', () => {
            console.log('Device shake!');
        });
    }
    componentWillUnmount() {
        if (listener) {
            listener.remove();
        }
        //RNShakeEvent.removeEventListener('shake');
    }
    render() {
        console.log('state: ', store.getState(), this.props);
        return (React.createElement(Provider, { store: store },
            React.createElement(Navigator, { initialRoute: routes[0], initialRouteStack: routes, renderScene: (route, navigator) => React.createElement(View, { style: styles.container },
                    React.createElement(TouchableHighlight, { onPress: () => {
                            if (route.index === 0) {
                                navigator.push(routes[1]);
                                store.dispatch(increment());
                            }
                            else {
                                navigator.pop();
                                store.dispatch(decrement());
                            }
                        } },
                        React.createElement(Text, null, "Change!")),
                    React.createElement(TouchableHighlight, { onPress: () => { store.dispatch(dir()); } },
                        React.createElement(Text, null, "Refresh Catalog!")),
                    React.createElement(TouchableHighlight, { onPress: () => { store.dispatch(log(JSON.stringify(store.getState()))); } },
                        React.createElement(Text, null, "Write To file!")),
                    React.createElement(TouchableHighlight, { onPress: () => { store.dispatch(unlink()); } },
                        React.createElement(Text, null, "Unlink!")),
                    React.createElement(Info, __assign({ title: route.title }, this.props))) })));
    }
}
const styles = StyleSheet.create({
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
export default awesomenative;
