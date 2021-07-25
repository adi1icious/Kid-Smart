const startBtn = document.querySelector("#start-btn");
const stopBtn = document.querySelector("#stop-btn");
const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = "en-IN";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

startBtn.addEventListener("click", () => {
	recognition.start();
});

stopBtn.addEventListener("click", () => {
	recognition.stop();
});

//let utter = new SpeechSynthesisUtterance("Hi, How are you?");
let utter = new SpeechSynthesisUtterance();
utter.onend= () =>{
	recognition.start();
};

const trigger = [
//0 
["hi", "hey", "hello"],
//1
["how are you", "how are things"],
//2
["what is going on", "what is up"],
//3
["happy", "good", "well", "fantastic", "cool"],
//4
["bad", "bored", "tired", "sad"],
//5
["tell me story", "tell me joke"],
//6
["thanks", "thank you"],
//7
["bye", "good bye", "goodbye"]
];



const alternative=["Same","Go on","Try again","I'm listening","Can you say that again?"];

function compare(trigger, input) {
	if (input.includes(trigger)) {
		return 1;
	}
	else {
		return 0;
	}
}

function getReply(triggerArray, replyArray, text) {
	let item;
	for (let x = 0; x < triggerArray.length; x++) {
   		for (let y = 0; y < replyArray.length; y++) {
   			if (compare(triggerArray[x][y], text)) {
       			items = replyArray[x];
       			item = items[Math.floor(Math.random()*items.length)];
   			}
  		}
	}
	//synth.utter(item);
	return item;
}

function refineTranscript(rawTranscript) {
	let transcript = rawTranscript.toLowerCase().replace(/[^\w\s\d]/gi, "");
	transcript = transcript
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
	.replace(/i am /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "");

	return transcript;
}

let userName = "";

recognition.onresult = (e) => {
	const rawTranscript= e.results[e.results.length-1][0].transcript.trim();
	console.log(rawTranscript);
	const newTranscript = refineTranscript(rawTranscript);

	var reply=[
	//0 
	[`Hello! What's your name?`, `Hi! What's your name?`, `Hey! What's your name?`, `Hi there! What's your name?`], 
	//1
	[
		`Fine... how are you ${userName}?`,
		`Pretty well, how are you ${userName}?`,
		`Fantastic, how are you ${userName}?`
	  ],
	//2
	[
		`Nothing much`,
		`Exciting things!`
	  ],
	//3
	[`Glad to hear it`],
	//4
	[`Why?`, `Cheer up buddy`],
	//5
	[`What about?`, `Once upon a time...`],
	//6
	[`You're welcome`, `No problem`],
	//7
	[`Goodbye ${userName}`, `See you later ${userName}`]
	];

	/*if (transcript === "hello") {
		recognition.stop();
		utter.text = "Hi, How are you?";
		synth.speak(utter);
	}
	else if(transcript === "goodbye") {
		recognition.stop();
		utter.text = "Bye! Hope to see you again!";
		synth.speak(utter);
	}*/

	recognition.stop();
	if (rawTranscript.includes("my name is")) {
		var name = rawTranscript.split("my name is");
		userName = name[1];
		utter.text = "That is a beautiful name!";
		synth.speak(utter);
	}
	else if(getReply(trigger, reply, rawTranscript)) {
    	product = getReply(trigger, reply, rawTranscript);
		utter.text = product;
		synth.speak(utter);
  	}
	else if(getReply(trigger, reply, newTranscript)) {
    	product = getReply(trigger, reply, newTranscript);
		utter.text = product;
		synth.speak(utter);
  	}
  	else{
    	product = alternative[Math.floor(Math.random() * alternative.length)];
		utter.text = product;
		synth.speak(utter);
  	}
}