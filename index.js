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

let utter = new SpeechSynthesisUtterance("Hi, How are you?");
	
utter.onend= () =>{
		recognition.start();
};

recognition.onresult = (e) => {
	const transcript= e.results[e.results.length-1][0].transcript.trim();
	console.log(transcript);

	if (transcript === "hello") {
		recognition.stop();
		utter.text = "Hello, how are you?";
		synth.speak(utter);
	}
	else if(transcript === "goodbye") {
		recognition.stop();
		utter.text = "Bye! Hope to see you again!";
		synth.speak(utter);
	}
}