const startBtn = document.querySelector("#start-btn");
const stopBtn = document.querySelector("#stop-btn");
const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = "en-IN";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;
//synth.lang = 'en-IN';

var voices = speechSynthesis.getVoices();

startBtn.addEventListener("click", () => {
	recognition.start();
});

stopBtn.addEventListener("click", () => {
	recognition.stop();
});

//let utter = new SpeechSynthesisUtterance("Hi, How are you?");
let utter = new SpeechSynthesisUtterance();
utter.lang = "hi-IN";
//utter.rate = 1.5;

utter.onend= () =>{
	recognition.start();
};

const trigger = [
//0 Greetings
["hi", "hey", "hello", "howdy"],
//1 Hows
["how are you", "how are things"],
//2 Whats
["what is going on", "what is up"],
//3 Feeling Good
["happy", "good", "well", "fantastic", "cool", "great"],
//4 Feeling Bad
["bad", "bored", "tired", "sad"],
/*//5 Story
["tell me a story","read me a story"],*/
//5 Poem
["tell me a poem","read me a poem"],
//6
["thanks", "thank you"],
//7 Byes
["bye", "good bye", "goodbye"],
//8
["what is your name", "what are you"],
//9
["nice to meet you"],
//10
["what can you do"],
//11
["what is my name"],
//12
["which grade am I in"],
//13
["how old are you"]
];



const alternative=["Sorry I did not hear that, can you try again","Can you say that again?"];

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
	//.replace(/tell me a /g, "")
    .replace(/ please/g, "");

	return transcript;
}

let userName = "";
let grade="";

recognition.onresult = (e) => {
	const rawTranscript= e.results[e.results.length-1][0].transcript.trim();
	console.log(rawTranscript);
	const newTranscript = refineTranscript(rawTranscript);

	var reply=[
	//0 
	[`Hello, What is your name?`, `Hi, What is your name?`, `Hey, What is your name?`, `Hi there, What is your name?`], 

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
	[`Glad to hear it`, `Happy to hear that ${userName}`],

	//4
	[`Cheer up buddy`],

	/* Stories
	[`Okay here you go ${userName}, this story is called: The Hare and the Tortoise. Once, a hare saw a tortoise walking slowly with a heavy shell on his back. The hare was very proud of himself and he asked the tortoise. “Shall we have a race?" The tortoise agreed. They started the running race. The hare ran very fast. But the tortoise walked very slowly. The proud hair rested under a tree and soon slept off. But the tortoise walked very fast, slowly and steadily and reached the goal. At last, the tortoise won the race.`,
	 `Okay here you go ${userName}, this story is called: The Dog at the Well. A dog and her pups lived on a farm, where there was a well. The mother dog told the pups, do not go near the well or play around it. One of the pups wondered why they shouldn’t go to the well and decided to explore it. He went to the well. Climbed up the wall and peeked inside. In there, he saw his reflection and thought it was another dog. The pup saw that the other dog in the well (his reflection) was doing whatever he was doing, and got angry for imitating him. He decided to fight with the dog and jumped into the well, only to find no dog there. He barked and barked and swam until the farmer came and rescued him. The pup had learned his lesson.`,
	],*/

	//5 Poem
	[`Okay here you go ${userName}, this poem is called: Baa Baa Black Sheep. Baa, baa, black sheep, Have you any wool? Yes, sir, yes, sir, Three bags full; One for the master, And one for the dame, And one for the little boy Who lives down the lane.`,
	 `Okay here you go ${userName}, this poem is called: Twinkle Twinkle Little Star. Twinkle twinkle little star How I wonder what you are? Up above the world so high Like a diamond in the sky Twinkle, twinkle, little star How I wonder what you are?`,
	],

	//6 Welcomes
	[`You're welcome`, `No problem`, `No Worries`],

	//7
	[`Goodbye ${userName}`, `See you later ${userName}`],

	//8
	['I am your Interactive Bot.'],

	//9
	[`Nice to meet you too ${userName}`],

	//10
	[`I can read you stories, poems and talk to you ${userName}.`],
	
	//11
	[`Your name is ${userName}.`],

	//12
	[`You are in ${grade}`],

	//13
	[`I am as old as my creators made me`]
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
		utter.text = `Hello ${userName} That is a beautiful name. Which class are you in?`;
		synth.speak(utter);
	}

	else if (rawTranscript.includes("I am in")) {
		var grades = rawTranscript.split("I am in");
		grade = grades[1];
		utter.text = `Glad to hear that you are in ${grade}. What can I do for you today?`;
		synth.speak(utter);
	}

	else if (newTranscript.includes("bye") || newTranscript.includes("goodbye")) {
		recognition.continuous = false;
		//speechSynthesis.stop();
		product = getReply(trigger, reply, newTranscript);
		utter.text = product;
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
	
	//recognition.start();
}