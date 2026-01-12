document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.querySelector("#image");
  if (!imageInput) return;

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      imageInput.classList.add("is-invalid");
      imageInput.value = ""; // blocks form submit
    } else {
      imageInput.classList.remove("is-invalid");
    }
  });
});
