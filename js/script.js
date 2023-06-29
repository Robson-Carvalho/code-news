const url = "https://code-news-api.vercel.app/";
const listNews = document.querySelector(".list-news");

const newsByPage = 10;
const state = {
  page: 1,
  newsByPage,
  totalPage: Math.ceil(100 / newsByPage),
  maxVisibleButtons: 3,
};

const html = {
  get(element) {
    return document.querySelector(element);
  },
};

const update = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  list.update();
  buttons.update();
};

const controls = {
  next() {
    if (state.page === state.totalPage) return;
    state.page++;
  },
  prev() {
    if (state.page === 1) return;
    state.page--;
  },
  goTo(page) {
    if (page > state.totalPage) {
      return (state.page = state.totalPage);
    }
    if (page < 1) {
      return (state.page = 1);
    }
    state.page = +page;
  },
  createListeners() {
    html.get(".first").addEventListener("click", () => {
      controls.goTo(1);
      update();
    });
    html.get(".prev").addEventListener("click", () => {
      controls.prev();
      update();
    });
    html.get(".next").addEventListener("click", () => {
      controls.next();
      update();
    });
    html.get(".last").addEventListener("click", () => {
      controls.goTo(state.totalPage);
      update();
    });
  },
};

const renderNews = (news) => {
  const newsElement = document.createElement("a");
  newsElement.setAttribute("id", "news");
  newsElement.setAttribute("target", "_blank");
  newsElement.setAttribute("href", `${news.url}`);

  const imgElement = document.createElement("img");
  imgElement.setAttribute("class", "image-news");
  imgElement.setAttribute("alt", "Não foi possível carrega a imagem!");
  imgElement.setAttribute("src", `${news.urlToImage}`);

  const titleElement = document.createElement("h3");
  titleElement.setAttribute("class", "title-news");
  titleElement.innerText = `${news.title || "Sem título"}`;

  const descriptionElement = document.createElement("p");
  descriptionElement.setAttribute("class", "description");
  descriptionElement.innerText = `${news.description || "Sem descrição"}`;

  newsElement.appendChild(imgElement);
  newsElement.appendChild(titleElement);
  newsElement.appendChild(descriptionElement);

  listNews.appendChild(newsElement);
};

const list = {
  create(item) {
    renderNews(item);
  },
  async update() {
    const response = await fetch(url);
    const data = await response.json();
    const {
      news: { result },
    } = await data;

    html.get(".list-news").innerHTML = "";
    let page = state.page - 1;
    let start = page * state.newsByPage;
    let end = start + state.newsByPage;

    const paginatedNews = result.slice(start, end);

    paginatedNews.forEach(list.create);
  },
};

const buttons = {
  element: html.get(".pagination .numbers"),
  create(number) {
    const button = document.createElement("div");

    if (state.page == number) {
      button.classList.add("active");
    }

    button.innerText = number;
    button.addEventListener("click", (event) => {
      const page = event.target.innerText;

      controls.goTo(page);
      update();
    });

    buttons.element.appendChild(button);
  },
  update() {
    buttons.element.innerHTML = "";
    const { maxLeft, maxRight } = buttons.calculateMaxVisible();

    for (let page = maxLeft; page <= maxRight; page++) {
      buttons.create(page);
    }
  },
  calculateMaxVisible() {
    const { maxVisibleButtons } = state;
    let maxLeft = state.page - Math.floor(maxVisibleButtons / 2);
    let maxRight = state.page + Math.floor(maxVisibleButtons / 2);

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = maxVisibleButtons;
    }

    if (maxRight > state.totalPage) {
      maxLeft = state.totalPage - (maxVisibleButtons - 1);
      maxRight = state.totalPage;

      if (maxLeft < 1) maxLeft = 1;
    }

    return { maxLeft, maxRight };
  },
};

const init = () => {
  update();
  controls.createListeners();
};

init();
