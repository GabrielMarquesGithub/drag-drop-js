//JS for theme
const changeThemeButton = document.querySelector("#changeThemeButton");
const theme = document.querySelector("#theme");
const inputTxt = document.querySelector("#text-input");

changeThemeButton.addEventListener("change", (event) =>
  event.target.checked ? changeTheme("dark") : changeTheme("light")
);

const changeTheme = (themeName) =>
  theme.setAttribute("href", `./assets/style/theme/${themeName}.css`);

//JS for open and close the modal
document.addEventListener("click", (event) => {
  target = event.target;
  if (target.matches(".modal-bg") || target.matches(".button-open-modal"))
    changeModalState();
});

const changeModalState = () => {
  const modalBg = document.querySelector(".modal-bg");

  if (modalBg.style.opacity === "1") {
    clearInput();
    setTimeout(() => {
      modalBg.style.display = "none";
    }, 200);
    modalBg.style.opacity = 0;
  } else {
    modalBg.style.display = "flex";
    modalBg.style.opacity = 1;
    inputTxt.focus();
  }
};
//JS for crate a task
const modal = document.querySelector(".create-modal-container");

const createElement = (elementTag, classList) => {
  const element = document.createElement(elementTag);
  classList ? (element.className = classList) : "";
  return element;
};
const clearInput = () => {
  inputTxt.value = "";
  text = "";
};

const createItem = (list, text, status) => {
  const ul = document.querySelector(`#${list}`);
  const li = createElement("li");
  li.draggable = "true";
  const spanText = createElement("span", "text");
  spanText.innerHTML = text;
  const spanStatus = createElement("span", "status");
  spanStatus.style.backgroundColor = status;
  li.appendChild(spanText);
  li.appendChild(spanStatus);
  ul.appendChild(li);

  ul.scrollTo(0, ul.scrollHeight);

  clearInput();
  iterateArray();
};

let list;
let text;
let statusColor;

modal.addEventListener("change", (event) => setItem(event.target));
modal.addEventListener("keyup", (event) => setItem(event.target));
modal.addEventListener("click", (event) => setItem(event.target));

const setItem = (target) => {
  setItemValue(target);
  if (target.matches(".button-create")) {
    validate()
      ? alert("O formulário deve ser totalmente preenchido")
      : (createItem(list, text, statusColor), changeModalState());
  }
};
const validate = () =>
  [list, text, statusColor].some((item) => !!item === false);

const setItemValue = (target) => {
  if (target.matches(".select-list")) list = target.value;
  else if (target.matches(".select-color")) statusColor = target.value;
  else if (target.matches("#text-input")) text = target.value;
};
//JS drag-drop
const listContainer = document.querySelectorAll(".list-container");
let liDragged;

document.addEventListener("dragover", (e) => {
  e.preventDefault();
  changeBgUls("--text", e.target);
});
document.addEventListener("dragleave", (e) =>
  changeBgUls("--bg-light", e.target)
);
document.addEventListener("drop", (e) => dropItem(e.target));

document.addEventListener("dragstart", (e) => getItem(e.target));
document.addEventListener("dragend", () => changeBgUls("--text"));

const getItem = (li) => {
  liDragged = li;
  changeBgUls("--bg-light");
};
const dropItem = (element) => {
  if (element.className === "delete") deleteItem();
  if (element.tagName === "UL") {
    liDragged.parentNode.removeChild(liDragged);
    element.appendChild(liDragged);
    liDragged = null;
    iterateArray();
  }
};
const deleteItem = () => {
  liDragged.parentNode.removeChild(liDragged);
  iterateArray();
  changeBgUls("--text");
};
//função para alteração de background
const changeBgUls = (newBgColor, ul) => {
  //editar ul especifica
  if (ul) {
    if (ul.tagName === "UL") ul.style.backgroundColor = `var(${newBgColor})`;
    //editar uls no geral
  } else {
    listContainer.forEach(
      (item) =>
        (item.childNodes[3].style.backgroundColor = `var(${newBgColor})`)
    );
  }
};
//JS save in localStorage
const iterateArray = () => {
  listContainer.forEach((element) => {
    const ul = element.childNodes[3];
    let ulContent = [];
    ul.childNodes.forEach((li) => {
      const liContent = {
        text: li.childNodes[0].innerHTML,
        color: li.childNodes[1].style,
      };
      ulContent = [...ulContent, liContent];
    });
    saveList(ul.id, ulContent);
  });
};

const saveList = (key, content) =>
  window.localStorage.setItem(key, JSON.stringify(content));
const getItensLocalStorage = async (key) =>
  await JSON.parse(window.localStorage.getItem(key));

const fillListWhenLoad = () => {
  Array(listContainer.length)
    .fill(false)
    .forEach(async (not, index) => {
      const content = await getItensLocalStorage(`list-${index + 1}`);

      content.forEach((value) => {
        const contentObject = {
          list: `list-${index + 1}`,
          text: value.text,
          color: value.color.backgroundColor,
        };

        createItem(contentObject.list, contentObject.text, contentObject.color);
      });
    });
};
fillListWhenLoad();
