const text = "Hello World, this is some text to speech";

function onboundaryHandler(event) {
  var textElement = document.getElementById("text");
  textElement.innerText = text;
  var value = textElement.innerHTML;
  var index = event.charIndex;
  var word = getWordAt(value, index);
  var anchorPosition = getWordStart(value, index);
  var activePosition = anchorPosition + word.length;

  textElement.innerHTML =
    value.slice(0, anchorPosition) +
    "<span class='highlight'>" +
    word +
    "</span>" +
    value.slice(activePosition);
}
// Get the word of a string given the string and index
function getWordAt(str, pos) {
  // Perform type conversions.
  str = String(str);
  pos = Number(pos) >>> 0;

  // Search for the word's beginning and end.
  var left = str.slice(0, pos + 1).search(/\S+$/),
    right = str.slice(pos).search(/\s/);

  // The last word in the string is a special case.
  if (right < 0) {
    return str.slice(left);
  }

  // Return the word, using the located bounds to extract it from the string.
  return str.slice(left, right + pos);
}
// Get the position of the beginning of the word
function getWordStart(str, pos) {
  str = String(str);
  pos = Number(pos) >>> 0;
  // Search for the word's beginning
  var start = str.slice(0, pos + 1).search(/\S+$/);
  return start;
}

export default function TextToSpeechComponent() {
  const speekToText = new SpeechSynthesisUtterance();
  speekToText.text = text;

  speekToText.onboundary = onboundaryHandler;
  speekToText.onerror = function (e) {
    console.log("error", e);
  };
  //   speekToText.onend = function (e) {
  //     document.getElementById("text").innerText = text;
  //   };

  return (
    <div>
      <button
        onClick={() => {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(speekToText);
        }}
      >
        Speak
      </button>
      <p id="text">{text}</p>
    </div>
  );
}
