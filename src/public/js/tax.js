document.addEventListener("DOMContentLoaded", () => {
  const taxSwitch = document.getElementById("switchCheckDefault");
  const prices = document.querySelectorAll(".price");

  if (!taxSwitch || !prices.length) return;

  taxSwitch.addEventListener("change", () => {
    prices.forEach((priceEl) => {
      const basePrice = Number(priceEl.dataset.price);

      // Toggle between base price and price including 18% tax
      if (taxSwitch.checked) {
        const total = basePrice * 1.18;
        priceEl.innerText = `₹ ${total.toLocaleString("en-in")}`;
      } else {
        priceEl.innerText = `₹ ${basePrice.toLocaleString("en-in")}`;
      }
    });
  });
});
