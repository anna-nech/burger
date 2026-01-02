document.addEventListener('DOMContentLoaded', function () {

  const btnOpenModal = document.querySelector('#btnOpenModal');
  const modalBlock = document.querySelector('#modalBlock');
  const closeModal = document.querySelector('#closeModal');
  const questionTitle = document.querySelector('#question');
  const formAnswers = document.querySelector('#formAnswers');
  const nextButton = document.querySelector('#next');
  const prevButton = document.querySelector('#prev');

const questions = [
    {
        question: "Якого кольору бургер?",
        answers: [
            {
                title: 'Стандарт',
                url: './image/burger.png'
            },
            {
                title: 'Чорний',
                url: './image/burgerBlack.png'
            }
        ],
        type: 'radio'
    },
    {
        question: "З якого м'яса котлета?",
        answers: [
            {
                title: 'Курка',
                url: './image/chickenMeat.png'
            },
            {
                title: 'Яловичина',
                url: './image/beefMeat.png'
            },
            {
                title: 'Свинина',
                url: './image/porkMeat.png'
            }
        ],
        type: 'radio'
    },
    {
        question: "Додаткові інгредієнти ?",
        answers: [
            {
                title: 'Помідор',
                url: './image/tomato.png'
            },
            {
                title: 'Огірок',
                url: './image/cucumber.png'
            },
            {
                title: 'Салат',
                url: './image/salad.png'
            },
            {
                title: 'Цибуля',
                url: './image/onion.png'
            }
        ],
        type: 'checkbox'
    },
    {
        question: "Додати соус?",
        answers: [
            {
                title: 'Часниковий',
                url: './image/sauce1.png'
            },
            {
                title: 'Томатний',
                url: './image/sauce2.png'
            },
            {
                title: 'Гірчичний',
                url: './image/sauce3.png'
            }
        ],
        type: 'radio'
    }
];

  let currentQuestion = 0;

  btnOpenModal.addEventListener('click', () => {
    modalBlock.classList.add('d-block');
    renderQuestion(currentQuestion);
  });

  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
  });

  function renderAnswers(index) {
    formAnswers.innerHTML = '';
    questions[index].answers.forEach((answer, i) => {
      const answerItem = document.createElement('div');
      answerItem.classList.add('answers-item', 'd-flex', 'flex-column');
      answerItem.innerHTML = `
        <input type="radio" id="answerItem${i}" name="answer" class="d-none">
        <label for="answerItem${i}" class="d-flex flex-column justify-content-between">
          <img class="answerImg" src="${answer.url}" alt="${answer.title}">
          <span>${answer.title}</span>
        </label>
      `;
      formAnswers.appendChild(answerItem);
    });
  }

  function renderQuestion(index) {
    questionTitle.textContent = questions[index].question;
    renderAnswers(index);

    prevButton.disabled = index === 0;
    nextButton.disabled = index === questions.length - 1;
  }

  nextButton.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion(currentQuestion);
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion(currentQuestion);
    }
  });

});
