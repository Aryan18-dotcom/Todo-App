export function getBaseUrl(request) {
  return request.nextUrl.origin || process.env.APP_BASE_URL;
}
