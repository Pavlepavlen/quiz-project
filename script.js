
// Quiz Controller

var quizController = (function() {

    // Question Constructor
    function Question(id, text, options, answer) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.answer = answer;
    }

    var questionLocalStorage = {
        setQuestionCollection: function(newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },

        getQuestionCollection: function() {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },

        removeQuestionCollection: function() {
            localStorage.removeItem('questionCollection');
        }
    };

    if(questionLocalStorage.getQuestionCollection() === null){
        questionLocalStorage.setQuestionCollection([]);
    }

    var quizProgress = {
        questionIndex: 0
    }

    // Person Constructor
    function Person (id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    var currentPersonData = {
        fullname: [],
        score: 0
    }

    var adminFullName = ['Admin', 'Admin'];

    var personLocalStorage = {
        setPersonData: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function() {
            localStorage.removeItem('personData');
        }
    }

    if(personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {

        getQuizProgress: quizProgress,

        getQuestionFromLocalStorage: questionLocalStorage,

        addQuestionToLocalStorege: function (newQuestionText, options) {
            var optionsArray, correctAnswer, questionId, newQuestion, getStoredQuestions, isChecked;

            isChecked = false;

            // local storage check
            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            optionsArray = [];

            // adding options to array
            for(var i = 0; i < options.length; i++) {
                if(options[i].value !== '') {
                    optionsArray.push(options[i].value);
                }

                if(options[i].previousElementSibling.checked && options[i].value !== '') {
                    correctAnswer = options[i].value;
                    isChecked = true;
                }
            }

            // gives id to question
            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            // checking are all filds is entered and adding question to localStorage
            if(newQuestionText.value !== '') {

                if(optionsArray.length > 1) {

                    if(isChecked) {

                        newQuestion = new Question(questionId, newQuestionText.value, optionsArray, correctAnswer);

                        getStoredQuestions = questionLocalStorage.getQuestionCollection();

                        getStoredQuestions.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuestions);

                        newQuestionText.value = '';

                        for (var x = 0; x < options.length; x++) {
                            options[x].value = '';
                            options[x].previousElementSibling.checked = false;
                        }

                        return true;

                    } else {
                        alert('Please, choose correct answer'); 
                        return false;
                    }
                } else { 
                 alert('Please, add at least two options'); 
                 return false;
             }
            }else {
                alert('Please, add new question'); 
                return false;
            }

            
        },

        checkAnswer: function(answer) {

            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].answer === answer.textContent){
                
                currentPersonData.score += 1; 

                return true;

            } else {
                
                return false;

            }
        },

        isFinished: function() {

            return quizProgress.questionIndex + 1 >= questionLocalStorage.getQuestionCollection().length;

        },

        addPersonToLocalStorage: function () {
            var newPerson;
            var personId;
            var personData;

            if(personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length -1].id + 1;
            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currentPersonData.fullname[0], currentPersonData.fullname[1], currentPersonData.score);

            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);


        },

        getCurrentPersonData: currentPersonData,

        getAdminFullName: adminFullName,

        getPersonLocalStorage: personLocalStorage,



    }

})();

// User Interface Controller

