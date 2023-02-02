/*
 * Created Date: Wednesday, 3rd February 2021, 7:08:22 pm
 * Author: Kingsley Chimezie
 */


 
/* VARIABLES
************************************************************************************/
 // Get elements
let header = document.getElementById('header');
let loader = document.getElementById('loader');
let resultDiv = document.getElementById('result');
let resultHeader = document.getElementById('resultHeader');
let resultImg = document.getElementById('resultImg');
let btnYes = document.getElementById('btnYes');
let btnNo = document.getElementById('btnNo');
let btnChangeAnswer = document.getElementById('btnChangeAnswer');
let lastAnswerDateText = document.getElementById('lastAnswerDate');

// Object used to temporarily store and send data to DB
let dbData = {
    lastAnswer: '',
    lastAnswerDate: '',
    lastAnswerIP: '',
    submissionsArr: []
};

let db;

document.getElementById("btnYes").addEventListener("click", function(){
    document.getElementById("myGif").style.display = "block";
});

/* LOADER
---------------------------------------------------- */
const load = () => {
    // scroll to top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // hide UI content
    header.style.display = 'none';
    loader.style.display = 'block';

    setTimeout(() => { 
        loader.style.display = 'none'; 
        header.style.display = 'inline';
    }, 2000);
};

/* SET UI ELEMENTS
---------------------------------------------------- */
const setUI = () => {
    // set header title
    header.innerHTML = `${uiData.valentinesFirstName} ${uiData.valentinesLastName}<br>${uiData.headerMessage}`;
    
    // Answer is yes
    if (dbData.lastAnswer === 'yes') {
        load();
        resultHeader.innerHTML = uiData.resultHeaderYes;
        lastAnswerDateText.innerHTML = `${uiData.lastAnswerHeading} ${dbData.lastAnswerDate}`;
        resultImg.src = uiData.yesImgLink;
        resultDiv.style.display = 'block';
        btnChangeAnswer.style.display = 'inline';
        lastAnswerDateText.style.display = 'block';
        btnYes.style.display = 'none';
        btnNo.style.display = 'none';
    }
    // Answer is no
    else if (dbData.lastAnswer === 'no') {
        load();
        resultHeader.innerHTML = uiData.resultHeaderNo;
        lastAnswerDateText.innerHTML = `${uiData.lastAnswerHeading} ${dbData.lastAnswerDate}`;
        resultImg.src = uiData.noImgLink;
        resultDiv.style.display = 'block';
        btnChangeAnswer.style.display = 'inline';
        lastAnswerDateText.style.display = 'block';
        btnYes.style.display = 'none';
        btnNo.style.display = 'none';
    }
    // No valid answer (yes / no) available
    else {
        load();
        btnYes.style.display = 'inline';
        btnNo.style.display = 'inline';
        resultDiv.style.display = 'none';
        btnChangeAnswer.style.display = 'none';
        lastAnswerDateText.style.display = 'none';
    }
};
setUI();


/* HIDE UI ELEMENTS
---------------------------------------------------- */
const hideUI = msg => {
    header.innerHTML = msg;
    btnYes.style.display = 'none';
    btnNo.style.display = 'none';
    resultDiv.style.display = 'none';
    btnChangeAnswer.style.display = 'none';
    lastAnswerDateText.style.display = 'none';
};



/* GET PUBLIC IP
************************************************************************************/
const getIP = async () => {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const jsonObj = (res.json()).then(d => dbData.lastAnswerIP = d.ip);
    } catch (err) {
        console.error(err);
    }
}; 



// TRY TO PROCESS FIREBASE DATA, IF ERROR THEN HIDE SOME UI ELEMENTS
/* GET TODAY'S DATE
---------------------------------------------------- */
function getTimestamp() {
    return new Date().toUTCString();
}


/* SET DATA
---------------------------------------------------- */
const setData = (answer) => {
    getIP();
    
    // submissions array cannot be undefined, this will cause an error when using push!
    // if submissions array is undefined 
    if (dbData.submissionsArr === undefined) {
        // set to empty array
        dbData.submissionsArr = [];
    }

    // set data
    dbData.lastAnswer = answer;
    dbData.lastAnswerDate = getTimestamp();
    
    // record a submission only if answer is yes or no
    if (answer === 'yes' || answer === 'no') {
        
        // push submissions array
        dbData.submissionsArr.push({
            answer: dbData.lastAnswer,
            answerDate: dbData.lastAnswerDate,
            submissionIP: dbData.lastAnswerIP
        });

        // send data to Firestore
        setFirebaseDataToLocalObj();
    }
};

/* BUTTONS CLICKED
---------------------------------------------------- */
function yesClicked(){
    document.getElementById("myGif").style.display = "flex";

};

function noClicked(){
    document.getElementById("myGif2").style.display = "flex";
};





