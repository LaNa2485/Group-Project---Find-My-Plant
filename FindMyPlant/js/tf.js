// const URL = "https://teachablemachine.withgoogle.com/models/inrO8JLQD/";
const URL = "https://teachablemachine.withgoogle.com/models/kS1fiqgu5/";

let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

        // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function showData() {
    
}
    // run the webcam image through the image model
async function predict() {
        // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].probability.toFixed(2);
        const leafName = prediction[i].className;
        if (classPrediction > 0.97) {
            if (leafName == "avocado") {
                labelContainer.childNodes[i].innerHTML = "This is an Avocado tree"
            }
            else if (leafName == "begonia") {
                labelContainer.childNodes[i].innerHTML = "This is a Begonia plant"
            }
            else if (leafName == "guava") {
                labelContainer.childNodes[i].innerHTML = "This is a Guava tree"
            }
            else if (leafName == "sour_guava") {
                labelContainer.childNodes[i].innerHTML = "This is a Sour Guava tree"
            }
            else {
                labelContainer.childNodes[i].innerHTML = "No leaf detected"
            }
        }
        else {
            labelContainer.childNodes[i].innerHTML = ""
        }
        // labelContainer.childNodes[i].innerHTML = "This is a " + leafName + " leaf";
        // prediction[i].className + ": " + prediction[i].probability.toFixed(2);    
    }
}

