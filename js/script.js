const url = "https://code-news-api.vercel.app/";
const containerNews = document.getElementById("container-news");

const renderNews = (news) => {
  const newsElement = document.createElement("a");
  newsElement.setAttribute("id", "news");
  newsElement.setAttribute("target", "_blank");
  newsElement.setAttribute("href", `${news.url}`);

  const imgElement = document.createElement("img");
  imgElement.setAttribute("class", "image-news");
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

  containerNews.appendChild(newsElement);
};

const addNewsOnScreen = ({ result }) => {
  for (let i = 10; i <= 30; i++) {
    renderNews(result[i]);
  }
};

async function getNews() {
  try {
    const data = await fetch(url).then((res) => res.json());
    const { news } = await data;
    addNewsOnScreen(news);
  } catch (error) {
    console.log(error);
  }
}

getNews();
