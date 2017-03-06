/**
 * Created by yuran on 11/27/16.
 */
import * as rnfs from 'react-native-fs';
export function increment() {
    return {
        type: 'INCREMENT'
    };
}
export function decrement() {
    return {
        type: 'DECREMENT'
    };
}
export function loaded(data) {
    return {
        type: 'LOADED',
        data: data
    };
}
const path = rnfs.CachesDirectoryPath + '/test.txt';
export function dir() {
    return dispatch => {
        rnfs.readdir(rnfs.CachesDirectoryPath)
            .then((data) => {
            dispatch(loaded(data));
        })
            .catch((err) => {
            console.log(err.message);
        });
    };
}
export function log(text) {
    return dispatch => {
        rnfs.writeFile(path, text, 'utf8')
            .then((success) => {
            console.log('FILE WRITTEN!');
        })
            .catch((err) => {
            console.log(err.message);
        });
    };
}
export function unlink() {
    return dispatch => {
        rnfs.unlink(path)
            .then((success) => {
            console.log('FILE WRITTEN!');
        })
            .catch((err) => {
            console.log(err.message);
        });
    };
}
export function upload() {
    return dispatch => {
        rnfs.unlink(path)
            .then((success) => {
            console.log('FILE WRITTEN!');
        })
            .catch((err) => {
            console.log(err.message);
        });
    };
}
function ping() {
    return dispatch => {
        fetch('http://mail.ru')
            .then((result) => { console.log('success'); return dispatch(decrement()); })
            .catch((error) => { console.log('error'); return dispatch(decrement()); });
    };
}
export default ping;
