const urlParser = document.createElement('a')

export function domain (url) {
  urlParser.href = url
  return urlParser.hostname
}

export function fa_icon (icon_name) {
  return '<i class = "fa fa-' + icon_name + '"></i>'
}
