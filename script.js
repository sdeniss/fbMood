var script = document.createElement("script");
script.textContent = "console.log('asdf');";
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);