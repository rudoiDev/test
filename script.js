// Замените на свой API-ключ
const token = "7b0614f613afe9e6e7c69301b4f615991adc5491";

const BASE_URL =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";

async function fetchTodos(url, token, param) {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: param }),
  });
  let data = await response.json();
  showSuggestion(data);
}

function join(arr /*, separator */) {
  const separator = arguments.length > 1 ? arguments[1] : ", ";
  return arr
    .filter(function (n) {
      return n;
    })
    .join(separator);
}

function typeDescription(type) {
  const TYPES = {
    INDIVIDUAL: "Индивидуальный предприниматель",
    LEGAL: "Организация",
  };
  return TYPES[type];
}

function showSuggestion(suggestion) {
  const data = suggestion.suggestions[0].data;
  if (!data) return;

  document.getElementById("type").textContent =
    typeDescription(data.type) + " (" + data.type + ")";

  if (data.name) {
    document.getElementById("name_short").value =
      data.name.short_with_opf || "";
    document.getElementById("name_full").value = data.name.full_with_opf || "";
  }

  document.getElementById("inn_kpp").value = join([data.inn, data.kpp], " / ");

  if (data.address) {
    var address = "";
    if (data.address.data.qc == "0") {
      address = join([data.address.data.postal_code, data.address.value]);
    } else {
      address = data.address.data.source;
    }
    document.getElementById("address").value = address;
  }
}

$("#party").suggestions({
  token: token,
  type: "PARTY",
  count: 5,
  /* Вызывается, когда пользователь выбирает одну из подсказок */
  onSelect: (e) => fetchTodos(BASE_URL, token, e.value),
});
