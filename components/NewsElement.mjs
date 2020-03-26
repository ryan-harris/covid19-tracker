/**
 * @param {array} articles an array of news object articles
 * @returns {array} of news elements
 */

export default function buildNewsElements(articles) {
  $("#world-news").empty();
  console.log(articles);
  let elements = articles.map(function(article, index) {
    var divEl = $("<div>");
    divEl.attr("class", "uk-flex uk-margin-top");

    var ulEl = $("<ul>");
    ulEl.attr("class", "uk-list uk-margin-left uk-margin-remove-bottom");

    var liTitle = $("<li>");
    liTitle.text("Title: " + article.title);

    var liDate = $("<li>");
    liDate.text("Date: " + article.publishedAt);

    var sourceLink = $("<a>");
    sourceLink.attr("href", article.url);
    sourceLink.attr("target", "_blank");
    sourceLink.text(article.source.name);

    var liSource = $("<li>");
    liSource.text("Source: ");
    liSource.append(sourceLink);

    var liDescription = $("<li>");
    liDescription.text("Description: " + article.description);

    ulEl.append(liTitle, liDate, liSource, liDescription);
    divEl.append(ulEl);
    $("#world-news").append(divEl);
    if (index < articles.length - 1) {
      $("#world-news").append($("<hr>").attr("class", "uk-divider-small"));
    }
  });

  return elements;
}