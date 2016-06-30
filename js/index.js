/*
Start by designing the model. The data is static and stored in an array of objects (hash).
Some things to consider:
1. The data does not change so no methods are needed to add or edit the model.
2. The question needs to be sent to the view - maybe I need a model method?
3. The user's response needs to be compared to the correct answer - model or controller method?
4. The feedback will be sent to the view - by which component?
5. The score has to be updated depending on the user's answer.
6. The correct button must be selected and added to the page based on the state of the app.
7. The next question must be accessed and sent to the view upon which the entire process starts over again.
 */

// Array of question objects. Once I get this working I'll import these
// from a separate file.
var data = [{
        text: 'Which player on the ATP Tour has won the most Grand Slam titles?',
        mystery_img: 'images/mystery-federer.png',
        actual_img: 'images/federer.png',
        choices: ['Pete Sampras', 'Rafael Nadal',
            'Roger Federer', 'John McEnroe'
        ],
        answer: 2,
        feedback: 'Roger Federer has won 17 grand slam titles including 7 Wimbledon, 5 US Open, 1 French Open, and 4 Australian Open titles.'
    },

    {
        text: 'This player has won the French Open a whopping nine times over a ten year period!',
        mystery_img: 'images/mystery-nadal.png',
        actual_img: 'images/nadal.png',
        choices: ['Roger Federer', 'Rafael Nadal',
            'Novak Djokovic', 'John Isner'
        ],
        answer: 1,
        feedback: 'Rafael Nadal is considered to be "the King of Clay" and one of the greatest players ever.'
    },

    {
        text: 'Which of these players won the men\'s singles championship at the 2012 Olympic Games?',
        mystery_img: 'images/mystery-murray.png',
        actual_img: 'images/murray.png',
        choices: ['Andy Murray', 'Novak Djokovic',
            'Pete Sampras', 'Andy Roddick'
        ],
        answer: 0,
        feedback: 'Andy Murray is the first British singles champion in over 100 years.'
    },

    {
        text: 'Who is the only player to have beaten both Roger Federer and Rafael Nadal in all four Grand Slam events?',
        mystery_img: 'images/mystery-djokovic.png',
        actual_img: 'images/djokovic.png',
        choices: ['Andre Agassi', 'Andy Roddick',
            'Novak Djokovic', 'pete sampras'
        ],
        answer: 2,
        feedback: 'Novak Djokovic is currently ranked number 1 in the world on the ATP Tour.'
    },

    {
        text: 'This player won the longest men\'s singles match ever to be played at Wimbledon.',
        mystery_img: 'images/mystery-isner.png',
        actual_img: 'images/isner.png',
        choices: ['Rafael Nadal', 'John McEnroe',
            'Pete Sampras', 'John Isner'
        ],
        answer: 3,
        feedback: 'John Isner defeated Nicolaus Mahut in 11 hours and 5 minutes. the match was played over a three day period since there are no court lights at Wimbledon.'
    }

];

/**
 * Represents a question object.
 * @constructor
 */
var Question = function (name, text, mystery, actual, choices, answer,
    feedback) {
    this.name = name || "";
    this.text = text || "";
    this.mysteryImg = mystery || "";
    this.actualImg = actual || "";
    this.choices = choices || [];
    this.answer = answer || null;
    this.feedback = feedback || "";
};

/**
 * Instantiates the questions and returns an array.
 * @param  {array} data Array of questions as JSON objects.
 * @return {array} qList Array of question object instances.
 */
function createQuestion (data) {
    var qList = [],
        count = 0;
    $.each(data, function (i, question) {
        count += 1;
        var name = "question" + count;
        var q = new Question(name, question.text, question.mystery_img,
            question.actual_img, question.choices, question.answer,
            question.feedback);
        qList.push(q);
    });
    return qList;
};

// Store the question instances in a variable as an array.
var questions = createQuestion(data);

/**
 * Represents the data.
 * @param {Array} questions Array of question instances.
 */
var Model = function (questions) {
    this.questions = questions;
    this.currentQuestion = 0;
    this.score = 0;
};

// Method to increment the question number as the user progresses in the quiz.
Model.prototype.increment = function() {
    this.currentQuestion += 1;
}

// Method to retrieve a question from the data storage (array in this case).
Model.prototype.getCurrentQuestion = function() {
    return this.questions[this.currentQuestion];
}

