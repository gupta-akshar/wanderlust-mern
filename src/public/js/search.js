document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const countryFilter = document.getElementById("countryFilter");
  const listings = document.querySelectorAll(".listing-link");

  if (!listings.length) return;

  /* ---------------- Populate country dropdown ---------------- */
  if (countryFilter) {
    const countries = new Set();

    listings.forEach((listing) => {
      const country = listing.dataset.country;
      if (country) countries.add(country);
    });

    [...countries].sort().forEach((country) => {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country.charAt(0).toUpperCase() + country.slice(1);
      countryFilter.appendChild(option);
    });
  }

  /* ---------------- Filtering logic ---------------- */
  function filterListings() {
    const query = searchInput?.value.trim().toLowerCase() || "";
    const selectedCountry = countryFilter?.value || "";

    listings.forEach((listing) => {
      const { title, location, country } = listing.dataset;

      const matchesSearch =
        title.includes(query) ||
        location.includes(query) ||
        country.includes(query);

      const matchesCountry = !selectedCountry || country === selectedCountry;

      listing.style.display =
        matchesSearch && matchesCountry ? "block" : "none";
    });
  }

  /* ---------------- Event listeners ---------------- */
  if (searchInput) {
    searchInput.addEventListener("input", filterListings);
  }

  if (countryFilter) {
    countryFilter.addEventListener("change", filterListings);
  }
});
