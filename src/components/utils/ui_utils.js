export function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
}

export function shortId() {
  return `_ ${Math.random().toString(36).substr(2, 9)}`;
}
