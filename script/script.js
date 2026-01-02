import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { push } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');

    const firebaseConfig = {
    apiKey: "AIzaSyBp338kEDn3Ro6r75FteHVb_UTGh1fc0Bk",
    authDomain: "burger-6214a.firebaseapp.com",
    databaseURL: "https://burger-6214a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "burger-6214a",
    storageBucket: "burger-6214a.firebasestorage.app",
    messagingSenderId: "92624207996",
    appId: "1:92624207996:web:34cd33847c036c554209f9",
    measurementId: "G-GJ1D834HQ3"
    };
    
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getDatabase(app);
    const questionsRef = ref(db, 'questions');

    const getData = () => {
        formAnswers.textContent = 'LOAD';

        setTimeout(() => {
            get(questionsRef)
                .then(snapshot => {
                    if (snapshot.exists()) {
                        playTest(snapshot.val());
                    } else {
                        formAnswers.textContent = 'Нет данных по вопросам';
                    }
                })
                .catch(error => {
                    formAnswers.textContent = 'Ошибка при получении данных!';
                    console.error(error);
                });
        }, 1000);
    }


    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
    });

    
    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });

    const playTest = (questions) => {
        
        const finalAnswers = [];
        let numberQuestion = 0;

        const renderAnswers = (index) => {          
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                <img class="answerImg" src="${ answer.url }" alt="burger">
                <span>${ answer.title }</span>
                </label>
                `;

                formAnswers.appendChild(answerItem);
            })
        }

    const renderQuestions = (indexQuestion) => {
        formAnswers.innerHTML = '';

        switch (true) {
            case (numberQuestion >= 0 && numberQuestion < questions.length):
                questionTitle.textContent = questions[indexQuestion].question;
                renderAnswers(indexQuestion);

                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');

                if (numberQuestion === 0) {
                    prevButton.classList.add('d-none');
                }
                break;

            case (numberQuestion === questions.length):
                questionTitle.textContent = "Введите ваш номер телефона";

                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');

                formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Enter your number</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                `;
                break;

            case (numberQuestion === questions.length + 1):
                questionTitle.textContent = "";
                formAnswers.textContent = 'Дякую за проходження тесту!';

                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
                break;

            default:
                console.warn("Некорректный номер вопроса:", numberQuestion);
        }
    };

        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')
            console.log(inputs);

            inputs.forEach((input, index) => {    
                if(numberQuestion >= 0 && numberQuestion <= questions.length - 1){
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value
                }

                if(numberQuestion === questions.length){
                    obj[`Номер телефона`] = input.value
                }
            })

            finalAnswers.push(obj)
            console.log(finalAnswers);
            
        }

        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);

            const contactsRef = ref(db, 'contacts');
            push(contactsRef, finalAnswers)
                .then(() => console.log('Данные отправлены:', finalAnswers))
                .catch(err => console.error('Ошибка отправки:', err));
        }
    };
});


