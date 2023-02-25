const SECTION_ADD_CREATIVES = "add-creatives-section";
const BTN_TOGGLE_SIDE_DRAWER = "add-creative-btn";
const BTN_ADD_NEW_CREATIVE = "btn-add-new-creative";
const CONTAINER_SIDE_DRAWER_COLOR_CONTAINER = "add-creatives-colors";
const CONTAINER_FILTER_COLOR_CONTAINER = "filter-colors";
const CROSS_ICON_ADD_CREATIVES_DRAWER = "cross-add-creatives-drawer";
const INPUT_TITLE_ADD_CREATIVES = "title-input-add-creatives";
const INPUT_SUBTITLE_ADD_CREATIVES = "subtitle-input-add-creatives";
const CONTAINER_CREATIVE_LIST_CONTAINER = "creative-list-container";

handleFetchColors();
const creativeElements = [];
let selectedColorToBeAdded = "";
const btnToggleSideDrawerEl = document.getElementById(BTN_TOGGLE_SIDE_DRAWER);
const addCreativesSection = document.getElementById(SECTION_ADD_CREATIVES);
const crossAddCreativesSection = document.getElementById(
  CROSS_ICON_ADD_CREATIVES_DRAWER
);
const filterColorsContainer = document.getElementById(
  CONTAINER_FILTER_COLOR_CONTAINER
);
const sideDrawerColorContainer = document.getElementById(
  CONTAINER_SIDE_DRAWER_COLOR_CONTAINER
);
const inputTitleElementSideDrawer = document.getElementById(
  INPUT_TITLE_ADD_CREATIVES
);
const inputSubTitleElementSideDrawer = document.getElementById(
  INPUT_SUBTITLE_ADD_CREATIVES
);
const btnAddNewCreative = document.getElementById(BTN_ADD_NEW_CREATIVE);
const creativeListContainer = document.getElementById(
  CONTAINER_CREATIVE_LIST_CONTAINER
);

btnToggleSideDrawerEl.addEventListener("click", () => {
  toggleDrawerVisibility(true);
  btnToggleSideDrawerEl.classList.add("pointer-events-none");
  btnToggleSideDrawerEl.classList.add("opacity-50");
  btnToggleSideDrawerEl.setAttribute("disabled", true);
});

btnAddNewCreative.addEventListener("click", () => {
  const isValidated = handleValidationForAddingNewCreative();

  if (isValidated) {
    const newCreativeElement = {
      title: inputTitleElementSideDrawer.value,
      subtitle: inputSubTitleElementSideDrawer.value,
      color: selectedColorToBeAdded,
    };
    handleAddNewElementToList(newCreativeElement);
  } else {
    console.error("error in form validation");
  }

  if (creativeElements.length >= 5) {
    btnToggleSideDrawerEl.style.pointerEvents = "none";
    btnToggleSideDrawerEl.style.opacity = "50";
    btnAddNewCreative.style.pointerEvents = "none";
    btnAddNewCreative.style.opacity = "50";
  }
});

crossAddCreativesSection.addEventListener("click", () => {
  toggleDrawerVisibility(false);
  btnToggleSideDrawerEl.classList.remove("pointer-events-none");
  btnToggleSideDrawerEl.classList.remove("opacity-50");
  btnToggleSideDrawerEl.removeAttribute("disabled");
});

inputTitleElementSideDrawer.addEventListener(
  "input",
  handleValidationForAddingNewCreative
);

inputSubTitleElementSideDrawer.addEventListener(
  "input",
  handleValidationForAddingNewCreative
);

filterColorsContainer.addEventListener("click", (e) => {
  const color = e.target?.dataset?.color;

  if (color) {
    handleSelectColorElement(CONTAINER_FILTER_COLOR_CONTAINER, color);
  }
});