var UIController = (function() {

    var domItems = {
        // Admin Panel Elements
        questionInsertButton: document.querySelector('#question-insert-btn'),
        newQuestionText: document.querySelector('#new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector('.admin-options-container'),
        bottomQuestionsWrapper: document.querySelector('.inserted-questions-wrapper'),
        updateAdminButton: document.querySelector('#question-update-btn'),
        deleteAdminButton: document.querySelector('#question-delete-btn'),
        questionsClearBtn: document.querySelector('#questions-clear-btn'),
        resultsField: document.querySelector('.results-list-wrapper'),
        clearResultsButton: document.querySelector('#results-clear-btn'),
        deleteResultButtons: document.querySelectorAll('.delete-result-btn'),


        // Quiz Section
        askedQuestionText: document.querySelector('#asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        quizProgressBar: document.querySelector('.progressBar'),
        progressBar: document.querySelector('progress'),
        progressPar: document.querySelector('#progress'),
        instantAnswerContainer: document.querySelector('.instant-answer-container'),
        instantAnswerText: document.getElementById('instant-answer-text'),
        instantAnswerEmotion: document.getElementById('emotion'),
        nextQuestionButton: document.getElementById('next-question-btn'),  

        //Landing Page Section
        startQuizButton: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),

        // Section
        finalResult: document.querySelector('#final-score-text'),
        logoutButtons: document.querySelectorAll('.logout-button'),

        //Pages
        landingPage: document.querySelector('.landing-page-container'),
        quizPage: document.querySelector('.quiz-container'),
        adminPage: document.querySelector('.admin-panel-container'),
        finalPage: document.querySelector('.final-result-container'),



    };

    return {

        getDomItems: domItems,

        // adding new inputs
        addInputs: function () {

            var addInput = function() {

                var newInputForOptionHTML, counter;

                counter = document.querySelectorAll('.admin-option').length;

                newInputForOptionHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ counter +'" name="answer" value="1"><input type="text" class="admin-option admin-option-'+ counter +'" value=""></div>';

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', newInputForOptionHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput)
            }

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        createQuestionList: function(getQuestionsFromLocalStorage) {
           
            domItems.bottomQuestionsWrapper.innerHTML = "";

            var questionListHTML = '';

            if(getQuestionsFromLocalStorage.getQuestionCollection() === null) {
                getQuestionsFromLocalStorage.setQuestionCollection([]);
            }


            for(var i = 0; i < getQuestionsFromLocalStorage.getQuestionCollection().length; i++) {
                questionListHTML = '<p><span>' + ( i + 1 ) + '.'+ getQuestionsFromLocalStorage.getQuestionCollection()[i].text +'</span><button id="question-'+getQuestionsFromLocalStorage.getQuestionCollection()[i].id+'">Edit</button></p>';

                console.log(getQuestionsFromLocalStorage.getQuestionCollection()[i].id);

                domItems.bottomQuestionsWrapper.insertAdjacentHTML('afterbegin', questionListHTML);
            }

        },

        editQuestionList: function(event, storageQuestionList, addInputsDynamicalyFunction, updateQuestionListFunction) {
            
            var getId, getStorageQuestionList, foundItem, placeInArr, optionHTML;

            if(event.target.id) {

                getId = +event.target.id.split('-')[1];

                getStorageQuestionList = storageQuestionList.getQuestionCollection();

                for (var i = 0; i < getStorageQuestionList.length; i++) {
                    if(getStorageQuestionList[i].id === getId) {
                    
                        foundItem = getStorageQuestionList[i];

                        placeInArr = i;

                    }
                }

                optionHTML = '';

                domItems.newQuestionText.value = foundItem.text;

                domItems.adminOptionsContainer.innerHTML = "";

                for (var i = 0; i < foundItem.options.length; i++) {

                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ i +'" name="answer" value="'+ i +'"><input type="text" class="admin-option admin-option-'+ i +'" value="'+ foundItem.options[i] +'"></div>'
                    
                } 

                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.updateAdminButton.style.visibility = 'visible';
                domItems.deleteAdminButton.style.visibility = 'visible';
                domItems.questionInsertButton.style.visibility = 'hidden';
                domItems.questionsClearBtn.style.pointerEvents = 'none';

                addInputsDynamicalyFunction();

                var makeDefaultView = function() {

                    var listItemsHTML;

                    listItemsHTML = '';

                    domItems.updateAdminButton.style.visibility = 'hidden';
                    domItems.deleteAdminButton.style.visibility = 'hidden';
                    domItems.questionInsertButton.style.visibility = 'visible';
                    domItems.questionsClearBtn.style.pointerEvents = '';

                    domItems.newQuestionText.value = '';
                    domItems.adminOptionsContainer.innerHTML = '';

                    for(var i = 0; i < 2; i++){
                        listItemsHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ i +'" name="answer" value="'+ i +'"><input type="text" class="admin-option admin-option-'+ i +'" value=""></div>';
                    }
                    domItems.adminOptionsContainer.innerHTML = listItemsHTML;
                    
                    addInputsDynamicalyFunction();
                    updateQuestionListFunction(storageQuestionList);

                }
                
                var updateQuestion = function() {

                    var newOptions, optionElements;

                    newOptions = [];

                    optionElements = document.querySelectorAll('.admin-option');

                    foundItem.text = domItems.newQuestionText.value;

                    foundItem.answer = '';


                    for (var i = 0; i < optionElements.length; i++) {
                        if (optionElements[i].value !== '') {

                        newOptions[i] = optionElements[i].value;

                            if (optionElements[i].previousElementSibling.checked) {

                                foundItem.answer = optionElements[i].value;

                            }
                        }
                    }

                    foundItem.options = newOptions;

                    if(foundItem.text !== '') {

                        if(foundItem.options.length > 1) {

                            if(foundItem.answer !== '') {

                                getStorageQuestionList.splice(placeInArr, 1, foundItem);

                                storageQuestionList.setQuestionCollection(getStorageQuestionList);

                                makeDefaultView();
                            

                            } else {
                                alert('Please, choose correct answer');
                            }
                        } else {
                            alert('Please, enter at least two options');
                        }
                    }    else {
                    alert('Please, enter the question');
                    }

                }

                var deleteQuestion = function () {

                    getStorageQuestionList.splice(placeInArr, 1);

                    storageQuestionList.setQuestionCollection(getStorageQuestionList);
                   
                    makeDefaultView();

                }             

                domItems.updateAdminButton.onclick = updateQuestion;

                domItems.deleteAdminButton.onclick = deleteQuestion;

            }
        },

        deleteQuestionList: function(storageQuestionList) {

            if(storageQuestionList.getQuestionCollection() !== null) {

                if(storageQuestionList.getQuestionCollection().length >= 1) {

                    var conformation = confirm('Are you sure, you want to delete all questions');

                    if (conformation) {

                    storageQuestionList.removeQuestionCollection();

                    domItems.bottomQuestionsWrapper.innerHTML = '';

                    };

                };
            } else {

                    alert('You have already clear list');
                };

        },

        displayQuestion: function(storageQuestionList, quizProgress) {

                var optionsHTML, charactersArray;

                charactersArray = ['a','b','c','d','e','f','g'];

                if(storageQuestionList.getQuestionCollection().length > 0) {
                    optionsHTML = '';

                    domItems.askedQuestionText.innerText = storageQuestionList.getQuestionCollection()[quizProgress.questionIndex].text;

                    domItems.quizOptionsWrapper.innerHTML = '';

                    for(var i = 0; i < storageQuestionList.getQuestionCollection()[quizProgress.questionIndex].options.length; i++) {
                        
                        optionsHTML = '<div class="choice-'+ i +'"><span class="choice-'+ i +'">'+ charactersArray[i] +'</span><p  class="choice-'
                        + i +'">'+storageQuestionList.getQuestionCollection()[quizProgress.questionIndex].options[i]+'</p></div>';

                        domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', optionsHTML);
                    }

                }
            //}

        },

        displayProgress: function(storageQuestionList, quizProgress) {

            var questionProgressHTML = '<p id="progress">'+(+(quizProgress.questionIndex+1))+'/'+storageQuestionList.getQuestionCollection().length+'</p><progress value="'+((+quizProgress.questionIndex) + 1) +'" max="'+storageQuestionList.getQuestionCollection().length+'"></progress>';


            domItems.quizProgressBar.innerHTML = '';

            domItems.quizProgressBar.insertAdjacentHTML('beforeend',questionProgressHTML); 

        },

        newDesign: function(answerResult, selectedAnswer) {

            var twoOptions, index;

            index = 0;

            if (answerResult) {
                index = 1;
            }

            twoOptions = {
                instantAnswerText: ['This is a wrong answer','This is a correct answer'],
                instantAnswerClass: ['red','green'],
                instantAnswerIcon: ['images/sad.png','images/happy.png'],
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            }

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none";

            domItems.instantAnswerContainer.style.opacity = "1";

            domItems.instantAnswerText.textContent = twoOptions.instantAnswerText[index];
            domItems.instantAnswerText.parentElement.className = twoOptions.instantAnswerClass[index];
            domItems.instantAnswerEmotion.src = twoOptions.instantAnswerIcon[index];

            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];

        },

        resetDesign: function() {

            domItems.quizOptionsWrapper.style.cssText = "";

            domItems.instantAnswerContainer.style.opacity = "0";

        },

        getFullName: function(currentPersonData, storageQuestionList, admin) {

            if(storageQuestionList.getQuestionCollection() === null) {
                storageQuestionList.setQuestionCollection([]);
            }

            var isAdmin = function () {
                if(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1]) {
                    return true;
                } else return false;
            }

                if (storageQuestionList.getQuestionCollection().length !== 0) {
                
                    if(domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {


                            
                                if(!isAdmin()) {
                                    currentPersonData.fullname.push(domItems.firstNameInput.value);
                                    currentPersonData.fullname.push(domItems.lastNameInput.value);

                                    domItems.landingPage.style.display = 'none';
                                    domItems.quizPage.style.display = 'block';
                            
                                }   else {
                                domItems.landingPage.style.display = 'none';
                                domItems.adminPage.style.display = 'block';
                            }

                    } else {
                            alert('Please enter the name and last name');
                        }
            } else if (isAdmin()) {
                domItems.landingPage.style.display = 'none';
                domItems.adminPage.style.display = 'block';
            } else {
                alert('There is no prepared questions');
            }
        },

        finalResult: function(currentPersonData) {
            
            
            domItems.finalResult.textContent = currentPersonData.fullname[0] + " " + currentPersonData.fullname[1] + " ,your final score is " + currentPersonData.score;
            domItems.finalResult.style.textDecoration = 'underline'; 

            domItems.quizPage.style.display = 'none';

            domItems.finalPage.style.display = 'block';

        },

        addResultOnPanel: function (userData) {

            users = userData.getPersonData();
            var results = '';

            domItems.resultsField.innerHTML = '';

            for(var i = 0; i < users.length; i++) {
                results += '<p class="person person-' + i + '"><span class="person-' + i + '">' +
                users[i].firstname + ' ' + users[i].lastname + ' - ' + users[i].score + '</span><button id="delete-result-btn_'
                + users[i].id + '" class="delete-result-btn">Delete</button></p>'; 
            };

            domItems.resultsField.insertAdjacentHTML('afterbegin', results);



        },

        deleteResult: function(event, userData) {

            var getId, personsArray;

            personsArray = userData.getPersonData();

            if('delete-result-btn_'.indexOf(event.target.id)) {

                getId = parseInt(event.target.id.split('_')[1]);

                for(var i = 0; i < personsArray.length; i++) {

                    if(personsArray[i].id === getId) {
                        personsArray.splice(i, 1);
                        userData.setPersonData(personsArray);
                        console.log('hello');
                    }
                }

            };

        },

        clearResults: function (userData) {

            if(userData.getPersonData().length !== 0) {
                if(confirm('Are you sure to delete all results')) {
                    userData.setPersonData([]);
                }
            } else {
                alert('Your list are already clear');
            }
            
        }

        
    };

})();

// Comunication Controller

var communicateController = (function(quizCont, UICont) {

    var selectedDomItems = UICont.getDomItems;

    UICont.addInputs();

    UICont.createQuestionList(quizCont.getQuestionFromLocalStorage);

    selectedDomItems.questionInsertButton.addEventListener('click', function() {

        // variable for having up-to-date elements
    var adminOptions = document.querySelectorAll('.admin-option');

       var checkBoolean =  quizCont.addQuestionToLocalStorege(selectedDomItems.newQuestionText, adminOptions);

       if(checkBoolean) {

            UICont.createQuestionList(quizCont.getQuestionFromLocalStorage);

       }
    });

    selectedDomItems.bottomQuestionsWrapper.addEventListener('click', function(e) {
        UICont.editQuestionList(e, quizCont.getQuestionFromLocalStorage, UICont.addInputs, UICont.createQuestionList);

    });

    selectedDomItems.questionsClearBtn.addEventListener('click', function () {

        UICont.deleteQuestionList(quizCont.getQuestionFromLocalStorage)

    });

    UICont.displayQuestion(quizCont.getQuestionFromLocalStorage, quizCont.getQuizProgress);

    UICont.displayProgress(quizCont.getQuestionFromLocalStorage, quizCont.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {

        var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for(var i = 0; i < updatedOptionsDiv.length; i++) {

            if(e.target.className === 'choice-' + i) {
                
                var answer = document.querySelector('.quiz-options-wrapper div p.'+e.target.className);

                var answerResult = quizCont.checkAnswer(answer);

                UICont.newDesign(answerResult, answer);

                if(quizCont.isFinished()) {
                    selectedDomItems.nextQuestionButton.textContent = 'Finished';
                }

                var nextQuestion = function (questionData, progress) {

                    if(quizCont.isFinished()) {

                        //Finish Quiz

                        quizController.addPersonToLocalStorage();

                        UICont.finalResult(quizCont.getCurrentPersonData);

                    } else {

                        UICont.resetDesign();

                        quizCont.getQuizProgress.questionIndex = quizCont.getQuizProgress.questionIndex + 1;

                        UICont.displayQuestion(quizCont.getQuestionFromLocalStorage, quizCont.getQuizProgress);

                        UICont.displayProgress(quizCont.getQuestionFromLocalStorage, quizCont.getQuizProgress);

                    }

                }

                selectedDomItems.nextQuestionButton.onclick = function () {

                    nextQuestion(quizCont.getQuestionFromLocalStorage, quizController.getQuizProgress);

                }

            }

        }

    });

    selectedDomItems.startQuizButton.addEventListener('click', function() {

        UICont.getFullName(quizCont.getCurrentPersonData, quizController.getQuestionFromLocalStorage, quizCont.getAdminFullName);

    });

    selectedDomItems.lastNameInput.addEventListener('focus', function() {

        selectedDomItems.lastNameInput.addEventListener('keypress', function(e) {
            
            if(e.keyCode === 13) {
                UICont.getFullName(quizCont.getCurrentPersonData, quizController.getQuestionFromLocalStorage, quizCont.getAdminFullName);
            }

        });

    });

    UICont.addResultOnPanel(quizCont.getPersonLocalStorage);

    selectedDomItems.resultsField.addEventListener('click', function (e) {

        UICont.deleteResult(e, quizCont.getPersonLocalStorage);
        UICont.addResultOnPanel(quizCont.getPersonLocalStorage);

    });

    selectedDomItems.clearResultsButton.addEventListener('click', function () {
        UICont.clearResults(quizCont.getPersonLocalStorage);
        UICont.addResultOnPanel(quizCont.getPersonLocalStorage);
    })

})(quizController, UIController);