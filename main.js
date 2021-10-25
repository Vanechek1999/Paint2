const canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const changeColor = document.querySelector('.changeColor');
const changeSize = document.querySelector('.changeSize');
const addImg = document.querySelector('.downLoadImg');
const changeOpacity = document.querySelector('.changeOpacity');
let newImg = document.querySelector('.newImg');
const doc = document;
const cursor = document.querySelector('.cursor');

//Поведение курсора
doc.addEventListener('mouseover', function(e){
    cursor.style.display = 'block';
    doc.addEventListener('mousemove', cursorMove, false);
    function cursorMove(e){
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top =  `${e.pageY}px`;
    }
}, false)

//Изменть цвет курсора
changeColor.addEventListener('change', function(){
    ctx.fillStyle = `${changeColor.value}`
    ctx.strokeStyle = `${changeColor.value}`;
})
changeColor.addEventListener('input', function(){
    cursor.style.background = `${changeColor.value}`;
    document.querySelector('body').style.color = `${changeColor.value}`; 
})

//Изменить размер пера
changeSize.addEventListener('change', function(){
    if(+changeSize.value < 1){
        changeSize.value = 1;
        cursor.style.width = '1px';
        cursor.style.height = '1px';
    }
    lineSize = +`${changeSize.value}`;
    cursor.style.width = `${changeSize.value}px`;
    cursor.style.height = `${changeSize.value}px`;
})
//Добавление новой картинки
function addNewImg(){
    if (this.files[0]) {
        var fr = new FileReader();
        fr.addEventListener("load", function () {
            if(/png|jpg|svg$/i.test(fr.result)){
              newImg.setAttribute('src', `${fr.result}`)
              document.querySelector('.download_text').innerHTML = 'Загрузите картинку'
              
            }else{
              newImg.setAttribute('src', '')
              document.querySelector('.download_text').innerHTML = 'Необходимо загрузить картинку'
              console.log(typeof(fr.result))
            }
            
          
        }, false);
    
        fr.readAsDataURL(this.files[0]);
      }
}
const reader = new FileReader()
if(window.FileList && window.File){
    addImg.addEventListener('dragover', event=>{
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    })
    addImg.addEventListener('drop', event=>{
        addNewImg() 
        event.stopPropagation();
        event.preventDefault();
        const files = event.dataTransfer.files;
        reader.readAsDataURL(files[0]);
        reader.addEventListener('load', (event)=>{
            
        })
    })
}
addImg.addEventListener("change",  addNewImg)
//Установить прозрачность картинки
changeOpacity.addEventListener('change', function(){
    if(+changeOpacity.value < 0.1){
        changeOpacity.value = 0;
    }else if(+changeOpacity.value >= 1){
        changeOpacity.value = 1;
    }
    newImg.style.opacity = `${changeOpacity.value}`
})
let lineSize;
let colorsItem = [];
let sizeItem = []
colorsItem.push(['#000'])


let isMouseDown = false;
let coords = [];

canvas.addEventListener('mousedown', function(){
    isMouseDown = true
});
canvas.addEventListener('mouseup', function(){
    isMouseDown = false;
    ctx.beginPath();
    coords.push('mouseup')
    colorsItem.push('transparent')
    sizeItem.push('0')
})


canvas.addEventListener('mousemove', function(e){
    if(isMouseDown){
        coords.push([e.clientX, e.clientY])
        colorsItem.push(changeColor.value)
        sizeItem.push(changeSize.value)
        ctx.lineWidth = lineSize*2;
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(e.clientX, e.clientY, lineSize, 0, Math.PI*2)
        ctx.fill()
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY)
    }

})

function clear(){
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'black'
}
function save(){
    localStorage.setItem('coords', JSON.stringify(coords))
    localStorage.setItem('colors', JSON.stringify(colorsItem))
    localStorage.setItem('size', JSON.stringify(sizeItem))
}

function replay(){
    newImg.style.display= 'none'
    let timer = setInterval(function(){
        if(!coords.length){
            clearInterval(timer);
            ctx.beginPath();
            return
        }
        let crd  = coords.shift(),
            clr = colorsItem.shift()
            siz = sizeItem.shift()
            e = {
                clientX: crd["0"],
                clientY: crd["1"],
                fill:clr,
                fillStroke: clr,
                widSiz: siz
            };
            console.log(siz);
            ctx.lineWidth = e.widSiz*2;
            ctx.fillStyle = `${e.fill}`
            ctx.strokeStyle = `${e.fillStroke}`
            ctx.lineTo(e.clientX, e.clientY)
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(e.clientX, e.clientY, e.widSiz, 0 , Math.PI*2)
            ctx.fill()
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY)
    },30)
}
document.addEventListener('keydown', function(e){
    if(e.keyCode === 13){
        save()
        console.log('Saved');
        // Сохранение на клавишу Enter
    }
    if(e.keyCode === 27){
        clear()
        console.log('Cleared');
         // Удаление на клавишу Esc
    }
    if(e.keyCode === 32){
        coords = JSON.parse(localStorage.getItem('coords'));
        colorsItem = JSON.parse(localStorage.getItem('colors'))
        clear()
        replay()
        // Прорисовка на клавишу Пробел
    }
})