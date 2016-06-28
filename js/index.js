// Array of question objects.
var data = [{
        text: 'which player on the atp tour has won the most grand slam titles?',
        mystery_img: 'images/mystery-federer.png',
        actual_img: 'images/federer.png',
        choices: ['pete sampras', 'rafael nadal',
            'roger federer', 'john mcEnroe'
        ],
        answer: 2,
        feedback: 'roger federer has won 17 grand slam titles including 7 wimbledon, 5 us open, 1 french open, and 4 australian open titles.'
    },

    {
        text: 'this player has won the french open a whopping nine times over a ten year period!',
        mystery_img: 'images/mystery-nadal.png',
        actual_img: 'images/nadal.png',
        choices: ['roger federer', 'rafael nadal',
            'novak djokovic', 'john isner'
        ],
        answer: 1,
        feedback: 'rafael nadal is considered to be "the king of clay" and one of the greatest players ever.'
    },

    {
        text: 'which of these players won the men\'s singles championship at the 2012 olympic games?',
        mystery_img: 'images/mystery-murray.png',
        actual_img: 'images/murray.png',
        choices: ['andy murray', 'novak djokovic',
            'pete sampras', 'andy roddick'
        ],
        answer: 0,
        feedback: 'andy murray is the first british singles champion in over 100 years.'
    },

    {
        text: 'who is the only player to have beaten both roger federer and rafael nadal in all four grand slam events?',
        mystery_img: 'images/mystery-djokovic.png',
        actual_img: 'images/djokovic.png',
        choices: ['andre agassi', 'andy roddick',
            'novak djokovic', 'pete sampras'
        ],
        answer: 2,
        feedback: 'novak djokovic is currently ranked number 1 in the world on the atp tour.'
    },

    {
        text: 'this player won the longest men\'s singles match ever to be played at wimbledon.',
        mystery_img: 'images/mystery-isner.png',
        actual_img: 'images/isner.png',
        choices: ['rafael nadal', 'john mcEnroe',
            'pete sampras', 'john isner'
        ],
        answer: 3,
        feedback: 'john isner defeated nicolaus mahut in 11 hours and 5 minutes. the match was played over a three day period since there are no court lights at wimbledon.'
    }

];

/**
 * Represents a question object.
 * @constructor
 */
var Question = function (name, text, mystery, actual, choices, answer, feedback) {
    this.name = name || "";
    this.mysteryImg = mystery || "";
    this.actualImg = actual || "";
    this.choices = choices || [];
    this.answer = answer || null;
    this.feedback = feedback || "";
};

/**
 * Instantiates the questions and returns an array.
 * @param  {object} data Array of questions as JSON object
 * @return {array} qList Array of question objects
 */
function createQuestion (data) {
    var qList = [], count = 0;
    $.each(data, function(i, question) {
        count += 1;
        var name = "question" + count;
        var q = new Question(name, question.text, question.mystery_img,
            question.actual_img, question.choices, question.answer,
            question.feedback);
        qList.push(q);
    });
    return qList;
}

// Store the question objects in an array.
var questions = createQuestion(data);




$(document).ready(function () {


    // initialize variables and start the quiz.
    var questionNumber;
    startQuiz();

    function startQuiz() {
        questionNumber = 0;
        // Go to the top of the page.
        scrollToTop();
        resetScore();
        setImage('mystery');
        setButton('submit');
        updateQuestion();
    }

    $('.button').on('click', '#submit-button', function (e) {
        // Prevent the page from reloading.
        e.preventDefault();
        // Check the response and update the score.
        var judgement;
        var response = checkResponse();
        if (response) {
            judgement = "Well done!";
        } else {
            judgement = "Nice try!";
        }
        // Set the feedback to present to the user.
        var feedback = questions[questionNumber].feedback;
        feedback = judgement + " " + feedback;
        // Hide the list of choices and display the feedback.
        $('ul.response-list').hide();
        $('div.answer').html(
            '<span>Answer: </span><p class="answer-text">' +
            feedback + '</p>');
        $('div.answer').show();
        // Set the current image to the actual image.
        setImage('actual');
        // Change the button depending on where the user is in the quiz.
        if (questionNumber < 4) {
            setButton('next');
        } else {
            setButton('retake');
        }
        // Go to the top of the page - for smaller displays.
        scrollToTop();

    });

    $('.button').on('click', '#next-button', function (e) {
        // Prevent the button event from reloading the page.
        e.preventDefault();
        // Get the new question and answer choices.
        // Increment the question number.
        questionNumber += 1;
        updateQuestion();
        // Update the image.
        setImage('mystery');
        // Show the submit button.
        setButton('submit');
        // Go to the top of the page - for smaller displays.
        scrollToTop();

    });

    $('.button').on('click', '#retake-button', function (e) {
        // Prevent the page reload.
        e.preventDefault();
        startQuiz();
    });

    function setImage(type) {
        var image;
        if (type === 'actual') {
            // Set the current image to the actual image.
            image = questions[questionNumber].actualImg;
        } else if (type === 'mystery') {
            // Set the image to the mystery image.
            image = questions[questionNumber].mysteryImg;
        }
        $('.player img').attr('src', image);
        return;
    }

    function setButton(value) {
        var submitHTML =
            '<input type="submit" id="submit-button" value="Submit" name="submit" />';
        var nextHTML =
            '<input type="submit" id="next-button" value="Next" name="next" />';
        var retakeHTML =
            '<input type="submit" id="retake-button" value="Try Again" name="retake" />';
        if (value === 'submit') {
            $('.button').html(submitHTML);
        } else if (value === 'next') {
            $('.button').html(nextHTML);
        } else if (value === 'retake') {
            $('.button').html(retakeHTML);
        }
        return;
    }

    function updateQuestion() {
        var questionText = questions[questionNumber].text;
        var choices = questions[questionNumber].choices;
        var number = questionNumber + 1;

        // Insert the new question text and the list of choices into the page.
        $('.question').html(
            '<span>Question </span><span class="count">' + number +
            '</span>: <p class="answer-text">' + questionText +
            '</p>');
        $('ul.response-list').empty();
        $('div.answer').hide();
        $('ul.response-list').show();
        for (var i = 0; i < choices.length; i++) {
            $('ul.response-list').append(
                '<li class="response"><input type="radio" name="selection" value="' +
                i + '"><span>' + choices[i] + '</span></li>');
        }
        return;
    }

    function checkResponse() {
        // Add a few variables that will be used to render the correct
        // score ball depending on the user's response to the question.
        var choice = $("input[type='radio'][name='selection']:checked")
            .val();
        var correctAnswer = questions[questionNumber].answer;
        var answer;
        var ball;
        // Check the response to see if it's right or wrong.
        if (choice == correctAnswer) {
            ball = 'images/correct-answer-ball.png';
            answer = true;
        } else {
            ball = 'images/wrong-answer-ball.png';
            answer = false;
        }
        $('li.ball-' + questionNumber + ' img').attr('src', ball);
        return answer;
    }

    function resetScore() {
        $('ul.tennis-balls').empty();
        for (var i = 0; i < questions.length; i++) {
            $('ul.tennis-balls').append('<li class="score-ball ball-' +
                i +
                '"><img src="images/no-answer-ball.png" height="57" width="57" alt="Score ball"></li>'
            );
        }
    }

    function scrollToTop() {
        $(document).scrollTop(0);
    }
});