// Reset some of the properties if the user wants to retake the quiz.
Model.prototype.reset = function () {
    this.score = 0;
    this.currentQuestion = 0;
}

/**
 * Represents the view.
 */
var View = function () {
    //declare the elements that need to be evaluated or manipulated.
    this.question = $('.question');
    this.button = $('.button input');
    this.responseList = $('.response-list');
    this.playerImage = $('.player img');
    this.score = $('ul.tennis-balls');
    this.selectedAnswer = $("input[type='radio'][name='selection']:checked");

    this.onSubmit = null;

    // this.button.on('click', this.onSubmit.bind(this));
}

/*
TODO List
 */

// DONE: The view has a list of radio inputs
// DONE: The view has a submit button associated with the radio inputs
// When the submit button is clicked, the user's selection is compared to the correct answer.
// The choices are removed and the feedback is presented.
// The mystery image is replaced with the actual image.
// The score ball is updated to the color based on whether or not the answer was correct.
// The submit button is replaced by a next button.
// When the next button is clicked, the next question, choices, and mystery image are presented.
// The process continues until the results from the last question are rendered.
// The retake button is presented.
// If the retake button is clicked, the quiz is reset.
//
// Considerations: The id, value and name attributes of the button (input) need
// to change based on the state of the app.

View.prototype.reset = function (numQuestions) {
    this.score.empty();
    for (var i = 0; i < numQuestions; i++) {
        this.score.append(this.scoreBallTemplate(i));
    }
}

View.prototype.setButton = function (type) {
    var id, value, name;
    if (type === 'submit') {
        id = 'submit-button';
        value = 'Submit';
    } else if (type === 'next') {
        id = 'next-button';
        value = 'Next';
    } else if (type === 'retake') {
        id = 'retake-button';
        value = 'Try Again';
    }
    this.button.attr('id', value);
    this.button.attr('value', text);
    this.button.attr('name', type);
    return;
}

View.prototype.scoreBallTemplate = function (index) {
    return  '<li class="score-ball ball-' + index +
            '"><img src="images/no-answer-ball.png" ' +
            'height="57" width="57" alt="Score ball">' +
            '</li>';
}

View.prototype.listOptionTemplate = function(number, text) {
    return '<li class="response">' +
            '<input type="radio" name="selection" value="' +
                number + '"><span>' + text + '</span></li>';
}

View.prototype.onSubmit = function() {
    var value = this.button.val();

}

View.prototype.displayQuestion = function (question) {
    // code to display a question
    this.question.text(question.text);
    // display the choices
    var choices = question.choices;
    // Make sure the list of options is empty before appending the new choices.
    this.responseList.empty();
    // Iterate over the list and add the choice to the list
    for (var i = 0; i < choices.length; i++) {
        this.responseList.append(this.listOptionTemplate(i, choices[i]));
    }
    // Display the mystery image
    this.playerImage.attr('src', question.mysteryImg);
}

/**
 * Handles the connection between the view and the model.
 * @param {Object} model Stores and manipulates the data.
 * @param {Object} view  Presents the data and listens for events.
 */
var Controller = function (model, view) {
    this.model = model;
    this.view = view;

    // bindings
    // view.onSubmit = model.gradeResponse.bind(model);
};

// Take the data from the model and render it in the view.
Controller.prototype.updateQuestion = function () {
    this.view.displayQuestion(this.model.getCurrentQuestion());
}

Controller.prototype.setupQuiz = function () {
    var numQuestions = this.model.questions.length;
    this.model.reset();
    this.view.reset(numQuestions);
}

$(document).ready(startQuiz);

// Instantiate the MVC components.
function startQuiz () {
    var model = new Model(questions);
    var view = new View();
    var controller = new Controller(model, view);

    // Get the quiz started.
    controller.setupQuiz();
    controller.updateQuestion();
}


//     // initialize variables and start the quiz.
//     var currentQuestion;
//     startQuiz();

//     function startQuiz() {
//         questionNumber = 0;
//         // Go to the top of the page.
//         scrollToTop();
//         resetScore();
//         setImage('mystery');
//         setButton('submit');
//         updateQuestion();
//     }


