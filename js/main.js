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
  var LANGUAGE_NAMES = {
    bash: 'Shell',
    plain: 'Text',
    plaintext: 'Text',
    python: 'Python',
    shell: 'Shell',
    sh: 'Shell',
    text: 'Text'
  };

  function getLanguage(block) {
    var ignored = {
      highlight: true,
      'code-block': true
    };
    var language = '';

    block.className.split(/\s+/).some(function (name) {
      if (!name || ignored[name]) return false;
      language = name.replace(/^language-/, '');
      return true;
    });

    return language ? (LANGUAGE_NAMES[language] || language.toUpperCase()) : '';
  }

  function attachLanguageLabel(block) {
    var language = getLanguage(block);
    if (!language || block.querySelector('.code-language-label')) return;

    var label = document.createElement('span');
    label.className = 'code-language-label';
    label.textContent = language;
    block.appendChild(label);
  }

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
    attachLanguageLabel(block);
    attachCopyButton(block);
  });

  document.querySelectorAll('.post-content > pre').forEach(attachCopyButton);
}());
