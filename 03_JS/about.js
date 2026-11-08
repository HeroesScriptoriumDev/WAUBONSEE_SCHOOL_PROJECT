
document.addEventListener("DOMContentLoaded", () => {

  /* ===================================
     ELEMENTS
  =================================== */

  const wheel = document.querySelector(".wheel-nav");

  const buttons = Array.from(
    document.querySelectorAll(".wheel-item")
  );

  const views = Array.from(
    document.querySelectorAll(".content-view")
  );

  const previousButton =
    document.getElementById("wheel-prev");

  const nextButton =
    document.getElementById("wheel-next");

  const currentLabel =
    document.getElementById("wheel-current");

  const pageTitle =
    document.getElementById("page-title");

  const totalItems = buttons.length;

  if (!wheel || totalItems === 0) return;

  /* ===================================
     SECTION TITLES
  =================================== */

  const titles = {
    "profile": "Profile",
    "education": "Education",
    "military": "Military",
    "work-history": "Work History",
    "development": "Professional Development",
    "video-animation": "Video & Animation",
    "skills": "Skills",
    "socials": "Socials"
  };

  /* ===================================
     WHEEL STATE
  =================================== */

  let currentIndex = 0;

  // Continuous angle for smooth rotation.
  let wheelRotation = 0;

  const angleStep = 360 / totalItems;

  /* ===================================
     ROTATE AND POSITION ITEMS
  =================================== */

  function updateWheel() {

    buttons.forEach((button, index) => {

      const angle =
        index * angleStep + wheelRotation;

      button.style.setProperty(
        "--angle",
        `${angle}deg`
      );

      const isActive = index === currentIndex;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });

  }

  /* ===================================
     CHANGE CONTENT VIEW
  =================================== */

  function changeView(index, updateHash = true) {

    // Wrap around the first and last items.
    const normalizedIndex =
      ((index % totalItems) + totalItems) % totalItems;

    // Find the shortest rotational distance.
    let difference = normalizedIndex - currentIndex;

    if (difference > totalItems / 2) {
      difference -= totalItems;
    }

    if (difference < -totalItems / 2) {
      difference += totalItems;
    }

    wheelRotation -= difference * angleStep;

    currentIndex = normalizedIndex;

    const selectedButton = buttons[currentIndex];

    const viewName = selectedButton.dataset.view;

    const title =
      titles[viewName] || selectedButton.getAttribute("aria-label");

    // Display only the selected content.
    views.forEach(view => {

      const isSelected =
        view.dataset.view === viewName;

      view.classList.toggle(
        "active",
        isSelected
      );

      view.hidden = !isSelected;

    });

    // Update the main page state.
    document.body.dataset.view = viewName;

    // Update labels.
    currentLabel.textContent = title;
    pageTitle.textContent = title;

    // Update page metadata.
    document.title = `${title} | Digital Portfolio`;

    // Update wheel rotation and highlighting.
    updateWheel();

    // Update URL without reloading.
    if (updateHash) {

      const newHash =
        `#${encodeURIComponent(viewName)}`;

      if (window.location.hash !== newHash) {
        history.replaceState(null, "", newHash);
      }

    }

  }

  /* ===================================
     DIRECT BUTTON SELECTION
  =================================== */

  buttons.forEach((button, index) => {

    button.addEventListener("click", () => {
      changeView(index);
    });

  });

  /* ===================================
     PREVIOUS BUTTON
  =================================== */

  previousButton.addEventListener("click", () => {
    changeView(currentIndex - 1);
  });

  /* ===================================
     NEXT BUTTON
  =================================== */

  nextButton.addEventListener("click", () => {
    changeView(currentIndex + 1);
  });

  /* ===================================
     MOUSE WHEEL NAVIGATION
  =================================== */

  let wheelLocked = false;

  wheel.addEventListener("wheel", (event) => {

    event.preventDefault();

    if (wheelLocked) return;

    if (Math.abs(event.deltaY) < 2) return;

    wheelLocked = true;

    const direction =
      event.deltaY > 0 ? 1 : -1;

    changeView(currentIndex + direction);

    // Prevent rapid trackpad input from
    // skipping through multiple sections.
    setTimeout(() => {
      wheelLocked = false;
    }, 400);

  }, { passive: false });

  /* ===================================
     KEYBOARD NAVIGATION
  =================================== */

  wheel.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight" ||
        event.key === "ArrowDown") {

      event.preventDefault();

      changeView(currentIndex + 1);

      buttons[currentIndex].focus();

    }

    if (event.key === "ArrowLeft" ||
        event.key === "ArrowUp") {

      event.preventDefault();

      changeView(currentIndex - 1);

      buttons[currentIndex].focus();

    }

    if (event.key === "Home") {

      event.preventDefault();

      changeView(0);

      buttons[currentIndex].focus();

    }

    if (event.key === "End") {

      event.preventDefault();

      changeView(totalItems - 1);

      buttons[currentIndex].focus();

    }

  });

  /* ===================================
     URL HASH NAVIGATION
  =================================== */

  function loadViewFromHash() {

    const hash = decodeURIComponent(
      window.location.hash.substring(1)
    );

    const index = buttons.findIndex(
      button => button.dataset.view === hash
    );

    if (index !== -1) {
      changeView(index, false);
    } else {
      changeView(0, false);
    }

  }

  window.addEventListener(
    "hashchange",
    loadViewFromHash
  );

  /* ===================================
     INITIALIZATION
  =================================== */

  loadViewFromHash();

});

"use strict";

(() => {
    const toggleButton = document.querySelector("#toggle-project-form");
    const formPanel = document.querySelector("#project-form-panel");
    const form = document.querySelector("#project-request-form");
    const summary = document.querySelector("#project-request-summary");
    const summaryDetails = document.querySelector("#project-request-details");
    const editButton = document.querySelector("#edit-project-request");
    const nameInput = document.querySelector("#request-name");

    if (
        !toggleButton ||
        !formPanel ||
        !form ||
        !summary ||
        !summaryDetails ||
        !editButton ||
        !nameInput
    ) {
        return;
    }

    toggleButton.addEventListener("click", () => {
        const isOpen =
            toggleButton.getAttribute("aria-expanded") === "true";

        toggleButton.setAttribute("aria-expanded", String(!isOpen));
        formPanel.hidden = isOpen;

        toggleButton.textContent = isOpen
            ? "Start a Project"
            : "Hide Project Form";
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const formData = new FormData(form);
        const selectedServices = formData.getAll("services");

        const entries = [
            ["Full Name", formData.get("fullName")],
            ["Email Address", formData.get("email")],
            ["Phone Number", formData.get("phone") || "Not provided"],
            ["Company or Channel", formData.get("company") || "Not provided"],
            ["Project Category", formData.get("category")],
            ["Preferred Timeline", formData.get("timeline")],
            [
                "Services Needed",
                selectedServices.length > 0
                    ? selectedServices.join(", ")
                    : "Not selected"
            ],
            ["Project Description", formData.get("description")]
        ];

        summaryDetails.replaceChildren();

        entries.forEach(([label, value]) => {
            const term = document.createElement("dt");
            const description = document.createElement("dd");

            term.textContent = label;
            description.textContent = value;

            summaryDetails.append(term, description);
        });

        summary.hidden = false;
        summary.focus();
    });

    form.addEventListener("reset", () => {
        summary.hidden = true;
        summaryDetails.replaceChildren();
    });

    editButton.addEventListener("click", () => {
        summary.hidden = true;
        nameInput.focus();
    });

    form.querySelector('button[type="submit"]').disabled = false;
})();