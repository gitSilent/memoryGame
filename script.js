(function (){
"use strict"

    function createMainDiv(){ //функция создания контейнера для карточек
        let     mainDiv = document.createElement("div");
        mainDiv.classList.add("mainDiv");
        document.body.append(mainDiv);
        mainDiv.addEventListener("click", onClickEvent);
    }
    function chooseTheLvl(){//функция создания окна для выбора уровня сложности
        let divLvlChoose = document.createElement("div");//главный контейнер меню выбора уровня сложности
        divLvlChoose.classList.add("divLvlChoose");
        document.body.append(divLvlChoose);

        let p = document.createElement("p");//надпись Выберите уровень сложности
        p.classList.add("lvlTitle");
        p.textContent = "Choose the difficulty level";
        divLvlChoose.append(p);

        let lvlBtnsDiv = document.createElement("div");//контейнер для кнопок выбора уровня
        lvlBtnsDiv.classList.add("lvlBtnsDiv");
        lvlBtnsDiv.append()
        divLvlChoose.append(lvlBtnsDiv);

        let btnEasy = document.createElement("button");
        btnEasy.classList.add("btnEasy");
        btnEasy.textContent = "Easy";
        btnEasy.addEventListener('click', ()=>{
            countCards = 8;createMainDiv();createCards(countCards);randomizeCard(countCards);divLvlChoose.remove();});
        lvlBtnsDiv.append(btnEasy);

        let btnMedium = document.createElement("button");
        btnMedium.classList.add("btnMedium");
        btnMedium.textContent = "Medium";
        btnMedium.addEventListener('click', ()=>{
            countCards = 12;createMainDiv();createCards(countCards);randomizeCard(countCards);divLvlChoose.remove();});
        lvlBtnsDiv.append(btnMedium);

        let btnHard = document.createElement("button");
        btnHard.classList.add("btnHard");
        btnHard.textContent = "Hard";
        btnHard.addEventListener('click', ()=>{
            countCards = 16;createMainDiv();createCards(countCards);randomizeCard(countCards);divLvlChoose.remove();});
        lvlBtnsDiv.append(btnHard);

    }
    function createCards(cntCards) {//функция размещения карточек и кнопки Завершить на поле
    for (let i = 1; i <= Math.ceil(cntCards/4); i++) {//создание нужно кол-ва строк для выбранного числа карточек
        let row = document.createElement("div");
        row.classList.add(`row${i}`);
        row.setAttribute("id", "row");
        document.querySelector(".mainDiv").append(row);
    }
    for (let i = 1; i <= cntCards; i++) {//создание выбранного числа карточек
        let divCard = document.createElement("div");
        divCard.setAttribute("id", "divCard");
        divCard.setAttribute("cardnumber",`div${i}`);
        divCard.classList.add(`backSide`);

        document.querySelector(`.row${Math.ceil(i/4)}`).append(divCard);
        
    }
    let buttonFinish = document.createElement("button");
    buttonFinish.classList.add("btnFinish");
    buttonFinish.textContent = "FINISH GAME";
    buttonFinish.addEventListener("click",()=>{
        document.querySelector(".mainDiv").remove();
        buttonFinish.remove();
        chooseTheLvl();
        document.querySelector(".timerField").remove();
        clearInterval(time);
        document.querySelector(".score").textContent = `Your best score: ${JSON.parse(localStorage.getItem("bestScore"))}`;
    })
    document.body.append(buttonFinish);
}

function compareCards(allCard) {// функция для сравнения карточек
    if (event.target.classList.contains("backSide")) {
        console.log("текущее значение",event.target.getAttribute("val") )
        let chosenElem = event.target
        event.target.classList.toggle("backSide"); //перевернуть карточку, если она закрыта

        if (predZnach == undefined) { //записать значение выбранной карточки в переменную "Предыдущее значение" если переменная пуста
            predZnach = event.target;
            return;
        }
        
        if (event.target.getAttribute("val") == predZnach.getAttribute("val")) { //если выбранная карточка и предыдущая равны
            predZnach = undefined;
            console.log("сброс прзн", predZnach);
            playStatus++;
            if (playStatus == countCards/2){//если кол-во открытых карточек равно общему кол-ву карт на поле (завершение игры)
                playStatus = 0;
                let actualScore = Math.round(seconds * 100/(countCards*3))*10;//текущий счет игрока
                if(localStorage.getItem("bestScore") < actualScore){ // если лучший счет из localStorage меньше, чем текущий, то перезаписываем
                    localStorage.setItem("bestScore", actualScore)
                }
                document.querySelector(".score").textContent = `Your best score: ${JSON.parse(localStorage.getItem("bestScore"))}`;
                alert(`The game is over! Your actual score: ${Math.round(seconds * 100/(countCards*3))*10}` ); //alert с текущим счетом
                // console.log("Время ",seconds);
                clearInterval(time);//остановка таймера
                // document.querySelector('.mainDiv').innerHTML = '';
                document.querySelector('.mainDiv').remove(); //удаление контейнера с картами
                document.querySelector(".btnFinish").remove();
                document.querySelector(".timerField").remove();//удаление таймера
                chooseTheLvl();//создание окна выбора уровня
            }
            return;
        }
                                      
        if(event.target.getAttribute("val") != predZnach.getAttribute("val")) { //если выбранная карточка не равна предыдущей
            
            document.querySelector(".mainDiv").removeEventListener("click", onClickEvent );//отключение eventListener у контейнера (защита от лишних нажатий)

            let prevElement = document.querySelector(`[cardnumber="${predZnach.getAttribute("cardnumber")}"]`);//нахождение пред. карточки
            console.log(prevElement); 
            setTimeout(()=>{ //задержка полсекунды перед закрытием карт
                chosenElem.classList.add("backSide");
                prevElement.classList.add("backSide");
                document.querySelector(".mainDiv").addEventListener("click", onClickEvent);           
                },500);

            predZnach = undefined;//сброс пред. значения

        }
        
    }
}


function randomizeCard(cntCards) {//рандомизация значений карточек
    let arr = [];
    let i = 1;
    while (i <= cntCards) {
        // let randomNum = Math.floor(Math.random() * countCards);
        let randomElem = Math.floor((Math.random() * cntCards) / 2) + 1;//выбор рандомного значения в зависимости от кол-ва карт
        if (arr.indexOf(randomElem, 0) == -1) {
            arr.push(randomElem);
            i++;
            continue;
        } else if (arr.indexOf(randomElem, 0) != -1) {
            let pos = arr.indexOf(randomElem, 0);
            if (arr.indexOf(randomElem, pos + 1) == -1) {//проверка: в массиве не должно быть больше двух одинаковых элементов
                arr.push(randomElem);

                i++;
                continue;
            } else {
                continue;
            }
        }
    }

    for (let i = 1; i <= cntCards; i++) {// присваивание рандомных значенйи карточкам
        let currentDiv = document.querySelector(`[cardnumber="div${i}"]`);
        currentDiv.setAttribute("val", `value${arr[i - 1]}`);
        // console.log(document.querySelector(`.div${i}`))
    }
    timer(cntCards);// запуск таймера
    console.log("array ", arr);
}

function timer(kolvoCards){//функция создания и запуска таймера
    let timerField = document.createElement("p");
    timerField.classList.add("timerField");
    document.body.append(timerField);

    seconds = kolvoCards*3;

    time = setInterval(()=>{
        if(seconds == 0){
            alert("Время вышло");
            document.querySelector(".timerField").remove();
            console.log("Время ",seconds);
            clearInterval(time);
            document.querySelector('.mainDiv').remove();
            buttonFinish.remove();
            chooseTheLvl();
        }
        document.querySelector(".score").textContent = `Your actual score: ${Math.round(seconds * 100/(kolvoCards*3))*10}`;

        seconds = seconds - 1;
        timerField.textContent = `Осталось ${seconds} секунд`;
        console.log(seconds);
    },1000)
}

function onClickEvent(){//событие при клике на карточку
    if (event.target.getAttribute("id") == "divCard") {
        let allCardSelect = document.querySelectorAll("#divCard")
        compareCards(allCardSelect);
    }
}

function scoreFunc(){ //функция создания поля для лучшего счета игрока и запись значения из localstorage
    let score = document.createElement("p");
    score.classList.add("score");
    score.textContent = `Your best score: ${JSON.parse(localStorage.getItem("bestScore"))}`;
    let h1 = document.querySelector(".h1");
    h1.after(score);

}

let predZnach = undefined;
let countCards = 0;
let playStatus = 0;
let seconds;
let time;
let scoreCount;


function main() {
    console.log("hi");
    let best_score = JSON.parse(localStorage.getItem("bestScore"));//синхронизация с localStorage при первом запуске
    if(best_score == null){
        localStorage.setItem("bestScore", 0)//создания нулевого ключа/значения при его отсутствии
    }
    console.log(best_score);
    
    chooseTheLvl();//меню выбора уровня
    scoreFunc();//размещение лучшего счета игрока
}
main();
})();