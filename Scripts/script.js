window.onload = function () {
  const selectElement = document.querySelector('select.form-select');
  const inputFields = document.getElementById("inputFields");
  const canvas = document.getElementById("pieChart");
  const pieCanvas = canvas.getContext("2d");
  const generateButton=document.getElementById("generateButton");
  const playAudioButton=document.getElementById("audioApi");
  let audio1=new Audio();
  let audio2=new Audio();
  audio2.src="fail.mp3";
  audio1.src="sound.mp3";
  let audioAPI=document.getElementById("audioApi");

  function playAudioSlices (){
  const sliceCount = parseInt(selectElement.value);
   if(sliceCount>0){
      const message= new SpeechSynthesisUtterance("You chose " +sliceCount.toString() + " slices, input data, then click generate to draw the pie chart");
      speechSynthesis.speak(message);
    }
  }
  function playAudioInput(value){
    const message= new SpeechSynthesisUtterance(value.toString());
    speechSynthesis.speak(message);
  }
  function generateFields() {
    const sliceCount = parseInt(selectElement.value);
    
    inputFields.innerHTML = "";

    if (sliceCount > 0) {
      for (let i = 1; i <= sliceCount; i++) {
          const inputContainer = document.createElement("div");
          const labelText = document.createElement("label");

        const labelInput = document.createElement("input");
        labelInput.type = "text";  

        labelInput.placeholder = "Label";
        labelInput.name = `label${i}`;


        labelInput.addEventListener("input", validateInput);
        //labelInput.addEventListener("input", drawPieChart);

        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.placeholder = "Value";
        valueInput.name = `value${i}`;

        valueInput.addEventListener("input", validateInput);
        //valueInput.addEventListener("input", drawPieChart);
        valueInput.addEventListener("focus", function(){
          playAudioInput(valueInput.value);});

        const colorPicker = document.createElement("input");
        colorPicker.value = "#" + Math.floor(Math.random() * 16777215).toString(16);
        colorPicker.type = "color";
        colorPicker.name = `color${i}`;
        //colorPicker.addEventListener("input", drawPieChart);

        inputContainer.appendChild(labelText);
        inputContainer.appendChild(labelInput);
        inputContainer.appendChild(valueInput);
        inputContainer.appendChild(colorPicker);

        inputFields.appendChild(inputContainer);
        
      }
      playAudioSlices();
    }
    //drawPieChart();
  }
  function validateInput(){
    const sliceCount=parseInt(selectElement.value);
    let isValid=true;

    for(let i=1; i<=sliceCount; i++){
      const labelInput=document.querySelector(`input[name="label${i}"]`);
      const valueInput = document.querySelector(`input[name="value${i}"]`);

      

    const labelValue = labelInput.value.trim();
    const valueValue = valueInput.value.trim();
    labelInput.style.border = "";
    valueInput.style.border = "";

    if (labelValue.length < 3) {
      labelInput.style.border = "2px solid red";
      isValid=false;
    }

    if (!/^[0-9]+$/.test(valueValue)) {
      valueInput.style.border = "2px solid red";
      isValid=false;
  }
    }
    return isValid;

  }

  function drawPieChart() {
    pieCanvas.clearRect(0, 0, canvas.width, canvas.height);

    const sliceCount = parseInt(selectElement.value);
    const data = [];
    let totalValues = 0;

    for (let i = 1; i <= sliceCount; i++) {
      const label = document.querySelector(`input[name="label${i}"]`).value;
      const value = parseFloat(document.querySelector(`input[name="value${i}"]`).value);
      const color = document.querySelector(`input[name="color${i}"]`).value;

      if (label && !isNaN(value)) {
        data.push({ label, value, color });
        totalValues += value;
      }
    }

    
    let startAngle = 0;

    for (let i = 0; i < data.length; i++) {
      const slice = (data[i].value / totalValues) * 2 * Math.PI;
      const sliceMiddleAngle = startAngle + slice / 2;

      pieCanvas.beginPath();
      pieCanvas.moveTo(canvas.width / 2, canvas.height / 2);
      pieCanvas.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 3,
        startAngle,
        startAngle + slice,
        false
      );
      pieCanvas.fillStyle = data[i].color;
      pieCanvas.fill();

      pieCanvas.strokeStyle = "black";
      pieCanvas.lineWidth = 4;
      pieCanvas.stroke();

      const labelX = canvas.width / 2 + (canvas.width / 4) * Math.cos(sliceMiddleAngle);
      const labelY = canvas.height / 2 + (canvas.width / 4) * Math.sin(sliceMiddleAngle);
      pieCanvas.font = "bold 14px Arial";
      pieCanvas.fillStyle = "black";
      pieCanvas.fillText(data[i].label, labelX, labelY - 20);
      pieCanvas.fillText(
        `(${((data[i].value / totalValues) * 100).toFixed(2)}%)`,
        labelX,
        labelY
      );
      startAngle += slice;
    }
  }
  generateButton.addEventListener("click", function() {
    if (!validateInput()) {
      audio2.play();
      alert("The attributes are not correct. Please try again.");
      return;
    }
    audio1.play();
    drawPieChart();
  });
  //generateButton.addEventListener("click", drawPieChart);
  playAudioButton.addEventListener("click", function(){
    playAudioSlices();
  });
  generateFields();
 

  selectElement.addEventListener("change", generateFields);

};