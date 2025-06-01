const fetchNews = async () => {
  const query = document.getElementById("search").value.trim();
  const res = await fetch(`/api/news/top-headlines?q=${encodeURIComponent(query)}`);
  const articles = await res.json();
  displayNews(articles);
};

const displayNews = (articles) => {
  const container = document.getElementById("news-container");
  container.innerHTML = '';

  if (articles.length === 0) {
    container.innerHTML = '<p>No news found.</p>';
    return;
  }

  articles.forEach(article => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.description || ''}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    container.appendChild(div);
  });
};

window.onload = fetchNews;