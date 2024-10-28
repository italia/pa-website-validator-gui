const formElement = document.getElementById('settingsForm');

const submitForm = (e) => {
  const formData = new FormData(formElement);
  e.preventDefault();

  // Converti FormData in un oggetto
  const formObject = Object.fromEntries(formData.entries());

  console.log(formObject);
};
