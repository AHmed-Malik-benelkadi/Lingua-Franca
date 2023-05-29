let contentGenerated = false;  // To avoid multiple calls to the API when the user clicks on the button

        function fetchData() { // Function called when the user clicks on the button
            let inputData = document.getElementById('input_data');
            let destLanguage = document.getElementById('dest_language');
            let srcLanguage = document.getElementById('src_language');
            let para = document.getElementById('msg_error');
            let sugg = document.getElementById('sugg');

            if (contentGenerated) { // If the content has already been generated, we do not call the API again
                return;
            }

            if (destLanguage.value === "select") { // If the user has not selected a destination language, we display an error message
                para.textContent = "Please select the destination language !";
            } else if (inputData.value === "") {
                para.textContent = "Please complete the text area !";
            } else {
                fetch(`/?inputData=${inputData.value}&srcLanguage=${srcLanguage.value}&destLanguage=${destLanguage.value}`, { // We call the API
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Réponse du serveur:', data);
                        document.getElementById('output_text').value = data.translation;
                        let divIcon = document.querySelector('.icon');
                        let iconElement = document.createElement('i');
                        divIcon.appendChild(iconElement);
                        iconElement.style.cursor = "pointer";
                        iconElement.classList.add('fa-solid', 'fa-arrows-rotate');
                        iconElement.addEventListener("click", () => {
                            let tempSelectValue = srcLanguage.value;
                            if (srcLanguage.value === "auto") {
                                srcLanguage.value = destLanguage.value;
                                destLanguage.value = data.detectSrc;
                            }
                            else {
                                srcLanguage.value = destLanguage.value;
                                destLanguage.value = tempSelectValue;
                            }
                            let tempTextareaValue = inputData.value;
                            inputData.value = document.getElementById('output_text').value;
                            document.getElementById('output_text').value = tempTextareaValue;
                            sugg.textContent = "";
                            link.textContent = "";
                        });
                        if (data.detectSrc != data.src) { // If the detected language is different from the source language, we display a suggestion
                            sugg.textContent = "Detected language: ";
                            let link = document.createElement("a");
                            let src = document.getElementById('src_language');
                            link.textContent = data.detectSrc;
                            link.style.cursor = "pointer";
                            link.addEventListener("click", () => { // If the user clicks on the suggestion, we change the source language

                                for (let i = 0; i < src.options.length; i++) {
                                    if (src.options[i].value === data.detectSrc) {
                                        src.selectedIndex = i;
                                    }
                                }
                                sugg.textContent = "";
                                link.textContent = "";

                            });
                            sugg.appendChild(link);
                        } else {
                            sugg.textContent = "";
                        }
                        contentGenerated = true;
                    })
                    .catch(error => { // If an error occurs, we display it in the console
                        console.error('Erreur:', error);
                    });
                para.textContent = "";
            }
        }