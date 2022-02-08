/* Shortcuts */
App.Tag = (tag) => document.getElementsByTagName(tag);
App.Class = (className) => document.getElementsByClassName(className);
App.Get = (id) => document.getElementById(id);
App.Var = (name, value) => document.documentElement.style.setProperty(`--${name}`, value);
App.VarElem = (element, name, value) => element.style.setProperty(`--${name}`, value);
App.Create = (tag) => document.createElement(tag);

/* Init */
App.Start = () => {
  App.elements = App.GetElements();
  App.PrepareElements();
};

window.onload = App.Start;