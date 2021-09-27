// Replaces the `needle` package for `duck-duck-scrape` so it uses fetch instead
const needle = async (method, url) => {
  method = method.toUpperCase();
  const response = await fetch(url, { method });
  let body = await response.text();
  try {
    body = JSON.parse(body);
  } catch (e) {}

  return {
    body,
    headers: response.headers,
    method,
    url,
    statusCode: response.status,
    statusMessage: response.statusText,
    completed: true
  }
}

module.exports = needle;
module.exports.default = needle;