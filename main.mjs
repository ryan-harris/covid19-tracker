import { getTrendingNews } from "./logic/newsAPI.mjs";
import { getTopCountryData, getWorldData } from "./logic/covid-api-calls.mjs";
import {
  countrySearchByDisplay,
  countrySearchByName,
  countries
} from "./data/countries.mjs";
import NewsElement from "./components/NewsElement.mjs";
import SearchHistory from "./components/SearchHistory.mjs";

// Start the app logic
$(init);

function init() {
  renderWorldData();
  renderTopCountryList();
  renderTrendingNewsList();

  // Country search input specific event listener setup
  countryInputEventListenerInitialization();
  setUpEventListeners();

  SearchHistory();
}

function renderWorldData() {
  getWorldData()
    .then(function(totals) {
      $("#totalCasesWorld")
        .text(totals.confirmed)
        .append(
          $("<span>")
            .addClass("stat-span-small text-red uk-margin-small-left")
            .text("+" + totals.newConfirmed)
        );
      $("#totalRecoveredWorld").text(totals.recovered);
      $("#totalDeathsWorld")
        .text(totals.deaths)
        .append(
          $("<span>")
            .addClass("stat-span-small text-red uk-margin-small-left")
            .text("+" + totals.newDeaths)
        );
    })
    .catch(function(error) {
      console.log(error);
    });
}

function renderTopCountryList() {
  getTopCountryData(10).then(function(countries) {
    let table = $("#countryDataTable");
    let tableBody = $("#countryDataTable tbody");

    table.css("border-collapse", "seperate");
    table.css("border-spacing", "0 10px");

    table.css("margin", "auto");

    countries.forEach(function(country) {
      let rowEl = $("<tr>");

      rowEl
        .append($("<td>"))
        .css("text-align", "right")
        .text(country.cases);

      let nameCell = $("<td>")
        .css("text-align", "center")
        .css("padding", "0px 30px");

      let countryLinkEl = $("<a>")
        .attr("href", `./country.html?country=${country.country_name}`)
        .addClass("text-white")
        .text(countrySearchByName(country.country_name).display);

      nameCell.append(countryLinkEl);
      rowEl.append(nameCell);

      // cellCountryName.append(countryLinkEl);
      // rowEl.append(cellCountryName);

      rowEl.append(
        $("<td>")
          .text(country.deaths)
          .css("text-align", "left")
          .addClass("text-red")
      );
      tableBody.append(rowEl);
    });
  });
}

function renderTrendingNewsList() {
  getTrendingNews(5)
    .then(function(data) {
      $("world-news").append(NewsElement(data));
    })

    .catch(function(error) {
      console.log(error);
    });
}

function setUpEventListeners() {
  // Global event listeners go here
}

function countryInputEventListenerInitialization() {
  let searchFormEl = $("#searchForm");
  let searchFormInputEl = $("#searchForm input");
  let searchFormDropdown = $("#searchFormDropdown");

  // Country search on key up listener
  searchFormInputEl.on("keyup", countrySearchInputHandler);

  // Country search dropdown on blur listener
  searchFormInputEl.on("blur", hideCountryListHandler);

  // Country search on focus listener
  searchFormInputEl.on("focus", showCountryListHandler);

  // Country search input submit listener
  searchFormDropdown.on("mousedown", function(event) {
    event.preventDefault();
  });

  searchFormEl.on("submit", navigateToCountryPageOnSubmit);
}

function countrySearchInputHandler(event) {
  let input = event.target;
  let inputValue = input.value;
  let results = [];
  if (inputValue) {
    countries.forEach(function(obj) {
      inputValue.replace(/\\/g, "");
      let regexp = new RegExp(`${inputValue}`, "gi");
      if (regexp.test(obj.display)) {
        results.push(obj);
      }
    });
    buildCountrySearchDropdown(results);
  }
}

function buildCountrySearchDropdown(countryArray) {
  $("#searchFormDropdown").empty();
  let countryUlEl = $("<ul>");

  if (countryArray.length > 0) {
    let elements = countryArray.map(function(obj) {
      let countryLiEl = $("<li>");
      let linkEl = $("<a>");
      linkEl.attr("href", `./country.html?country=${obj.country}`);
      linkEl.attr("data-country-name", obj.country);
      linkEl.text(obj.display);
      countryLiEl.append(linkEl);
      linkEl.on("mousedown", navigateToCountryPage);

      return $(countryLiEl);
    });

    if (elements.length > 0) {
      $(countryUlEl).append(elements);
      $("#searchFormDropdown").append(countryUlEl);
    }
  } else {
    $(countryUlEl)
      .append("<li>")
      .text("No Results");
    $("#searchFormDropdown").append(countryUlEl);
  }
}

function hideCountryListHandler(event) {
  $("#searchFormDropdown").css("display", "none");
}

function showCountryListHandler() {
  $("#searchFormDropdown").css("display", "block");
}

function navigateToCountryPage(event) {
  let countryName = $(event.target).attr("data-country-name");
  let countryObj = countrySearchByName(countryName);

  if (countryObj) {
    addSearchToLocalStorage(countryObj);
  }
}

function navigateToCountryPageOnSubmit(event) {
  event.preventDefault();
  let inputValue = $(".uk-input").val();

  let returnedCountryData = countrySearchByDisplay(inputValue);

  if (returnedCountryData) {
    addSearchToLocalStorage(returnedCountryData);
    window.location.href = `./country.html?country=${returnedCountryData.country}`;
  }
}

function addSearchToLocalStorage(countryObj) {
  let pastSearches = JSON.parse(localStorage.getItem("covid-app"));
  if (!pastSearches) {
    pastSearches = [];
  }

  var index = pastSearches.findIndex(function(element) {
    return countryObj.country === element.country;
  });

  if (index !== -1) {
    pastSearches.splice(index, 1);
  }
  pastSearches.unshift(countryObj);
  localStorage.setItem("covid-app", JSON.stringify(pastSearches));
}