sideDrawerColorContainer.addEventListener("click", (e) => {
  const color = e.target?.dataset?.color;
  if (color) {
    handleSelectColorElement(
      CONTAINER_SIDE_DRAWER_COLOR_CONTAINER,
      color,
      true
    );
    handleValidationForAddingNewCreative();
  }
});

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

      colorElFilter.id = `${CONTAINER_FILTER_COLOR_CONTAINER}-${colorHash}`;
      colorElAddCreative.id = `${CONTAINER_SIDE_DRAWER_COLOR_CONTAINER}-${colorHash}`;

      filterColorsContainer.appendChild(colorElFilter);
      sideDrawerColorContainer.appendChild(colorElAddCreative);
    });
  }
}

function createSingleColorElement(color) {
  let colorParentEl = document.createElement("div");
  let colorEl = document.createElement("div");

  colorParentEl.style.display = "flex";
  colorParentEl.style.alignItems = "center";
  colorParentEl.style.justifyContent = "center";
  colorParentEl.style.padding = "2px";
  colorParentEl.style.borderRadius = "50%";
  colorParentEl.style.marginRight = "4px";
  colorParentEl.style.border = "2px solid transparent";
  colorParentEl.setAttribute("data-color", color);

  colorEl.style.cursor = "pointer";
  colorEl.style.backgroundColor = color;
  colorEl.style.width = "30px";
  colorEl.style.height = "30px";
  colorEl.style.borderRadius = "50%";
  colorEl.style.borderWidth = "2px";
  colorEl.style.borderColor = "#000";
  colorEl.setAttribute("data-color", color);

  colorParentEl.appendChild(colorEl);

  return colorParentEl;
}

function handleSelectColorElement(containerType, color, singleSelect) {
  const colorEl = document.getElementById(`${containerType}-${color}`);
  if (singleSelect) {
    const domEl = document.getElementById(containerType);
    domEl.childNodes.forEach((singleColorEl) => {
      if (singleColorEl !== colorEl) {
        singleColorEl.style.border = "2px solid transparent";
        singleColorEl.removeAttribute("data-selected");
      }
    });
    selectedColorToBeAdded = color;
  }
  console.log(colorEl);
  console.log(colorEl.dataset);
  if (colorEl) {
    if (!colorEl.dataset.selected) {
      colorEl.style.border = "2px solid green";
      colorEl.setAttribute("data-selected", true);
    } else {
      colorEl.style.border = "2px solid transparent";
      colorEl.removeAttribute("data-selected");
    }
  }
}

function handleValidationForAddingNewCreative() {
  let isSelected = false;
  const titleStr = inputTitleElementSideDrawer.value;
  const subtitleStr = inputSubTitleElementSideDrawer.value;
  const addCreativeColorsChildNodes = sideDrawerColorContainer.childNodes;

  for (let i = 0; i < addCreativeColorsChildNodes.length; i++) {
    if (addCreativeColorsChildNodes[i].dataset.selected) {
      isSelected = true;
      break;
    }
  }

  const isValidated =
    titleStr.length > 0 && subtitleStr.length > 0 && isSelected;

  if (isValidated) {
    btnAddNewCreative.classList.remove("opacity-50");
    btnAddNewCreative.classList.remove("pointer-events-none");
  } else {
    btnAddNewCreative.classList.add("opacity-50");
    btnAddNewCreative.classList.add("pointer-events-none");
  }

  return isValidated;
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

function handleAddNewElementToList(newCreativeElement) {
  console.log("handleAddNewElementToList called");
  creativeElements.push(newCreativeElement);
  const creativeItemEl = document.createElement("div");
  creativeItemEl.classList.add("creative-item", "my-4", "p-8", "rounded-2xl");
  creativeItemEl.style.backgroundColor = newCreativeElement.color;
  const creativeItemTitle = document.createElement("h1");
  const creativeItemSubTitle = document.createElement("h3");
  creativeItemTitle.innerText = newCreativeElement.title;
  creativeItemSubTitle.innerText = newCreativeElement.subtitle;
  creativeItemEl.appendChild(creativeItemTitle);
  creativeItemEl.appendChild(creativeItemSubTitle);
  creativeListContainer.appendChild(creativeItemEl);
}
