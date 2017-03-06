
import * as React from 'react';
import {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableHighlight,
    WebView,
    ViewStyle,
    DeviceEventEmitter
} from 'react-native';

//import * as RNShakeEvent from 'react-native-shake-event';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import ping, {log, dir, increment, decrement, unlink} from './api';
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


const routes = [{title: 'First Scene', index: 0}, {title: 'Second Scene', index: 1}];
const uris = ['http://mail.ru', 'http://ya.ru'];

/*
function mapDispatchToProps(dispatch) {
    return bindActionCreators(MyActions, dispatch)
}

renderVideo(index) {
    if (index === 0) {
        return null;
    }

     return (<Video source={{uri: "http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4"}}
     style={styles.fullScreen} onError={() => {console.error('Error!')}} onLoadStart={() => {console.error('Loading')}} />
     );

}
*/

/*
renderWeb(index, uri) {
    if (index !== 0) {
        return null;
    }
    return (<WebView source={{uri: uri}} style={{backgroundColor: '#333333', height: 200}}/>);
}
*/
//{this.renderVideo(route.index)}
//{this.renderWeb(route.index, uris[route.index])}

//@connect<MyProps, any, any>(mapStateToProps)
interface MyProps {
    count: number;
    title: string;
    list: string[];
}

interface MyState {}

function mapStateToProps(state, own) {
    return {
        count: state.counter,
        title: own.title,
        list: state.filelist
    };
}

class info extends Component<MyProps, any>
{
    render() {
        return (
            <View>
                <Text>{this.props.title} {this.props.count}!</Text>
                <Text>{JSON.stringify(this.props.list)}</Text>
            </View>);
    }
}
const Info = connect(mapStateToProps)(info);
let listener = null;

class awesomenative extends Component<any, any> {
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
        return (
            <Provider store={store}>
                <Navigator initialRoute={routes[0]}
                       initialRouteStack={routes}
                       renderScene={(route, navigator) =>
                            <View style={styles.container}>
                               <TouchableHighlight onPress={() => {
                                        if (route.index === 0) {
                                            navigator.push(routes[1]);
                                            store.dispatch(increment());
                                        }
                                        else {
                                            navigator.pop();
                                            store.dispatch(decrement());
                                        }
                                   }}>
                                   <Text>Change!</Text>
                               </TouchableHighlight>
                               <TouchableHighlight onPress={() => { store.dispatch(dir()); }}>
                                   <Text>Refresh Catalog!</Text>
                               </TouchableHighlight>
                               <TouchableHighlight onPress={() => { store.dispatch(log(JSON.stringify(store.getState()))); }}>
                                   <Text>Write To file!</Text>
                               </TouchableHighlight>
                               <TouchableHighlight onPress={() => { store.dispatch(unlink()); }}>
                                   <Text>Unlink!</Text>
                               </TouchableHighlight>
                               <Info title={route.title} {...this.props}/>
                             </View>
                       }
                />
            </Provider>
        );
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
    } as ViewStyle,
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