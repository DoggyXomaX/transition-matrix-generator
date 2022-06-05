function Tag(tag: string): Element[] {
  return Array.from(document.getElementsByTagName(tag));
}
function Class(className: string): Element[] {
  return Array.from(document.getElementsByClassName(className));
}
function Var(name: string, value: string | number) {
  document.documentElement.style.setProperty(`--${name}`, `${value}`);
}
function VarElem(element: HTMLElement, name: string, value: string | number) {
  element.style.setProperty(`--${name}`, `${value}`);
}