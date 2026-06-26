(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  });
}());

(function () {
  function getCodeText(block) {
    var codeCell = block.querySelector('td.code');
    var source = codeCell || block.querySelector('pre');

    return source ? source.innerText.replace(/\n+$/, '') : '';
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopyText(text);
      });
    }

    return fallbackCopyText(text);
  }

  function fallbackCopyText(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve();
  }

  function attachCopyButton(block) {
    if (block.querySelector('.code-copy-button')) return;

    var button = document.createElement('button');
    button.className = 'code-copy-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'Copy code');
    button.setAttribute('title', 'Copy code');

    button.addEventListener('click', function () {
      copyText(getCodeText(block)).then(function () {
        button.classList.add('is-copied');
        button.setAttribute('aria-label', 'Copied');
        button.setAttribute('title', 'Copied');

        window.setTimeout(function () {
          button.classList.remove('is-copied');
          button.setAttribute('aria-label', 'Copy code');
          button.setAttribute('title', 'Copy code');
        }, 1600);
      });
    });

    block.appendChild(button);
  }

  document.querySelectorAll('figure.highlight').forEach(function (block) {
    attachCopyButton(block);
  });

  document.querySelectorAll('.post-content > pre').forEach(attachCopyButton);
}());
