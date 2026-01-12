(() => {
  "use strict";

  // Bootstrap-style client-side form validation
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        // Prevent submission if HTML5 constraints fail
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        // Add validation class to trigger styles
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
