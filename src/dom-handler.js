export class DOMHandler {
  createDiv({ textContent = "", id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);

    const div = document.createElement("div");
    div.textContent = textContent;
    div.id = id;
    this.#addClassNames(div, classNames);

    return div;
  }

  createSpan({ textContent = "", id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);

    const span = document.createElement("span");
    span.textContent = textContent;
    span.id = id;
    this.#addClassNames(span, classNames);

    return span;
  }

  createHeading({
    headingType,
    textContent = "",
    id = "",
    classNames = [],
  } = {}) {
    this.#validateClassNames(classNames);

    const validHeadings = ["h1", "h2", "h3", "h4", "h5", "h6"];
    if (!validHeadings.includes(headingType)) {
      throw new Error(`Invalid heading type: ${headingType}`);
    }

    const heading = document.createElement(headingType);
    heading.textContent = textContent;
    heading.id = id;
    this.#addClassNames(heading, classNames);

    return heading;
  }

  createPara({ textContent = "", id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);

    const para = document.createElement("p");
    para.textContent = textContent;
    para.id = id;
    this.#addClassNames(para, classNames);

    return para;
  }

  createButton({ textContent = "", id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);

    const button = document.createElement("button");
    button.id = id;
    button.textContent = textContent;
    this.#addClassNames(button, classNames);

    return button;
  }

  createImg({ src, alt = "", id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);
    this.#validateSrcPath(src);

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.id = id;
    this.#addClassNames(img, classNames);

    return img;
  }

  createAnchor({
    href = "#",
    textContent = "",
    id = "",
    classNames = [],
  } = {}) {
    this.#validateClassNames(classNames);

    const a = document.createElement("a");
    a.href = href;
    a.textContent = textContent;
    a.id = id;
    this.#addClassNames(a, classNames);

    return a;
  }

  createForm({ action = "", method = "", id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);

    const form = document.createElement("form");
    form.action = action;
    form.method = method;
    form.id = id;
    this.#addClassNames(form, classNames);

    return form;
  }

  createLabel({
    forElem = null,
    id = null,
    textContent = "",
    classNames = [],
  } = {}) {
    this.#validateClassNames(classNames);

    const label = document.createElement("label");
    if (forElem) {
      label.htmlFor = forElem;
    }

    if (id) {
      label.id = id;
    }

    label.textContent = textContent;
    this.#addClassNames(label, classNames);

    return label;
  }

  createInput({
    type = "text",
    id = "",
    name = "",
    placeholder = "",
    required = false,
    readOnly = false,
    min = "",
    max = "",
    value = "",
    classNames = [],
  } = {}) {
    this.#validateClassNames(classNames);

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = name;
    input.placeholder = placeholder;
    input.required = !!required;
    input.readOnly = !!readOnly;
    input.min = min;
    input.max = max;
    input.value = value;

    this.#addClassNames(input, classNames);

    return input;
  }

  createTextArea({
    id = "",
    name,
    placeholder = "",
    required = "false",
    min = "",
    max = "",
    classNames = [],
  } = {}) {
    this.#validateClassNames(classNames);

    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.name = name;
    textarea.placeholder = placeholder;
    textarea.required = required;
    textarea.min = min;
    textarea.max = max;

    this.#addClassNames(textarea, classNames);

    return textarea;
  }

  createList({ listType, listItems = [], id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);

    const validListTypes = ["ol", "ul"];
    if (!validListTypes.includes(listType))
      throw new Error(`Invalid list type: ${listType}`);

    const list = document.createElement(listType);
    list.append(...listItems);
    list.id = id;
    this.#addClassNames(list, classNames);

    return list;
  }

  createListItem({
    src = "",
    textContent = "",
    id = "",
    classNames = [],
  } = {}) {
    this.#validateClassNames(classNames);

    const li = document.createElement("li");
    const img = this.createImg({ src });
    const text = this.createPara({ textContent });

    if ((src, textContent)) {
      li.append(img, text);
    }

    li.id = id;
    this.#addClassNames(li, classNames);

    return li;
  }

  createListItems({ count, textContent = "", id = "", classNames = [] } = {}) {
    this.#validateClassNames(classNames);

    const listItems = [];
    while (count > 0) {
      const li = document.createElement("li");
      li.textContent = textContent;
      li.id = id;
      this.#addClassNames(li, classNames);
      listItems.push(li);
      count--;
    }

    return listItems;
  }

  #addClassNames(element, classNames) {
    classNames.forEach((className) => element.classList.add(className));
  }

  #validateClassNames(classNames) {
    if (
      !Array.isArray(classNames) ||
      classNames.some((cls) => typeof cls !== "string")
    ) {
      throw new Error(`Invalid class names: ${classNames}.`);
    }
  }

  #validateSrcPath(src) {
    if (src === null || src === undefined) {
      throw new Error(`Invalid src path: ${src}.`);
    }
  }
}
