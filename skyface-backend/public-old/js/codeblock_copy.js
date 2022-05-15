
const copyButtonLabel = "Copy Code";
console.log("Hello World");

// you can use a class selector instead if you, or the syntax highlighting library adds one to the 'pre'. 
window.onload = function () {
    setTimeout(() => {
        let blocks = document.querySelectorAll("pre");
        console.log("Start Copy Code Buttons");
        blocks.forEach((block) => {
            // only add button if browser supports Clipboard API
            if (navigator.clipboard) {
                console.log("Adding button");
                let button = document.createElement("button");
                button.innerText = copyButtonLabel;
                button.className = "copy-code-button";
                button.addEventListener("click", copyCode);
                block.appendChild(button);
            } else {
                console.log("Clipboard API not supported");
            }
        });
    }, 1000);
}

async function copyCode(event) {
    const button = event.srcElement;
    const pre = button.parentElement;
    let code = pre.querySelector("code");
    let text = code.innerText;
    await navigator.clipboard.writeText(text);

    button.innerText = "Code Copied";

    setTimeout(() => {
        button.innerText = copyButtonLabel;
    }, 1000)
}