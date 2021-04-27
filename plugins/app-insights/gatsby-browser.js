//based on https://www.olivercoding.com/2019-04-04-gatsby-azure-appinsights/
//https://cookie-script.com/documentation/cookie-script-custom-events
//https://cookie-script.com/documentation/cookie-script-functions
let injectedScript = false
let injectedAppInsightsScript = false
let track = false

const addCookieScript = () => {
  var s = document.createElement(`script`);
  s.type = `text/javascript`;
  s.setAttribute("src", "//cdn.cookie-script.com/s/yourscript.js")
  s.onload = function() {
    if(window.CookieScript.instance.currentState().action === "accept"){
      addAppInsightsScript();
      track = true;
    }
  };
  document.getElementsByTagName(`head`)[0].appendChild(s);

  window.addEventListener('CookieScriptAcceptAll', function() { 
    addAppInsightsScript();
    track = true;
  });

  window.addEventListener('CookieScriptReject', function() { 
    track = false;
  });

}

const addAppInsightsScript = () =>
{
  if(!injectedAppInsightsScript){
    var jsCode = `
    var appInsights = window.appInsights || function (a) {
        function b(a) { c[a] = function () { var b = arguments; c.queue.push(function () { c[a].apply(c, b) }) } } var c = { config: a }, d = document, e = window; setTimeout(function () { var b = d.createElement("script"); b.src = a.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js", d.getElementsByTagName("script")[0].parentNode.appendChild(b) }); try { c.cookie = d.cookie } catch (a) { } c.queue = []; for (var f = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; f.length;)b("track" + f.pop()); if (b("setAuthenticatedUserContext"), b("clearAuthenticatedUserContext"), b("startTrackEvent"), b("stopTrackEvent"), b("startTrackPage"), b("stopTrackPage"), b("flush"), !a.disableExceptionTracking) { f = "onerror", b("_" + f); var g = e[f]; e[f] = function (a, b, d, e, h) { var i = g && g(a, b, d, e, h); return !0 !== i && c["_" + f](a, b, d, e, h), i } } return c
    }({
        instrumentationKey: "ToComplete"
    });

    window.appInsights = appInsights, appInsights.queue && 0 === appInsights.queue.length && appInsights.trackPageView();
    `;
    
    var s = document.createElement(`script`);
    s.type = `text/javascript`;
    s.setAttribute("ata-cookiescript","accepted");
    s.setAttribute("data-cookiecategory","targeting");
    s.innerText = jsCode;
    
    document.getElementsByTagName(`head`)[0].appendChild(s);
    injectedAppInsightsScript = true;
  }
}

export const onInitialClientRender = () => {
   
    if (!injectedScript) {
      addCookieScript();
      injectedScript = true;
    }
}

export const onRouteUpdate = ({ location, prevLocation }) => {
  if(window.appInsights && track){
    window.appInsights.trackPageView();
    console.log("page view");
  }
}