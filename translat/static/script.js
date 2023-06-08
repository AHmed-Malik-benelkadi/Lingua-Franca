function fetchData() {
  const inputData = document.getElementById('input_data');
  const destLanguage = document.getElementById('dest_language');
  const srcLanguage = document.getElementById('src_language');
  const para = document.getElementById('msg_error');
  const sugg = document.getElementById('sugg');

  if (destLanguage.value === "select") {
    para.textContent = "Please select the destination language!";
    return;
  }
  if (inputData.value === "") {
    para.textContent = "Please complete the text area!";
    return;
  }

  fetch(`/?inputData=${inputData.value}&srcLanguage=${srcLanguage.value}&destLanguage=${destLanguage.value}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(data => {
      console.log('Server Response:', data);
      document.getElementById('output_text').value = data.translation;

      if (data.detectSrc !== data.src) {
        sugg.textContent = "Detected language: ";
        const link = document.createElement("a");
        const src = document.getElementById('src_language');
        link.textContent = data.detectSrc;
        link.style.cursor = "pointer";
        link.addEventListener("click", () => {
          src.value = data.detectSrc;
          sugg.textContent = "";
          link.textContent = "";
          fetchData(); // Call the fetchData() function again with the detected language
        });
        sugg.appendChild(link);
      } else {
        sugg.textContent = "";
      }

      const iconElement = document.getElementById('iconElement');
      iconElement.classList.add('icon-rotate'); // Add the icon rotation class
    })
    .catch(error => {
      console.error('Error:', error);
    });

  para.textContent = "";
}

function invertLanguages() {
  const srcLanguage = document.getElementById('src_language');
  const destLanguage = document.getElementById('dest_language');

  // Invert the selected languages
  const temp = srcLanguage.value;
  srcLanguage.value = destLanguage.value;
  destLanguage.value = temp;

  const iconElement = document.getElementById('iconElement');
  iconElement.classList.toggle('icon-rotate'); // Toggle the icon rotation class
}
