
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import { upload } from './upload.js';

const firebaseConfig = {
        apiKey: "AIzaSyA3idLQz-KCyeBli-LZ8-847u1FKBGIurU",
        authDomain: "uploadfile-206e2.firebaseapp.com",
        projectId: "uploadfile-206e2",
        storageBucket: "uploadfile-206e2.appspot.com",
        messagingSenderId: "327059104632",
        appId: "1:327059104632:web:bfbdb82754a96b8cad9e8d"
};

firebase.initializeApp(firebaseConfig);

const storage  = firebase.storage();
console.log(storage)

upload('#file', {
    multi: true, // регулировка количества файлов
    accept: ['.png', '.jpeg', '.jpg', '.jfif'], // регулировка типа файла
    onUpload(files , blocks){
        console.log(blocks)
        files.forEach((file, index) => {
            const ref =  storage.ref(`images/${file.name}`);
            const task = ref.put(file);
            task.on('state_changed' , snapshot => {
                const percent  = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = percent;
                block.style.width = percent + '%';
            }, error => {

            }, () => {
                console.log('Complete')
            })

        })
    }
});


