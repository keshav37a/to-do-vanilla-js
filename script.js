const COLOR_COUNT = 5;

/* dom el ids */
const SECTION_ADD_CREATIVES = "add-creatives-section";
const BTN_TOGGLE_SIDE_DRAWER = "add-creative-btn";
const BTN_ADD_NEW_CREATIVE = "btn-add-new-creative";
const CONTAINER_SIDE_DRAWER_COLOR_CONTAINER = "add-creatives-colors";
const CONTAINER_FILTER_COLOR_CONTAINER = "filter-colors";
const CROSS_ICON_ADD_CREATIVES_DRAWER = "cross-add-creatives-drawer";
const INPUT_TITLE_ADD_CREATIVES = "title-input-add-creatives";
const INPUT_SUBTITLE_ADD_CREATIVES = "subtitle-input-add-creatives";
const INPUT_FILTER_BY_TEXT = "filter-by-text-input";
const CONTAINER_CREATIVE_LIST_CONTAINER = "creative-list-container";
const CREATIVE_ELEMENT_COUNT = "creative-el-count";
const PROGRESS_BAR_FILLED = "progress-bar_filled";

handleFetchColors(COLOR_COUNT);

const debouncedFilter = debounce(handleFilterItems, 250);

const creativeElements = [];
const filteredCreativeElements = [];
let selectedColorToBeAdded = "";
const selectedColorsToBeFilteredMap = new Map();

const btnToggleSideDrawerEl = document.getElementById(BTN_TOGGLE_SIDE_DRAWER);
const addCreativesSectionEl = document.getElementById(SECTION_ADD_CREATIVES);
const crossAddCreativesSectionEl = document.getElementById(
  CROSS_ICON_ADD_CREATIVES_DRAWER
);
const filterColorsContainerEl = document.getElementById(
  CONTAINER_FILTER_COLOR_CONTAINER
);
const sideDrawerColorContainerEl = document.getElementById(
  CONTAINER_SIDE_DRAWER_COLOR_CONTAINER
);
const inputTitleElementSideDrawerEl = document.getElementById(
  INPUT_TITLE_ADD_CREATIVES
);
const inputSubTitleElementSideDrawerEl = document.getElementById(
  INPUT_SUBTITLE_ADD_CREATIVES
);
const btnAddNewCreativeEl = document.getElementById(BTN_ADD_NEW_CREATIVE);
const creativeListContainerEl = document.getElementById(
  CONTAINER_CREATIVE_LIST_CONTAINER
);
const inputFilterByTextEl = document.getElementById(INPUT_FILTER_BY_TEXT);

inputFilterByTextEl.addEventListener("input", debouncedFilter);

btnToggleSideDrawerEl.addEventListener("click", () => {
  toggleDrawerVisibility(true);
  handleToggleDisableBtn(btnToggleSideDrawerEl);
});

btnAddNewCreativeEl.addEventListener("click", () => {
  const isValidated = handleValidationForAddingNewCreative();

  if (isValidated) {
    const newCreativeElement = {
      id: `${creativeElements.length}-element-${selectedColorToBeAdded}`,
      title: inputTitleElementSideDrawerEl.value,
      subtitle: inputSubTitleElementSideDrawerEl.value,
      color: selectedColorToBeAdded,
    };
    handleAddNewCreativeElementToList(newCreativeElement);
  } else {
    console.error("error in form validation");
  }

  if (creativeElements.length >= COLOR_COUNT) {
    handleToggleDisableBtn(btnToggleSideDrawerEl);
    handleToggleDisableBtn(btnAddNewCreativeEl);
  }
});

crossAddCreativesSectionEl.addEventListener("click", () => {
  toggleDrawerVisibility(false);
  if (creativeElements.length < COLOR_COUNT) {
    handleToggleDisableBtn(btnToggleSideDrawerEl, false);
  }
});

inputTitleElementSideDrawerEl.addEventListener(
  "input",
  handleValidationForAddingNewCreative
);

inputSubTitleElementSideDrawerEl.addEventListener(
  "input",
  handleValidationForAddingNewCreative
);

filterColorsContainerEl.addEventListener("click", (e) => {
  const color = e.target?.dataset?.color;

  if (color) {
    handleSelectColorElement(CONTAINER_FILTER_COLOR_CONTAINER, color);
  }
});

