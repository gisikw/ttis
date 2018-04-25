const ttis = Object.assign(
  (assertions = 0, failures = []) => {
    ttis.queue.forEach(([object, body]) => {
      body((prop, ...args) => {
        assertions += 1;
        let expect = args.pop();
        let res = object[prop](...args);
        if (typeof expect === "function" ? !expect(res) : res !== expect)
          failures.push([object, prop, args, res, expect]);
      });
    });
    ttis.report(assertions, failures);
  },
  {
    queue: [],
    test: (...args) => ttis.queue.push(args),
    report: (...args) =>
      typeof window === "undefined"
        ? ttis.reportToConsole(...args)
        : ttis.reportToBrowser(...args),
    reportToConsole: (assertions, failures) => {
      console.log(
        `TTIS: ${assertions - failures.length} of ${assertions} passing`
      );
      failures.map(ttis.failureMessage).map(msg => console.log(msg));
    },
    reportToBrowser: (assertions, failures) => {
      const { document } = window;
      let el = document.getElementById("ttis-results");
      while (el) {
        el.remove();
        el = document.getElementById("ttis-results");
      }
      const div = document.createElement("div");
      div.setAttribute("id", "ttis-results");
      div.innerHTML = `
        <strong>TTIS: ${assertions - failures.length} / ${assertions}</strong>
      `;
      failures
        .map(ttis.failureMessage)
        .forEach(msg => (div.innerHTML += `<p style='margin:0'>${msg}</p>`));
      div.style.cssText =
        "font-family:Arial;position:fixed;z-index:999;top:0;left:0;width:100%;font-size:12px;line-height:20px;box-sizing:border-box;padding:8px";
      div.style.cssText += failures.length
        ? ";background:rgb(255,70,70)"
        : ";background:rgb(0,255,0)";
      document.body.appendChild(div);
    },
    failureMessage: ([object, prop, args, res, expect]) =>
      `${object.constructor.name.toLowerCase()}.${prop}(${args.join(",")}): ${
        typeof expect === "function"
          ? "post-condition not met"
          : `expected ${res} to be ${expect}`
      }`
  }
);