//     $('.button').on('click', '#submit-button', function (e) {
//         // Prevent the page from reloading.
//         e.preventDefault();
//         // Check the response and update the score.
//         var judgement;
//         var response = checkResponse();
//         if (response) {
//             judgement = "Well done!";
//         } else {
//             judgement = "Nice try!";
//         }
//         // Set the feedback to present to the user.
//         var feedback = questions[questionNumber].feedback;
//         feedback = judgement + " " + feedback;
//         // Hide the list of choices and display the feedback.
//         $('ul.response-list').hide();
//         $('div.answer').html(
//             '<span>Answer: </span><p class="answer-text">' +
//             feedback + '</p>');
//         $('div.answer').show();
//         // Set the current image to the actual image.
//         setImage('actual');
//         // Change the button depending on where the user is in the quiz.
//         if (questionNumber < 4) {
//             setButton('next');
//         } else {
//             setButton('retake');
//         }
//         // Go to the top of the page - for smaller displays.
//         scrollToTop();

//     });

//     $('.button').on('click', '#next-button', function (e) {
//         // Prevent the button event from reloading the page.
//         e.preventDefault();
//         // Get the new question and answer choices.
//         // Increment the question number.
//         questionNumber += 1;
//         updateQuestion();
//         // Update the image.
//         setImage('mystery');
//         // Show the submit button.
//         setButton('submit');
//         // Go to the top of the page - for smaller displays.
//         scrollToTop();

//     });

//     $('.button').on('click', '#retake-button', function (e) {
//         // Prevent the page reload.
//         e.preventDefault();
//         startQuiz();
//     });

//     function setImage(type) {
//         var image;
//         if (type === 'actual') {
//             // Set the current image to the actual image.
//             image = questions[questionNumber].actualImg;
//         } else if (type === 'mystery') {
//             // Set the image to the mystery image.
//             image = questions[questionNumber].mysteryImg;
//         }
//         $('.player img').attr('src', image);
//         return;
//     }

//     function setButton(value) {
//         var submitHTML =
//             '<input type="submit" id="submit-button" value="Submit" name="submit" />';
//         var nextHTML =
//             '<input type="submit" id="next-button" value="Next" name="next" />';
//         var retakeHTML =
//             '<input type="submit" id="retake-button" value="Try Again" name="retake" />';
//         if (value === 'submit') {
//             $('.button').html(submitHTML);
//         } else if (value === 'next') {
//             $('.button').html(nextHTML);
//         } else if (value === 'retake') {
//             $('.button').html(retakeHTML);
//         }
//         return;
//     }

//     function updateQuestion() {
//         var questionText = questions[questionNumber].text;
//         var choices = questions[questionNumber].choices;
//         var number = questionNumber + 1;

//         // Insert the new question text and the list of choices into the page.
//         $('.question').html(
//             '<span>Question </span><span class="count">' + number +
//             '</span>: <p class="answer-text">' + questionText +
//             '</p>');
//         $('ul.response-list').empty();
//         $('div.answer').hide();
//         $('ul.response-list').show();
//         for (var i = 0; i < choices.length; i++) {
//             $('ul.response-list').append(
//                 '<li class="response"><input type="radio" name="selection" value="' +
//                 i + '"><span>' + choices[i] + '</span></li>');
//         }
//         return;
//     }

//     function checkResponse() {
//         // Add a few variables that will be used to render the correct
//         // score ball depending on the user's response to the question.
//         var choice = $("input[type='radio'][name='selection']:checked")
//             .val();
//         var correctAnswer = questions[questionNumber].answer;
//         var answer;
//         var ball;
//         // Check the response to see if it's right or wrong.
//         if (choice == correctAnswer) {
//             ball = 'images/correct-answer-ball.png';
//             answer = true;
//         } else {
//             ball = 'images/wrong-answer-ball.png';
//             answer = false;
//         }
//         $('li.ball-' + questionNumber + ' img').attr('src', ball);
//         return answer;
//     }

//     function resetScore() {
//         $('ul.tennis-balls').empty();
//         for (var i = 0; i < questions.length; i++) {
//             $('ul.tennis-balls').append('<li class="score-ball ball-' +
//                 i +
//                 '"><img src="images/no-answer-ball.png" height="57" width="57" alt="Score ball"></li>'
//             );
//         }
//     }

//     function scrollToTop() {
//         $(document).scrollTop(0);
//     }
// });