sideDrawerColorContainerEl.addEventListener("click", (e) => {
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

/**
 * To toggle display of side drawer
 * @param {Boolean} makeVisible
 */
function toggleDrawerVisibility(makeVisible) {
  if (makeVisible) {
    addCreativesSectionEl.classList.remove("hidden");
  } else {
    addCreativesSectionEl.classList.add("hidden");
  }
}

/**
 * This function filters the items based on colors and text
 *
 */
function handleFilterItems() {
  if (creativeElements.length > 0) {
    const text = inputFilterByTextEl.value;
    const shouldFilterColors = selectedColorsToBeFilteredMap.size > 0;
    const shouldFilterText = text.length > 2;
    creativeElements.forEach(
      ({ color, id, title: itemTitle, subtitle: itemSubtitle }) => {
        const isTextPresent = shouldFilterText
          ? itemTitle.includes(text) || itemSubtitle.includes(text)
          : true;
        const isColorPresent = shouldFilterColors
          ? selectedColorsToBeFilteredMap.get(color)
          : true;
        if (isTextPresent && isColorPresent) {
          document.getElementById(id).classList.remove("hidden");
        } else {
          document.getElementById(id).classList.add("hidden");
        }
      }
    );
  }
}

/**
 * This function appends all the color elements to dom
 *
 * @param {Array} colors - array of color strings
 *
 */
function addColorsInFilterAndDrawers(colors = []) {
  if (colors.length > 0) {
    colors.forEach((colorHash) => {
      const colorForFilterSectionEl =
        handleCreateSingleColorElementToDom(colorHash);
      const colorForAddingToDomEl =
        handleCreateSingleColorElementToDom(colorHash);

      colorForFilterSectionEl.id = `${CONTAINER_FILTER_COLOR_CONTAINER}-${colorHash}`;
      colorForAddingToDomEl.id = `${CONTAINER_SIDE_DRAWER_COLOR_CONTAINER}-${colorHash}`;

      filterColorsContainerEl.appendChild(colorForFilterSectionEl);
      sideDrawerColorContainerEl.appendChild(colorForAddingToDomEl);
    });
  }
}

/**
 * This function creates and appends a DOM element for a single color
 *
 * @param {String} color
 * @returns {HTMLDivElement}
 */
function handleCreateSingleColorElementToDom(color) {
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

/**
 * This function selects / unselects the color element from both sections. Adds / Removes the selected data attribute and styles
 * @param {String} containerType - The id of the container from where the color is selected. Could be filter section or from right drawer
 * @param {String} color - The hashcode of color
 * @param {Boolean} onlySingleSelect - Boolean to check whether all other selected elements should be unselected or not
 */
function handleSelectColorElement(containerType, color, onlySingleSelect) {
  const colorEl = document.getElementById(`${containerType}-${color}`);
  const isColorSelected = colorEl.dataset.selected;

  if (colorEl) {
    if (onlySingleSelect) {
      const domEl = document.getElementById(containerType);

      domEl.childNodes.forEach((singleColorEl) => {
        if (singleColorEl !== colorEl) {
          singleColorEl.style.border = "2px solid transparent";
          singleColorEl.removeAttribute("data-selected");
        }
      });

      selectedColorToBeAdded = color;
    }

    if (containerType === CONTAINER_FILTER_COLOR_CONTAINER) {
      if (isColorSelected) {
        selectedColorsToBeFilteredMap.delete(color);
      } else {
        selectedColorsToBeFilteredMap.set(color, true);
      }

      handleFilterItems();
    }

    if (!isColorSelected) {
      colorEl.style.border = "2px solid green";
      colorEl.setAttribute("data-selected", true);
    } else {
      colorEl.style.border = "2px solid transparent";
      colorEl.removeAttribute("data-selected");
    }
  }
}

/**
 * This function checks whether all the fields were selected or not
 * @returns {Boolean} - whether the form was validated or not
 */
function handleValidationForAddingNewCreative() {
  let isSelected = false;
  const titleStr = inputTitleElementSideDrawerEl.value;
  const subtitleStr = inputSubTitleElementSideDrawerEl.value;
  const addCreativeColorsChildNodes = sideDrawerColorContainerEl.childNodes;

  for (let i = 0; i < addCreativeColorsChildNodes.length; i++) {
    if (addCreativeColorsChildNodes[i].dataset.selected) {
      isSelected = true;
      break;
    }
  }

  const isValidated =
    titleStr.length > 0 && subtitleStr.length > 0 && isSelected;

  if (isValidated) {
    btnAddNewCreativeEl.classList.remove(
      "opacity-50",
      "pointer-events-none",
      "bg-gray-300"
    );
  } else {
    btnAddNewCreativeEl.classList.add(
      "opacity-50",
      "pointer-events-none",
      "bg-gray-300"
    );
  }

  return isValidated;
}

/**
 * This function fetches the list of random colors and calls addColorsInFilterAndDrawers function
 * @param {Number} colorCount - number of colors to fetch (equates to number of items that can be added for the time being)
 */
function handleFetchColors(colorCount) {
  let url = `https://random-flat-colors.vercel.app/api/random?count=${colorCount}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document
        .getElementById(CONTAINER_FILTER_COLOR_CONTAINER)
        .classList.remove("hidden");
      addColorsInFilterAndDrawers(data?.colors);
    });
}

/**
 * This function disables / enables a button click functionality and UI
 * @param {HTMLButtonElement} el - reference to Button element
 * @param {Boolean} shouldDisable - boolean to identify whether to disable or enable
 */
function handleToggleDisableBtn(el, shouldDisable = true) {
  if (el) {
    if (shouldDisable) {
      el.classList.add("opacity-50", "pointer-events-none", "bg-gray-300");
      el.setAttribute("disabled", true);
    } else {
      el.classList.remove("opacity-50", "pointer-events-none", "bg-gray-300");
      el.removeAttribute("disabled");
    }
  } else {
    console.error("el not valid");
  }
}

/**
 * This adds new element to the DOM. Adds newCreativeElementObj to the array of creativeElements.
 * Applies existing filters (if any) to new objects
 *
 * @param {object} newCreativeElementObj - {title, subtitle, color, id}
 *
 */
function handleAddNewCreativeElementToList(newCreativeElementObj) {
  const inputFilterTxt = inputFilterByTextEl.value;
  const isColorFilterPresent = selectedColorsToBeFilteredMap.size > 0;
  const creativeElementCountEl = document.getElementById(
    CREATIVE_ELEMENT_COUNT
  );
  const progressBarFilled = document.getElementById(PROGRESS_BAR_FILLED);
  const id = newCreativeElementObj.id;
  creativeElements.push(newCreativeElementObj);

  /**
   * Creates container
   */
  const creativeItemEl = document.createElement("div");
  creativeItemEl.id = id;
  creativeItemEl.classList.add(
    "creative-item",
    "my-4",
    "p-8",
    "rounded-2xl",
    "border-2",
    "border-black"
  );
  creativeItemEl.style.backgroundColor = newCreativeElementObj.color;
  creativeItemEl.style.width = "50%";

  /**
   * Creates title
   */
  const creativeItemTitle = document.createElement("h1");
  creativeItemTitle.classList.add("text-xl");
  creativeItemTitle.innerText = newCreativeElementObj.title;

  /**
   * Creates subtitle
   */
  const creativeItemSubTitle = document.createElement("h3");
  creativeItemSubTitle.classList.add("text-md");
  creativeItemSubTitle.innerText = newCreativeElementObj.subtitle;

  /**
   * Append to DOM
   */
  creativeItemEl.appendChild(creativeItemTitle);
  creativeItemEl.appendChild(creativeItemSubTitle);
  creativeListContainerEl.appendChild(creativeItemEl);

  /**
   * Checks if filters already applied
   */
  if (isColorFilterPresent && inputFilterTxt) {
    handleFilterItems();
  }

  /**
   * Sets item count and progress bar
   */
  creativeElementCountEl.innerText = `${creativeElements.length} / ${COLOR_COUNT} Creatives`;
  progressBarFilled.classList.remove("w-0");
  progressBarFilled.style.width = `${Math.round(
    (creativeElements.length / COLOR_COUNT) * 100
  )}%`;
}

function debounce(call, wait) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      call(args);
      clearTimeout(timeoutId);
    }, wait);
  };
}
