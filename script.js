handleFetchColors();
const creativeElements = [];
const addCreativeBtn = document.getElementById("add-creative-btn");
const addCreativesSection = document.getElementById("add-creatives-section");
const crossAddCreativesSection = document.getElementById(
  "cross-add-creatives-drawer"
);
const filterColorsContainer = document.getElementById(
  "filter-colors-container"
);
const sideDrawerColorContainer = document.getElementById(
  "add-colors-container-add-creatives"
);
const inputTitleElementSideDrawer = document.getElementById(
  "title-input-add-creatives"
);
const inputSubTitleElementSideDrawer = document.getElementById(
  "subtitle-input-add-creatives"
);
const btnAddNewCreative = document.getElementById("btn-add-new-creative");

console.log(addCreativeBtn);
addCreativeBtn.addEventListener("click", () => {
  toggleDrawerVisibility(true);
  addCreativeBtn.classList.add("pointer-events-none");
  addCreativeBtn.classList.add("opacity-50");
  addCreativeBtn.setAttribute("disabled", true);
});

crossAddCreativesSection.addEventListener("click", () => {
  toggleDrawerVisibility(false);
  addCreativeBtn.classList.remove("pointer-events-none");
  addCreativeBtn.classList.remove("opacity-50");
  addCreativeBtn.removeAttribute("disabled");
});

inputTitleElementSideDrawer.addEventListener(
  "input",
  handleValidationForAddingNewCreative
);

inputSubTitleElementSideDrawer.addEventListener(
  "input",
  handleValidationForAddingNewCreative
);

function toggleDrawerVisibility(makeVisible) {
  if (makeVisible) {
    addCreativesSection.classList.remove("opacity-0");
  } else {
    addCreativesSection.classList.add("opacity-0");
  }
}

function addColorsInFilterAndDrawers(colors = []) {
  if (colors.length > 0) {
    colors.forEach((colorHash) => {
      const colorElFilter = createSingleColorElement(colorHash);
      const colorElAddCreative = createSingleColorElement(colorHash);

      colorElFilter.id = `filter-color-${colorHash}`;
      colorElAddCreative.id = `add-creative-color-${colorHash}`;

      filterColorsContainer.appendChild(colorElFilter);
      sideDrawerColorContainer.appendChild(colorElAddCreative);
    });
  }
}

function createSingleColorElement(color) {
  let colorEl = document.createElement("div");
  colorEl.style.cursor = "pointer";
  colorEl.style.backgroundColor = color;
  colorEl.style.marginRight = "10px";
  colorEl.style.width = "30px";
  colorEl.style.height = "30px";
  colorEl.style.borderRadius = "50%";
  colorEl.style.marginBottom = "4px";
  return colorEl;
}

function handleFetchColors() {
  let url = "https://random-flat-colors.vercel.app/api/random?count=5";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.colors);
      addColorsInFilterAndDrawers(data?.colors);
    });
}

function handleValidationForAddingNewCreative() {
  const titleStr = inputTitleElementSideDrawer.value;
  const subtitleStr = inputSubTitleElementSideDrawer.value;
  if (titleStr.length > 0 && subtitleStr.length > 0) {
    btnAddNewCreative.classList.remove("opacity-50");
    btnAddNewCreative.classList.remove("pointer-events-none");
  } else {
    btnAddNewCreative.classList.add("opacity-50");
    btnAddNewCreative.classList.add("pointer-events-none");
  }
}
