export function upload(selector, option = {}){

    let files = [];
    const onUpload = option.onUpload ?? noop;
    const input = document.querySelector(selector);
    input.style.display = 'none';

   
    const openBtn = element('button' , ['btn'] , 'открыть');

    const uploadBtn = element('button' , ['btn', 'primary'] , 'загрузить');
    uploadBtn.style.display = 'none';

    const preview = element('div', ['preview']);

    if(option.multi){
        input.setAttribute('multiple', true);
    }

    if(option.accept && Array.isArray(option.accept)){
        input.setAttribute('accept', option.accept.join(','));
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', uploadBtn);
    input.insertAdjacentElement('afterend', openBtn);
    

    const triggerInput = event => {
        input.click();
    }
    openBtn.addEventListener('click', triggerInput);

    const changeHandler = event => {
        if(!event.target.files.length){
            return;
        }

        files =  Array.from(event.target.files);
        
        //чистим preview от картинок когда загружаем картинки по новому
        preview.innerHTML = '';

        files.forEach(file => {
            
            if(!file.type.match('image')){
                return console.log('error');
            }
            //создание превью

            uploadBtn.style.display = 'inline';

            const reader = new FileReader();

            reader.onload = ev => { 
                
                const srcImage = ev.target.result;
                
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${srcImage}" alt="${file.name}">
                        <div class="preview-info">
                            <span>${file.name}</span>
                            <span>${byteToSize(file.size)}</span>
                        </div>
                    </div>
                `);
            }

            reader.readAsDataURL(file);
        });


    }

    const removeHandler = event => {
        let { name } = event.target.dataset;

        if(name){
           files = files.filter(file => file.name !== name);
           const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image');

           if(!files.length){
                uploadBtn.style.display = 'none';
           }

           //добавляем анимацию перед удалением
           block.classList.add('removing');

           setTimeout(() => {
                block.remove();
           }, 300);
        }
    }

    const clearPreview = el => {
        el.innerHTML = `<div class="preview-info-progress"></div>`
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(el => el.remove());
        const previewInfo =  preview.querySelectorAll('.preview-info');
        previewInfo.forEach(clearPreview);
        onUpload(files , previewInfo);
    }

    input.addEventListener('change', changeHandler);
    preview.addEventListener('click' , removeHandler);
    uploadBtn.addEventListener('click' , uploadHandler)

}

function byteToSize(bytes){
    const sizes = ['Bytes','KB', 'MB', 'GB', 'TB'];
    if(!bytes) {
        return '0 butes';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ` ` + sizes[i];
}

function element(tag, classes = [], content){
    const node = document.createElement(tag);

    if(classes.length){
        node.classList.add(...classes);
    }

    if(content){
        node.textContent = content;
    }

    return node;
}

function noop(){}
