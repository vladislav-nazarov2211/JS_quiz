// 1. Функционал перемещения по карточкам - вперед и назад
// 2. Получение (сбор) данных с карточек
// 4. Записать все полученный данные в объект
// 4. Проверить ввод данных
// 5. Реализовать работу прогресс-бара
// 6. Подсветка рамки для радиокнопок и чекбоксов

// Объект с сохраненными данными по карточкам

var answers = {
    2: null,
    3: null,
    4: null,
    5: null,
};

var btnNext = document.querySelectorAll('[data-nav="next"]');

btnNext.forEach(function(button) {
    button.addEventListener('click', function(){
        var thisCard = this.closest('[data-card]');
        var thisCardNumber = parseInt(thisCard.dataset.card);
        
        if (thisCard.dataset.validate == 'novalidate') {
            navigate('next', thisCard)
            updateProgressBar('next', thisCardNumber)
        } else {
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            if (isFilled(thisCardNumber)) {
                var response = checkOnRequired(thisCardNumber)
                if (response) {
                    alert(response)
                } else {
                navigate('next', thisCard)
                updateProgressBar('next', thisCardNumber)
                }
            } else {
                alert('Вы ничего не выбрали!')
            };            
        };
    });
});

var btnPrev = document.querySelectorAll('[data-nav="prev"]');

btnPrev.forEach(function(button) {
    button.addEventListener('click', function(){
        var thisCard = this.closest('[data-card]')
        var thisCardNumber = parseInt(thisCard.dataset.card);
        navigate('prev', thisCard)
        updateProgressBar('prev', thisCardNumber)
    });
});

function navigate (direction, thisCard) {
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;

    if (direction == 'next') {
        nextCard = thisCardNumber + 1
    } else if (direction == 'prev') {
        nextCard = thisCardNumber - 1
    };

    thisCard.classList.add('hidden');
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden');
};

function gatherCardData(number) {
    var question;
    var result = [];

    var currentCard = document.querySelector(`[data-card="${number}"]`);    
    question = currentCard.querySelector('[data-question]').innerText;
    
    var radioCheckBoxValues = currentCard.querySelectorAll('[type="radio"], [type="checkbox"]');
    radioCheckBoxValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        };
    });
   
    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item) {
        itemValue = item.value
        if (itemValue.trim() != "") {  
            result.push({
                name: item.name,
                value: item.value
            });
        };
    });

    var data = {
        question: question,
        answer: result 
    };  
    return data;
} ;

function saveAnswer(number, data) {
    answers[number] = data
};

function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true
    } else
        return false    
};

function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
};

function checkOnRequired(number) {
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var requiredFields = currentCard.querySelectorAll('[required]');

    var result;

    requiredFields.forEach(function(item) {
        
        if (item.type == "checkbox" && item.checked == false) {
            result = 'Не отмечен флажок'
        } else if (item.type == 'email' && !validateEmail(item.value)) {
            result = 'Не корректный email'
        };
    });

    return result;
};


document.querySelectorAll('.radio-group').forEach(function(item) {
    item.addEventListener('click', function(e) {
        var label = e.target.closest('label');
        if (label) {
            label.closest('.radio-group').querySelectorAll('label').forEach(function(item) {
                item.classList.remove('radio-block--active')
            })
            label.classList.add('radio-block--active')
        };
    });
});

document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function() {
        if (item.checked) {
            item.closest('label').classList.add('checkbox-block--active')
        } else {
            item.closest('label').classList.remove('checkbox-block--active') 
        };
    });
});

function updateProgressBar(direction, cardNumber) {
    var cardsTotalMNumber = document.querySelectorAll('[data-card]').length;

    if(direction == 'next') {
        cardNumber = cardNumber + 1
    } else if (direction == 'prev') {
        cardNumber = cardNumber - 1
    };

    var progress = ((cardNumber * 100)/cardsTotalMNumber).toFixed();

    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress');
    if (progressBar) {
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;
        progressBar.querySelector('.progress__line-bar').style.width = `${progress}%`;
    };
};



