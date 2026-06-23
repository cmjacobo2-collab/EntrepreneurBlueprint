/* Across the Table — Founder's Workbook
 * Real-DOM renderer. Consumes the view model produced by the reused
 * renderVals() logic and builds genuine DOM nodes for every screen.
 * Faithful to the original design's markup, inline styles, and behavior.
 */
(function () {
  'use strict';

  /* ----------------------------- DOM helper ----------------------------- */
  // h(tag, cssText, opts, children)
  // opts: { cls, html, text, attr:{}, val, onClick, onChange, onInput, hover, focus }
  function h(tag, css, opts, kids) {
    const e = document.createElement(tag);
    if (css) e.style.cssText = css;
    opts = opts || {};
    if (opts.cls) e.className = opts.cls;
    if (opts.attr) for (const k in opts.attr) { if (opts.attr[k] != null) e.setAttribute(k, opts.attr[k]); }
    if (opts.html != null) e.innerHTML = opts.html;
    if (opts.text != null) e.textContent = opts.text;
    if (opts.val != null) e.value = opts.val; // applied after option children below for selects
    if (opts.onClick) e.addEventListener('click', opts.onClick);
    if (opts.onChange) e.addEventListener('change', opts.onChange);
    if (opts.onInput) e.addEventListener('input', opts.onInput);
    if (opts.hover) {
      const base = css || '';
      e.addEventListener('mouseenter', () => { e.style.cssText = base + ';' + opts.hover; });
      e.addEventListener('mouseleave', () => { e.style.cssText = base; });
    }
    if (opts.focus) {
      const base = css || '';
      e.addEventListener('focus', () => { e.style.cssText = base + ';' + opts.focus; });
      e.addEventListener('blur', () => { e.style.cssText = base; });
    }
    if (kids) kids.forEach((k) => {
      if (k == null || k === false) return;
      e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
    });
    if (opts.val != null && (tag === 'select')) e.value = opts.val;
    return e;
  }

  /* ------------------------------- icons -------------------------------- */
  function svg(w, hh, sw, inner, stroke) {
    return '<svg width="' + w + '" height="' + hh + '" viewBox="0 0 24 24" fill="none" stroke="' +
      (stroke || 'currentColor') + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  const P = {
    check: '<polyline points="20 6 9 17 4 12"></polyline>',
    arrowR: '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
    arrowL: '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
    clock: '<circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
    info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
    extArrow: '<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
    help: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>',
    globe: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
    mailEnv: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>'
  };
  function iconSpan(spanCss, markup) { return h('span', spanCss, { html: markup }); }

  const LOGO = 'assets/logo-across-the-table.png';
  const FOCUS = 'border-color:var(--navy-700);box-shadow:var(--shadow-focus);';

  /* --------------------------- shared widgets --------------------------- */
  function labelEl(text) { return h('label', 'font-size:13px;font-weight:600;color:var(--text-strong);', { text }); }

  function textInput(css, val, onChange, attr) {
    return h('input', css, { val: val == null ? '' : val, onChange, focus: FOCUS, attr: attr || {} });
  }

  function logoHeader(small) {
    const hgt = small ? '46px' : '52px';
    return h('div', 'display:flex;flex-direction:column;align-items:flex-start;gap:' + (small ? '7px' : '8px') + ';', {}, [
      h('img', 'height:' + hgt + ';width:auto;display:block;', { attr: { src: LOGO, alt: 'Across the Table' } }),
      h('span', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);', { text: "Founder's workbook" })
    ]);
  }

  const H1 = 'font-family:var(--font-display);font-weight:800;font-size:var(--text-2xl);line-height:1.08;letter-spacing:-0.02em;color:var(--navy-700);margin:26px 0 0;text-wrap:balance;';
  const SUB = 'font-size:var(--text-md);line-height:1.55;color:var(--text-body);margin:12px 0 0;';
  const INPUT = 'height:46px;padding:0 .9rem;font-size:15px;color:var(--text-strong);background:var(--white);border:1px solid var(--border-strong);border-radius:var(--radius-md);outline:none;font-family:var(--font-sans);';
  const INPUTSEL = INPUT + 'cursor:pointer;';
  const FIELD = 'display:flex;flex-direction:column;gap:6px;';

  function selectEl(css, val, onChange, optionNodes) {
    const s = h('select', css, { onChange, focus: FOCUS }, optionNodes);
    s.value = val == null ? '' : val;
    return s;
  }
  function optsFromStrings(arr, placeholder) {
    const nodes = [h('option', null, { attr: { value: '' }, text: placeholder })];
    arr.forEach((o) => nodes.push(h('option', null, { attr: { value: o }, text: o })));
    return nodes;
  }
  function optsFromPairs(arr, placeholder) {
    const nodes = [h('option', null, { attr: { value: '' }, text: placeholder })];
    arr.forEach((o) => nodes.push(h('option', null, { attr: { value: o.value }, text: o.label })));
    return nodes;
  }

  /* ============================ ONBOARDING ============================== */
  function Onboarding(vm) {
    const inner = [logoHeader(false)];
    if (vm.isAccountScreen) inner.push(vm.acctStepForm ? accountForm(vm) : accountVerify(vm));
    if (vm.isCommitScreen) inner.push(commitScreen(vm));
    const wrap = h('div', 'max-width:540px;margin:0 auto;padding:' + vm.onbPad + ';', { cls: 'att-fade' }, inner);
    return h('div', 'height:100%;width:100%;overflow-y:auto;background:var(--cream-50);', { cls: 'att-scroll' }, [wrap]);
  }

  function fieldCol(labelText, control, extraCss) {
    return h('div', FIELD + (extraCss || ''), {}, [labelEl(labelText), control]);
  }

  function accountForm(vm) {
    const nameF = fieldCol('Full name', textInput(INPUT, vm.acctFullName, vm.setAcctName, { placeholder: 'e.g. Dana Ruiz' }));
    const bizF = fieldCol('Business name', textInput(INPUT, vm.acctBusinessName, vm.setAcctBiz, { placeholder: 'e.g. Maple & Co' }));
    const indF = h('div', 'flex:1;min-width:170px;display:flex;flex-direction:column;gap:6px;', {}, [
      labelEl('Industry'),
      selectEl(INPUTSEL, vm.acctIndustry, vm.setAcctIndustry, optsFromStrings(vm.industryOptions, 'Select industry…'))
    ]);
    const typeF = h('div', 'flex:1;min-width:170px;display:flex;flex-direction:column;gap:6px;', {}, [
      labelEl('Business type'),
      selectEl(INPUTSEL, vm.acctBizType, vm.setAcctType, optsFromStrings(vm.bizTypeOptions, 'Select type…'))
    ]);
    const emailF = h('div', 'flex:1;min-width:170px;display:flex;flex-direction:column;gap:6px;', {}, [
      labelEl('Email address'), textInput(INPUT, vm.acctEmail, vm.setAcctEmail, { type: 'email', placeholder: 'you@business.com' })
    ]);
    const phoneF = h('div', 'flex:1;min-width:170px;display:flex;flex-direction:column;gap:6px;', {}, [
      labelEl('Phone number'), textInput(INPUT, vm.acctPhone, vm.setAcctPhone, { type: 'tel', placeholder: '(555) 123-4567' })
    ]);

    const noteIcon = iconSpan('flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:99px;background:var(--gold-500);color:#fff;margin-top:1px;', svg(15, 15, 2.2, P.lock));
    const note = h('div', 'margin:22px 0 0;display:flex;gap:12px;align-items:flex-start;background:var(--gold-050);border:1px solid var(--gold-100);border-radius:var(--radius-md);padding:14px 16px;', {}, [
      noteIcon,
      h('p', 'font-size:13px;line-height:1.55;color:var(--text-body);margin:0;', { html: 'One account covers <strong>one business</strong>. Running more than one business? Purchase a licensing term at <a href="https://AcrosstheTable.biz" target="_blank" rel="noopener" style="color:var(--navy-600);font-weight:600;">AcrosstheTable.biz</a> or email <a href="mailto:info@acrossthetable.biz" style="color:var(--navy-600);font-weight:600;">info@acrossthetable.biz</a>.' })
    ]);

    const cta = h('button', vm.acctCtaStyle, { text: 'Review my details', onClick: vm.reviewAccount });
    const ctaWrap = h('div', 'margin:24px 0 0;', {}, [
      cta,
      h('p', 'font-size:12px;line-height:1.5;color:var(--text-faint);margin:12px 0 0;text-align:center;', { text: "You'll confirm everything on the next step. Once verified, your business details can't be changed." })
    ]);

    return h('div', '', {}, [
      h('h1', H1, { text: 'Create your account.' }),
      h('p', SUB, { text: "Tell us about you and your business. We'll use these details across the app and to set up your one-on-one consultations." }),
      h('div', 'margin:26px 0 0;display:flex;flex-direction:column;gap:18px;', {}, [
        nameF, bizF,
        h('div', 'display:flex;gap:12px;flex-wrap:wrap;', {}, [indF, typeF]),
        h('div', 'display:flex;gap:12px;flex-wrap:wrap;', {}, [emailF, phoneF])
      ]),
      note, ctaWrap
    ]);
  }

  function accountVerify(vm) {
    const rows = vm.acctReview.map((r) => h('div', 'display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 0;border-bottom:1px solid var(--border-subtle);', {}, [
      h('span', 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-muted);', { text: r.label }),
      h('span', 'font-size:15px;font-weight:600;color:var(--navy-700);text-align:right;', { text: r.value })
    ]));
    const card = h('div', 'margin:24px 0 0;background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:8px 20px;', {}, rows);

    const note = h('div', 'margin:18px 0 0;display:flex;gap:12px;align-items:flex-start;background:var(--navy-050);border:1px solid var(--navy-100);border-radius:var(--radius-md);padding:14px 16px;', {}, [
      iconSpan('flex:none;color:var(--navy-600);margin-top:1px;', svg(18, 18, 2.2, P.info)),
      h('p', 'font-size:13px;line-height:1.55;color:var(--text-body);margin:0;', { text: "This locks the app to this one business. To use it for another business you'll need a separate licensing term." })
    ]);

    const back = h('button', 'flex:1;min-width:130px;height:52px;border-radius:var(--radius-md);background:transparent;color:var(--navy-700);font-family:var(--font-sans);font-weight:600;font-size:var(--text-md);border:1px solid var(--border-strong);cursor:pointer;', { text: 'Go back & edit', onClick: vm.backToAcctForm, hover: 'background:var(--cream-100);' });
    const confirm = h('button', 'flex:2;min-width:170px;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;height:52px;border-radius:var(--radius-md);background:var(--forest-600);color:#fff;font-family:var(--font-sans);font-weight:600;font-size:var(--text-md);border:1px solid transparent;cursor:pointer;', { text: 'Confirm & create account', onClick: vm.confirmAccount, hover: 'background:var(--forest-700);' });

    return h('div', '', {}, [
      h('h1', H1, { text: 'Verify your details.' }),
      h('p', SUB, { html: 'Please double-check everything below. <strong>Once you confirm, your name, business name, industry, and business type are locked</strong> and can’t be edited.' }),
      card, note,
      h('div', 'margin:24px 0 0;display:flex;gap:12px;flex-wrap:wrap;', {}, [back, confirm])
    ]);
  }

  function commitScreen(vm) {
    const nameF = h('div', 'margin:28px 0 0;display:flex;flex-direction:column;gap:6px;', {}, [
      h('label', 'font-size:13px;font-weight:600;color:var(--text-strong);', { html: 'Your name <span style="color:var(--text-faint);font-weight:400;">(optional)</span>' }),
      textInput(INPUT, vm.onbName, vm.setName, { placeholder: 'e.g. Dana' })
    ]);

    const stateF = h('div', 'margin:22px 0 0;display:flex;flex-direction:column;gap:6px;', {}, [
      labelEl('What state will you register your business in?'),
      selectEl(INPUTSEL, vm.onbState, vm.onbSetState, optsFromPairs(vm.stateOptions, 'Select your state…')),
      h('span', 'font-size:12px;color:var(--text-muted);', { text: "We'll show you the official .gov links to register in that state." })
    ]);

    const seg = h('div', 'margin:22px 0 0;', {}, [
      labelEl('How will you commit?'),
      h('div', 'display:flex;gap:10px;margin-top:8px;', {}, [
        h('div', vm.segDateStyle, { text: 'A launch target date', onClick: vm.setModeDate }),
        h('div', vm.segHoursStyle, { text: 'Weekly hours', onClick: vm.setModeHours })
      ])
    ]);

    let modeBlock = null;
    if (vm.onbModeDate) {
      modeBlock = h('div', 'margin:18px 0 0;display:flex;gap:12px;flex-wrap:wrap;', {}, [
        h('div', 'flex:1;min-width:150px;display:flex;flex-direction:column;gap:6px;', {}, [
          labelEl('Target launch date'), textInput(INPUT, vm.onbDate, vm.setDate, { type: 'date' })
        ]),
        h('div', 'flex:1;min-width:120px;display:flex;flex-direction:column;gap:6px;', {}, [
          h('label', 'font-size:13px;font-weight:600;color:var(--text-strong);', { html: 'Time <span style="color:var(--text-faint);font-weight:400;">(optional)</span>' }),
          textInput(INPUT, vm.onbTime, vm.setTime, { type: 'time' })
        ])
      ]);
    } else if (vm.onbModeHours) {
      modeBlock = h('div', 'margin:18px 0 0;display:flex;flex-direction:column;gap:6px;', {}, [
        labelEl("Hours per week you'll dedicate"),
        textInput(INPUT + 'width:140px;', vm.onbHours, vm.setHours, { type: 'number', min: '1', max: '60' })
      ]);
    }

    const remHeader = h('div', 'display:flex;align-items:center;justify-content:space-between;gap:14px;', {}, [
      h('div', 'display:flex;flex-direction:column;gap:3px;', {}, [
        h('span', 'font-size:15px;font-weight:600;color:var(--text-strong);', { text: 'Send me reminders' }),
        h('span', 'font-size:13px;color:var(--text-muted);', { text: 'A daily nudge to keep your promise.' })
      ]),
      h('div', vm.remToggleStyle, { onClick: vm.toggleReminders }, [h('span', vm.remKnobStyle, {})])
    ]);
    const remChildren = [remHeader];
    if (vm.onbReminders) {
      remChildren.push(h('div', 'margin-top:14px;display:flex;align-items:center;gap:10px;', {}, [
        labelEl('Remind me at'),
        textInput('height:42px;padding:0 .8rem;font-size:15px;color:var(--text-strong);background:var(--cream-50);border:1px solid var(--border-strong);border-radius:var(--radius-md);outline:none;font-family:var(--font-sans);', vm.onbReminderTime, vm.setReminderTime, { type: 'time' })
      ]));
    }
    const remCard = h('div', 'margin:22px 0 0;background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:18px;', {}, remChildren);

    const cta = h('div', 'margin:24px 0 0;', {}, [
      h('button', vm.ctaStyle, { text: vm.onbCtaLabel, onClick: vm.startWorkbook }),
      h('p', 'font-size:12px;line-height:1.5;color:var(--text-faint);margin:12px 0 0;text-align:center;', { text: 'Your answers and schedule stay on this device. You can change this anytime.' })
    ]);

    return h('div', '', {}, [
      h('h1', H1, { text: 'Make your commitment.' }),
      h('p', SUB, { text: "Founders who set a goal and a schedule are the ones who finish. Tell us when you'll work on this — and we'll help you keep the promise." }),
      nameF, stateF, seg, modeBlock, remCard, cta
    ]);
  }

  /* ============================== APP SHELL ============================= */
  function AppShell(vm) {
    const col = [];
    if (vm.isMobile) col.push(mobileBar(vm));

    const region = h('div', 'display:flex;flex:1;min-height:0;width:100%;position:relative;', {}, []);
    if (vm.scrimOn) region.appendChild(h('div', 'position:fixed;inset:0;background:rgba(11,22,35,.45);z-index:50;', { onClick: vm.closeNav }));
    region.appendChild(sidebar(vm));

    const main = h('main', 'flex:1;height:100%;overflow-y:auto;min-width:0;', { cls: 'att-scroll', attr: { id: 'att-main' } });
    let content;
    if (vm.viewConsult) content = consultView(vm);
    else if (vm.viewHowto) content = howtoView(vm);
    else if (vm.viewKb) content = kbView(vm);
    else if (vm.viewLegal) content = legalView(vm);
    else if (vm.isIntro) content = introView(vm);
    else if (vm.isSection) content = sectionView(vm);
    else if (vm.isSummary) content = summaryView(vm);
    main.appendChild(content);
    region.appendChild(main);

    col.push(region);
    return h('div', 'display:flex;flex-direction:column;height:100%;width:100%;', {}, col);
  }

  function mobileBar(vm) {
    return h('div', 'flex:none;display:flex;align-items:center;gap:12px;height:56px;padding:0 14px;background:var(--white);border-bottom:1px solid var(--border-default);', {}, [
      h('button', 'display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:var(--radius-md);border:1px solid var(--border-default);background:var(--white);cursor:pointer;color:var(--navy-700);', { html: svg(20, 20, 2.2, P.menu), onClick: vm.toggleNav }),
      h('span', 'flex:1;min-width:0;font-family:var(--font-display);font-weight:800;font-size:15px;color:var(--navy-700);', { text: "Founder's workbook" }),
      h('span', 'font-family:var(--font-display);font-weight:700;font-size:14px;color:var(--forest-600);', { text: vm.progressPct + '%' })
    ]);
  }

  function sidebar(vm) {
    /* header */
    const headChildren = [logoHeader(true)];
    if (vm.hasAccount) headChildren.push(h('div', 'margin-top:12px;font-family:var(--font-display);font-weight:700;font-size:14px;color:var(--navy-700);line-height:1.2;', { text: vm.bizName }));
    const head = h('div', 'padding:24px 24px 18px;border-bottom:1px solid var(--border-subtle);', {}, headChildren);

    /* progress */
    const progChildren = [
      h('div', 'display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;', {}, [
        h('span', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);', { text: 'Your progress' }),
        h('span', 'font-family:var(--font-display);font-weight:700;font-size:14px;color:var(--forest-600);', { text: vm.progressPct + '%' })
      ]),
      h('div', 'height:8px;border-radius:99px;background:var(--sand-200);overflow:hidden;', {}, [
        h('div', 'height:100%;border-radius:99px;background:var(--forest-600);transition:width var(--dur-slow) var(--ease-out);width:' + vm.progressPct + '%;', {})
      ]),
      h('div', 'margin-top:8px;font-size:12px;color:var(--text-muted);', { text: vm.completedCount + ' of ' + vm.totalSections + ' sections complete' })
    ];
    if (vm.hasCommitment) {
      progChildren.push(h('div', 'margin-top:14px;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-md);background:var(--cream-100);cursor:pointer;', { onClick: vm.onEdit }, [
        iconSpan('flex:none;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:99px;background:var(--gold-100);color:var(--gold-700);', svg(15, 15, 2.2, P.clock)),
        h('div', 'display:flex;flex-direction:column;gap:1px;min-width:0;', {}, [
          h('span', 'font-size:13px;font-weight:600;color:var(--navy-700);', { text: vm.commitmentLabel }),
          h('span', 'font-size:11px;color:var(--text-muted);', { text: vm.remindLabel + ' · Edit' })
        ])
      ]));
    }
    const prog = h('div', 'padding:18px 24px 16px;border-bottom:1px solid var(--border-subtle);', {}, progChildren);

    /* nav */
    const navKids = [];
    navKids.push(h('div', vm.overviewStyle, { onClick: vm.onOverview }, [
      h('span', 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.06em;', { text: '★' }),
      h('span', null, { text: 'Overview' })
    ]));

    vm.navRows.forEach((row) => {
      if (row.isPartHeader) {
        const badge = h('span', row.badgeStyle, row.complete ? { html: svg(13, 13, 3.2, P.check) } : { text: row.num });
        navKids.push(h('div', row.headerStyle, { onClick: row.onToggle }, [
          badge,
          h('span', 'flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;', {}, [
            h('span', 'font-size:13px;font-weight:600;color:var(--navy-700);line-height:1.2;', { text: row.name }),
            h('span', 'font-size:11px;color:var(--text-muted);', { text: row.countText })
          ]),
          h('span', row.chevStyle, { text: '›' })
        ]));
      } else if (row.isItem) {
        const circle = h('span', row.circleStyle, row.isDone ? { html: svg(13, 13, 3.2, P.check) } : { text: row.n2 });
        navKids.push(h('div', row.rowStyle, { onClick: row.onClick }, [
          circle, h('span', row.titleStyle, { text: row.title })
        ]));
      }
    });

    navKids.push(h('div', vm.summaryStyle, { onClick: vm.onSummary }, [
      h('span', 'font-family:var(--font-mono);font-size:11px;', { text: '✓' }),
      h('span', null, { text: 'Summary & decision' })
    ]));

    const resources = h('div', 'margin-top:16px;padding-top:16px;border-top:1px solid var(--border-subtle);', {}, [
      h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);padding:0 10px 8px;', { text: 'Resources' }),
      resNav(vm.consultNavStyle, P.chat, 'Book a consultation', vm.openConsult, 16, 2),
      resNav(vm.howtoNavStyle, P.help, 'How to use the app', vm.openHowto, 16, 2),
      resNav(vm.kbNavStyle, P.book, 'Knowledge base', vm.openKb, 16, 2),
      resNav(vm.legalNavStyle, P.file, 'Legal & licensing', vm.openLegal, 16, 2),
      h('a', 'display:flex;align-items:center;gap:11px;padding:11px 10px;border-radius:var(--radius-sm);text-decoration:none;font-size:13px;font-weight:600;color:var(--ink-600);', { attr: { href: 'https://AcrosstheTable.biz', target: '_blank', rel: 'noopener' } }, [
        h('span', 'display:inline-flex;', { html: svg(16, 16, 2, P.globe) }),
        h('span', null, { text: 'AcrosstheTable.biz' })
      ])
    ]);
    navKids.push(resources);

    const nav = h('nav', 'flex:1;overflow-y:auto;padding:14px 14px 28px;', { cls: 'att-scroll' }, navKids);

    return h('aside', vm.asideStyle, {}, [head, prog, nav]);
  }
  function resNav(style, icon, text, onClick, sz, sw) {
    return h('div', style, { onClick }, [
      h('span', 'display:inline-flex;', { html: svg(sz, sz, sw, icon) }),
      h('span', null, { text })
    ]);
  }

  /* =============================== INTRO =============================== */
  function introView(vm) {
    const ring = h('div', 'position:relative;width:92px;height:92px;flex:none;', {}, [
      h('div', '', { html: '<svg width="92" height="92" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="11"></circle><circle cx="60" cy="60" r="54" fill="none" stroke="#2F7558" stroke-width="11" stroke-linecap="round" stroke-dasharray="' + vm.ringC + '" stroke-dashoffset="' + vm.ringOffset + '" transform="rotate(-90 60 60)"></circle></svg>' }),
      h('div', 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:21px;color:#fff;', { text: vm.progressPct + '%' })
    ]);
    const startBtn = h('button', 'display:inline-flex;align-items:center;gap:.5rem;height:44px;padding:0 1.3rem;border-radius:var(--radius-md);background:var(--gold-500);color:var(--navy-900);font-family:var(--font-sans);font-weight:700;font-size:15px;border:none;cursor:pointer;', { onClick: vm.start, hover: 'background:var(--gold-400);' }, [
      document.createTextNode(vm.startLabel + ' '),
      h('span', 'display:inline-flex;', { html: svg(18, 18, 2.4, P.arrowR) })
    ]);
    const heroCard = h('div', 'display:flex;align-items:center;gap:20px;background:var(--navy-900);border-radius:var(--radius-lg);padding:22px;margin:22px 0 0;', {}, [
      ring,
      h('div', 'flex:1;min-width:0;', {}, [
        h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-lg);color:#fff;', { text: vm.completedCount + ' of ' + vm.totalSections + ' done' }),
        h('p', 'font-size:13.5px;line-height:1.5;color:var(--text-on-dark-muted);margin:5px 0 13px;', { text: 'A few minutes most days adds up. Pick up where you left off.' }),
        startBtn
      ])
    ]);

    const affirm = h('div', 'display:flex;gap:14px;align-items:flex-start;margin:18px 0 0;background:var(--gold-050);border:1px solid var(--gold-100);border-radius:var(--radius-lg);padding:18px 20px;', {}, [
      iconSpan('flex:none;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:99px;background:var(--gold-500);color:#fff;margin-top:1px;', svg(18, 18, 2.2, P.star)),
      h('div', 'min-width:0;', {}, [
        h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-700);margin-bottom:4px;', { text: "Today's affirmation" }),
        h('p', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-md);line-height:1.3;color:var(--navy-700);margin:0;', { text: vm.affirmationText })
      ])
    ]);

    const partCards = vm.parts.map((pt) => {
      const badge = h('span', pt.badgeStyle, pt.complete ? { html: svg(17, 17, 3, P.check) } : { text: pt.num });
      return h('div', 'display:flex;align-items:center;gap:14px;background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:16px 18px;cursor:pointer;transition:border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out);', { onClick: pt.onOpen, hover: 'border-color:var(--navy-600);box-shadow:var(--shadow-card-hover);transform:translateY(-1px);' }, [
        badge,
        h('div', 'flex:1;min-width:0;', {}, [
          h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-md);color:var(--navy-700);', { text: pt.name }),
          h('p', 'font-size:13px;line-height:1.45;color:var(--text-muted);margin:3px 0 10px;', { text: pt.blurb }),
          h('div', 'display:flex;align-items:center;gap:10px;', {}, [
            h('div', 'flex:1;height:6px;border-radius:99px;background:var(--sand-200);overflow:hidden;', {}, [h('div', pt.barStyle, {})]),
            h('span', 'font-family:var(--font-mono);font-size:11px;color:var(--text-muted);flex:none;', { text: pt.countText })
          ])
        ]),
        h('span', 'flex:none;color:var(--text-faint);font-size:20px;line-height:1;', { text: '›' })
      ]);
    });

    const kids = [
      h('span', 'font-family:var(--font-mono);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-700);', { text: "Founder's workbook" }),
      h('h1', 'font-family:var(--font-display);font-weight:800;font-size:var(--text-2xl);line-height:1.05;letter-spacing:-0.02em;color:var(--navy-700);margin:10px 0 0;text-wrap:balance;', { text: vm.greeting }),
      heroCard, affirm,
      h('div', 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin:30px 0 12px;', { text: 'The seven parts' }),
      h('div', 'display:flex;flex-direction:column;gap:10px;', {}, partCards)
    ];
    if (vm.hasProgress) {
      kids.push(h('div', 'text-align:center;margin:24px 0 0;', {}, [
        h('button', 'background:none;border:none;color:var(--text-muted);font-family:var(--font-sans);font-size:14px;cursor:pointer;text-decoration:underline;text-underline-offset:3px;', { text: 'Start over', onClick: vm.reset })
      ]));
    }
    return h('div', 'max-width:760px;margin:0 auto;padding:' + vm.introPad + ';', { cls: 'att-fade' }, kids);
  }

  /* ============================== SECTION ============================== */
  function monoLabel(text, extraCss) {
    return h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);' + (extraCss || ''), { text });
  }

  function sectionView(vm) {
    const c = vm.current;
    const kids = [];
    kids.push(h('div', 'display:flex;align-items:center;gap:12px;margin-bottom:18px;', {}, [
      h('span', 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-700);', { text: c.partTag }),
      h('span', 'width:4px;height:4px;border-radius:99px;background:var(--sand-300);', {}),
      h('span', 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-faint);', { text: 'Section ' + c.sectionNo2 })
    ]));
    kids.push(h('h1', 'font-family:var(--font-display);font-weight:800;font-size:var(--text-2xl);line-height:1.08;letter-spacing:-0.02em;color:var(--navy-700);margin:0;text-wrap:balance;', { text: c.title }));
    kids.push(h('p', 'font-size:var(--text-md);line-height:1.55;color:var(--text-body);margin:14px 0 0;font-weight:500;', { text: c.lead }));

    if (c.hasQuote) kids.push(h('div', 'display:flex;gap:14px;align-items:flex-start;margin:22px 0 0;padding:18px 20px;background:var(--cream-100);border-radius:var(--radius-md);', {}, [
      h('span', 'font-family:var(--font-display);font-weight:800;font-size:36px;line-height:.6;color:var(--gold-500);flex:none;', { text: '“' }),
      h('p', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-lg);line-height:1.25;letter-spacing:-0.01em;color:var(--navy-700);margin:0;', { text: c.quote })
    ]));

    if (c.hasTeach) kids.push(h('p', 'font-size:var(--text-md);line-height:1.65;color:var(--text-body);margin:22px 0 0;', { text: c.teach }));

    if (c.hasIncludes) kids.push(h('div', 'margin:24px 0 0;', {}, [
      monoLabel('What it includes', 'margin-bottom:10px;'),
      h('div', 'display:flex;flex-direction:column;gap:8px;', {}, c.includes.map((it) => bulletRow(it)))
    ]));

    if (c.hasWhy) {
      const whyKids = [h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-700);margin-bottom:6px;', { text: 'Why this matters' })];
      if (c.hasWhyText) whyKids.push(h('p', 'font-size:14px;line-height:1.6;color:var(--text-body);margin:0;', { text: c.why }));
      if (c.hasWhyItems) whyKids.push(h('div', 'display:flex;flex-direction:column;gap:7px;', {}, c.whyItems.map((w) => h('div', 'display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.5;color:var(--text-body);', {}, [
        iconSpan('flex:none;color:var(--forest-600);margin-top:1px;', svg(15, 15, 2.6, P.check)),
        h('span', null, { text: w })
      ]))));
      kids.push(h('div', 'background:var(--forest-050);border:1px solid var(--forest-100);border-radius:var(--radius-md);padding:16px 18px;margin:24px 0 0;', {}, whyKids));
    }

    if (c.hasOverlook) kids.push(h('div', 'background:var(--gold-050);border:1px solid var(--gold-100);border-radius:var(--radius-md);padding:16px 18px;margin:14px 0 0;', {}, [
      h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-700);margin-bottom:8px;', { text: 'If you overlook it' }),
      h('div', 'display:flex;flex-direction:column;gap:7px;', {}, c.overlook.map((o) => bangRow(o)))
    ]));

    if (c.hasStandaloneExample) kids.push(h('div', 'background:var(--navy-050);border:1px solid var(--navy-100);border-radius:var(--radius-md);padding:16px 18px;margin:14px 0 0;', {}, [
      h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--navy-600);margin-bottom:6px;', { text: 'Example' }),
      h('p', 'font-size:14px;line-height:1.6;color:var(--text-body);margin:0;', { text: c.standaloneExample })
    ]));

    if (c.hasMistakes) kids.push(h('div', 'background:var(--gold-050);border:1px solid var(--gold-100);border-radius:var(--radius-md);padding:16px 18px;margin:14px 0 0;', {}, [
      h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-700);margin-bottom:6px;', { text: 'Common mistakes' }),
      h('p', 'font-size:14px;line-height:1.6;color:var(--text-body);margin:0;', { text: c.mistakes })
    ]));

    if (c.hasMethods) kids.push(h('div', 'margin:24px 0 0;', {}, [
      monoLabel('Ways to test', 'margin-bottom:10px;'),
      h('div', 'display:flex;flex-wrap:wrap;gap:8px;', {}, c.methods.map((m) => h('span', 'display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:99px;background:var(--cream-100);border:1px solid var(--border-default);font-size:13px;color:var(--navy-700);font-weight:500;', { text: m })))
    ]));

    if (c.hasBlocks) c.blocks.forEach((b) => { const el = renderBlock(b); if (el) kids.push(el); });

    if (c.hasLearn) kids.push(h('div', 'margin:28px 0 0;', {}, [
      monoLabel('Key concepts to master', 'margin-bottom:8px;'),
      h('div', 'display:flex;flex-direction:column;', {}, c.learn.map((lc) => h('div', 'padding:14px 0;border-bottom:1px solid var(--border-subtle);', {}, [
        h('div', 'font-family:var(--font-display);font-weight:700;font-size:15px;color:var(--navy-700);margin-bottom:4px;', { text: lc.title }),
        h('p', 'font-size:14px;line-height:1.6;color:var(--text-body);margin:0;', { text: lc.body })
      ])))
    ]));

    if (c.hasQuestionsLabel) kids.push(h('div', 'margin:30px 0 -20px;font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);', { text: c.questionsLabel }));

    if (c.hasQuestions) kids.push(h('div', 'margin:30px 0 0;display:flex;flex-direction:column;gap:20px;', {}, c.questions.map((q) => h('div', 'display:flex;flex-direction:column;gap:8px;', {}, [
      h('label', 'display:flex;align-items:flex-start;gap:10px;font-size:15px;font-weight:600;color:var(--text-strong);line-height:1.4;', {}, [
        h('span', 'font-family:var(--font-mono);font-size:12px;color:var(--gold-700);padding-top:2px;flex:none;', { text: q.num }),
        h('span', null, { text: q.text })
      ]),
      h('textarea', 'width:100%;min-height:74px;padding:.7rem .85rem;font-size:15px;line-height:1.5;color:var(--text-strong);background:var(--white);border:1px solid var(--border-strong);border-radius:var(--radius-md);resize:vertical;transition:border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out);outline:none;', { val: q.value, onChange: q.onChange, focus: FOCUS, attr: { placeholder: 'Write your answer…' } })
    ]))));

    if (c.hasExercise) {
      const exKids = [
        h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--navy-600);margin-bottom:8px;', { text: 'Exercise' }),
        h('p', 'font-size:15px;line-height:1.55;color:var(--text-strong);font-weight:600;margin:0;', { text: c.exercise })
      ];
      if (c.hasExample) exKids.push(h('p', 'font-size:13px;line-height:1.5;color:var(--text-muted);margin:8px 0 0;font-style:italic;', { text: 'Example: ' + c.example }));
      exKids.push(h('textarea', 'width:100%;min-height:96px;margin-top:14px;padding:.7rem .85rem;font-size:15px;line-height:1.5;color:var(--text-strong);background:var(--white);border:1px solid var(--border-strong);border-radius:var(--radius-md);resize:vertical;outline:none;', { val: c.exValue, onChange: c.exChange, focus: FOCUS, attr: { placeholder: 'Your response…' } }));
      kids.push(h('div', 'background:var(--navy-050);border:1px solid var(--navy-100);border-radius:var(--radius-lg);padding:22px;margin:28px 0 0;', {}, exKids));
    }

    if (c.isDecision) kids.push(h('div', 'margin:30px 0 0;', {}, [
      monoLabel('Your decision', 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:12px;', {}, vm.decisionOptions.map((opt) => h('div', opt.cardStyle, { onClick: opt.onClick }, [
        h('span', opt.dotStyle, {}),
        h('div', 'display:flex;flex-direction:column;gap:3px;', {}, [
          h('span', 'font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--navy-700);', { text: opt.label }),
          h('span', 'font-size:13px;color:var(--text-muted);line-height:1.45;', { text: opt.desc })
        ])
      ])))
    ]));

    if (c.isPledge) kids.push(h('div', c.pledgeCardStyle, { onClick: c.togglePledge }, [
      h('span', c.pledgeBoxStyle, c.pledged ? { html: svg(15, 15, 3, P.check) } : {}),
      h('div', 'display:flex;flex-direction:column;gap:5px;', {}, [
        h('span', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-700);', { text: 'My pledge' }),
        h('span', 'font-size:16px;line-height:1.45;color:var(--navy-800);font-weight:600;', { text: c.pledge })
      ])
    ]));

    /* footer nav */
    kids.push(h('div', 'display:flex;align-items:center;justify-content:space-between;margin:40px 0 0;padding-top:24px;border-top:1px solid var(--border-subtle);', {}, [
      h('button', 'display:inline-flex;align-items:center;gap:.5rem;height:46px;padding:0 1.2rem;border-radius:var(--radius-md);background:transparent;color:var(--navy-700);font-family:var(--font-sans);font-weight:600;font-size:15px;border:1px solid var(--border-strong);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out);', { onClick: vm.back, hover: 'background:var(--cream-100);border-color:var(--navy-600);' }, [
        h('span', 'display:inline-flex;', { html: svg(17, 17, 2.2, P.arrowL) }),
        document.createTextNode(' Back')
      ]),
      h('span', 'font-family:var(--font-mono);font-size:12px;color:var(--text-faint);', { text: c.stepOfTotal }),
      h('button', 'display:inline-flex;align-items:center;gap:.55rem;height:46px;padding:0 1.4rem;border-radius:var(--radius-md);background:var(--navy-700);color:#fff;font-family:var(--font-sans);font-weight:600;font-size:15px;border:1px solid transparent;cursor:pointer;transition:background var(--dur-fast) var(--ease-out);', { onClick: vm.next, hover: 'background:var(--navy-800);' }, [
        document.createTextNode(vm.nextLabel + ' '),
        h('span', 'display:inline-flex;', { html: svg(17, 17, 2.2, P.arrowR) })
      ])
    ]));

    return h('div', 'max-width:760px;margin:0 auto;padding:' + vm.secPad + ';', { cls: 'att-fade' }, kids);
  }

  function bulletRow(text) {
    return h('div', 'display:flex;gap:11px;align-items:flex-start;font-size:15px;line-height:1.45;color:var(--text-body);', {}, [
      h('span', 'flex:none;width:6px;height:6px;border-radius:99px;background:var(--gold-500);margin-top:8px;', {}),
      h('span', null, { text })
    ]);
  }
  function bangRow(text) {
    return h('div', 'display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.5;color:var(--text-body);', {}, [
      h('span', 'flex:none;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:99px;background:var(--gold-500);color:#fff;font-size:11px;font-weight:700;margin-top:1px;', { text: '!' }),
      h('span', null, { text })
    ]);
  }
  function tableHead(cols) {
    return h('div', 'display:flex;background:var(--cream-100);', {}, cols.map((col) => h('div', 'flex:1;width:0;padding:9px 14px;font-family:var(--font-mono);font-size:10px;letter-spacing:0.05em;text-transform:uppercase;color:var(--text-muted);', { text: col })));
  }
  function staticRow(cells) {
    return h('div', 'display:flex;border-top:1px solid var(--border-subtle);', {}, cells.map((cell) => h('div', 'flex:1;width:0;padding:11px 14px;font-size:14px;color:var(--text-body);border-right:1px solid var(--border-subtle);', { text: cell })));
  }

  /* ---------------------------- section blocks --------------------------- */
  function renderBlock(b) {
    if (b.isPoints) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:9px;', {}, b.items.map((it) => bulletRow(it)))
    ]);

    if (b.isNote) return h('div', 'margin:26px 0 0;background:var(--navy-050);border:1px solid var(--navy-100);border-radius:var(--radius-md);padding:16px 18px;', {}, [
      h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--navy-600);margin-bottom:6px;', { text: b.label }),
      h('p', 'font-size:15px;line-height:1.55;color:var(--text-strong);margin:0;', { text: b.text })
    ]);

    if (b.isFields) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:14px;', {}, b.fields.map((f) => h('div', 'display:flex;flex-direction:column;gap:6px;', {}, [
        h('label', 'font-size:14px;font-weight:600;color:var(--text-strong);line-height:1.4;', { text: f.label }),
        h('textarea', 'width:100%;min-height:58px;padding:.6rem .8rem;font-size:15px;line-height:1.5;color:var(--text-strong);background:var(--white);border:1px solid var(--border-strong);border-radius:var(--radius-md);resize:vertical;outline:none;transition:border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out);', { val: f.value, onChange: f.onChange, focus: FOCUS, attr: { placeholder: 'Write here…' } })
      ])))
    ]);

    if (b.isNumbered) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:8px;', {}, b.items.map((it) => h('div', 'display:flex;gap:11px;align-items:center;', {}, [
        h('span', 'flex:none;font-family:var(--font-mono);font-size:12px;color:var(--gold-700);width:20px;', { text: it.n }),
        h('input', 'flex:1;height:40px;padding:0 .8rem;font-size:15px;color:var(--text-strong);background:var(--white);border:1px solid var(--border-strong);border-radius:var(--radius-md);outline:none;font-family:var(--font-sans);transition:border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out);', { val: it.value, onChange: it.onChange, focus: FOCUS, attr: { placeholder: '…' } })
      ])))
    ]);

    if (b.isChecks) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:9px;', {}, b.items.map((ck) => h('div', ck.rowStyle, { onClick: ck.onClick }, [
        h('span', ck.boxStyle, ck.checked ? { html: svg(14, 14, 3, P.check) } : {}),
        h('span', 'font-size:15px;color:var(--text-strong);font-weight:500;line-height:1.4;', { text: ck.label })
      ])))
    ]);

    if (b.isRating) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:12px;', {}, b.rows.map((rw) => h('div', 'display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;', {}, [
        h('span', 'font-size:15px;color:var(--text-strong);font-weight:500;', { text: rw.label }),
        h('div', 'display:flex;gap:6px;', {}, rw.opts.map((op) => h('span', op.dotStyle, { text: String(op.n), onClick: op.onClick })))
      ])))
    ]);

    if (b.isTable) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'border:1px solid var(--border-default);border-radius:var(--radius-md);overflow:hidden;', {}, [
        tableHead(b.columns)
      ].concat(b.rows.map((row) => h('div', 'display:flex;border-top:1px solid var(--border-subtle);', {}, row.map((cell) =>
        h('input', 'flex:1;width:0;min-width:0;height:42px;padding:0 10px;border:none;border-right:1px solid var(--border-subtle);background:var(--white);font-size:14px;color:var(--text-strong);outline:none;font-family:var(--font-sans);', { val: cell.value, onChange: cell.onChange, focus: 'background:var(--cream-50);' })
      )))))
    ]);

    if (b.isCosts) {
      const kids = [
        monoLabel('Business formation · ' + b.stateName, 'margin:24px 0 0;margin-bottom:12px;'),
        costTable(b.formationRows),
        monoLabel('Licenses & taxes · ' + b.stateName, 'margin:24px 0 0;margin-bottom:12px;'),
        costTable(b.licenseRows),
        monoLabel('Banking & tools', 'margin:24px 0 0;margin-bottom:12px;'),
        costTable(b.toolRows)
      ];
      if (b.hasNote) kids.push(h('p', 'font-size:13px;line-height:1.5;color:var(--text-muted);margin:12px 0 0;', { text: b.note }));
      return h('div', '', {}, kids);
    }

    if (b.isStateCost) {
      if (b.hasState) return h('a', 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin:6px 0 0;background:var(--cream-100);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:14px 16px;text-decoration:none;', { attr: { href: b.regUrl, target: '_blank', rel: 'noopener' } }, [
        h('span', 'display:flex;flex-direction:column;gap:2px;min-width:0;', {}, [
          h('span', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold-700);', { text: 'Your state · ' + b.stateName }),
          h('span', 'font-size:14px;color:var(--text-body);line-height:1.4;', { text: 'Check exact filing fees at ' + b.regName })
        ]),
        h('span', 'display:inline-flex;', { html: svg(18, 18, 2.2, P.extArrow, '#946312') })
      ]);
      return h('div', 'margin:6px 0 0;background:var(--cream-100);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:14px 16px;cursor:pointer;font-size:14px;color:var(--text-body);', { text: 'Set your state to find your exact filing fees.', onClick: b.onEditState });
    }

    if (b.isStateLinks) {
      if (b.hasState) {
        const link = (title, sub, href) => h('a', 'display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(255,255,255,.06);border:1px solid var(--border-dark);border-radius:var(--radius-md);padding:14px 16px;text-decoration:none;margin-bottom:10px;', { attr: { href, target: '_blank', rel: 'noopener' } }, [
          h('span', 'display:flex;flex-direction:column;gap:2px;min-width:0;', {}, [
            h('span', 'font-family:var(--font-display);font-weight:700;font-size:15px;color:#fff;', { text: title }),
            h('span', 'font-size:12px;color:var(--text-on-dark-muted);', { text: sub })
          ]),
          h('span', 'display:inline-flex;', { html: svg(18, 18, 2.2, P.extArrow, '#DCB04F') })
        ]);
        return h('div', 'margin:6px 0 0;background:var(--navy-900);border-radius:var(--radius-lg);padding:20px 22px;', {}, [
          h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-400);margin-bottom:4px;', { text: 'Register in ' + b.stateName }),
          h('p', 'font-size:13px;line-height:1.5;color:var(--text-on-dark-muted);margin:0 0 14px;', { text: 'Official government links for your state — no third-party sites.' }),
          link('Register your business', b.regName, b.regUrl),
          link('State taxes', b.taxName, b.taxUrl),
          link('Federal EIN (tax ID)', 'IRS — free, every state', 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online'),
          h('p', 'font-size:11px;line-height:1.5;color:var(--text-on-dark-muted);margin:14px 0 0;', { text: 'These go to official .gov / state filing sites. If a page has moved, search “' + b.stateName + ' secretary of state register a business.” This is general guidance, not legal advice.' })
        ]);
      }
      return h('div', 'margin:6px 0 0;background:var(--gold-050);border:1px solid var(--gold-100);border-radius:var(--radius-md);padding:16px 18px;cursor:pointer;', { onClick: b.onEditState }, [
        h('div', 'font-family:var(--font-display);font-weight:700;font-size:15px;color:var(--navy-700);', { text: 'Pick your state to get registration links' }),
        h('p', 'font-size:13px;line-height:1.5;color:var(--text-muted);margin:6px 0 0;', { text: "Tap here to set your state — we'll show the official .gov links to register your business and handle state taxes." })
      ]);
    }

    if (b.isSteps) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:12px;', {}, b.items.map((s) => {
        const inner = [
          h('span', 'font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--navy-700);', { text: s.title }),
          h('span', 'font-size:14px;line-height:1.55;color:var(--text-body);', { text: s.desc })
        ];
        if (s.hasUrl) inner.push(h('a', 'font-size:13px;color:var(--text-link);text-decoration:underline;text-underline-offset:2px;word-break:break-all;', { text: s.url, attr: { href: s.url, target: '_blank', rel: 'noopener' } }));
        return h('div', 'display:flex;gap:14px;align-items:flex-start;background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);padding:16px 18px;', {}, [
          h('span', 'flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:99px;background:var(--navy-700);color:#fff;font-family:var(--font-mono);font-size:12px;font-weight:600;', { text: s.n }),
          h('div', 'display:flex;flex-direction:column;gap:5px;', {}, inner)
        ]);
      }))
    ]);

    if (b.isResources) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:12px;', {}, b.items.map((rs) => h('div', 'background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);padding:16px 18px;', {}, [
        h('a', 'font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--navy-700);text-decoration:none;', { text: rs.name, attr: { href: rs.url, target: '_blank', rel: 'noopener' } }),
        h('a', 'display:block;font-size:12px;color:var(--text-link);text-decoration:underline;text-underline-offset:2px;margin:2px 0 10px;word-break:break-all;', { text: rs.url, attr: { href: rs.url, target: '_blank', rel: 'noopener' } }),
        h('div', 'display:flex;flex-direction:column;gap:6px;', {}, rs.items.map((ri) => h('div', 'display:flex;gap:9px;align-items:flex-start;font-size:14px;line-height:1.45;color:var(--text-body);', {}, [
          h('span', 'flex:none;width:6px;height:6px;border-radius:99px;background:var(--gold-500);margin-top:7px;', {}),
          h('span', null, { text: ri })
        ])))
      ])))
    ]);

    if (b.isAvoid) return h('div', 'margin:26px 0 0;background:var(--gold-050);border:1px solid var(--gold-100);border-radius:var(--radius-md);padding:16px 18px;', {}, [
      h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-700);margin-bottom:10px;', { text: b.label }),
      h('div', 'display:flex;flex-direction:column;gap:8px;', {}, b.items.map((av) => bangRow(av)))
    ]);

    if (b.isDataTable) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'border:1px solid var(--border-default);border-radius:var(--radius-md);overflow:hidden;', {}, [tableHead(b.columns)].concat(b.rows.map((row) => staticRow(row))))
    ]);

    if (b.isTimeline) return h('div', 'margin:26px 0 0;', {}, [
      monoLabel(b.label, 'margin-bottom:12px;'),
      h('div', 'display:flex;flex-direction:column;gap:16px;', {}, b.items.map((tl) => h('div', 'display:flex;flex-direction:column;gap:7px;', {}, [
        h('span', 'font-family:var(--font-display);font-weight:700;font-size:15px;color:var(--forest-700);', { text: tl.label }),
        h('div', 'display:flex;flex-direction:column;gap:5px;', {}, tl.items.map((ti) => h('div', 'display:flex;gap:9px;align-items:flex-start;font-size:14px;line-height:1.45;color:var(--text-body);', {}, [
          h('span', 'flex:none;width:6px;height:6px;border-radius:99px;background:var(--gold-500);margin-top:7px;', {}),
          h('span', null, { text: ti })
        ])))
      ])))
    ]);

    if (b.isMark) return h('div', b.rowStyle, { onClick: b.onClick }, [
      h('span', b.boxStyle, b.checked ? { html: svg(14, 14, 3, P.check) } : {}),
      h('span', 'font-size:14px;color:var(--navy-800);font-weight:600;', { text: b.label })
    ]);

    return null;
  }
  function costTable(rows) {
    return h('div', 'border:1px solid var(--border-default);border-radius:var(--radius-md);overflow:hidden;', {}, [
      h('div', 'display:flex;background:var(--cream-100);', {}, [
        h('div', 'flex:1;width:0;padding:9px 14px;font-family:var(--font-mono);font-size:10px;letter-spacing:0.05em;text-transform:uppercase;color:var(--text-muted);', { text: 'Item' }),
        h('div', 'flex:1;width:0;padding:9px 14px;font-family:var(--font-mono);font-size:10px;letter-spacing:0.05em;text-transform:uppercase;color:var(--text-muted);', { text: 'Cost' })
      ])
    ].concat(rows.map((row) => staticRow(row))));
  }

  /* ============================== SUMMARY ============================== */
  function summaryView(vm) {
    const stat = (big, sub, color, suffix) => h('div', 'background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:22px;', {}, [
      suffix
        ? h('div', 'font-family:var(--font-display);font-weight:800;font-size:var(--text-2xl);color:' + color + ';line-height:1;', {}, [document.createTextNode(big), h('span', 'font-size:var(--text-lg);color:var(--text-faint);', { text: suffix })])
        : h('div', 'font-family:var(--font-display);font-weight:800;font-size:var(--text-2xl);color:' + color + ';line-height:1;', { text: big }),
      h('div', 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-muted);margin-top:8px;', { text: sub })
    ]);

    const banner = [
      h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;opacity:.8;margin-bottom:6px;', { text: 'Your go-or-no-go call' }),
      h('div', 'font-family:var(--font-display);font-weight:800;font-size:var(--text-xl);line-height:1.1;', { text: vm.decisionTitle }),
      h('p', 'font-size:14px;line-height:1.55;margin:8px 0 0;opacity:.92;', { text: vm.decisionBlurb })
    ];
    if (vm.needsDecision) banner.push(h('button', 'margin-top:14px;display:inline-flex;align-items:center;height:40px;padding:0 1.1rem;border-radius:var(--radius-md);background:var(--navy-700);color:#fff;font-family:var(--font-sans);font-weight:600;font-size:14px;border:none;cursor:pointer;', { text: 'Make your decision', onClick: vm.goDecision }));

    const checklist = h('div', 'margin:34px 0 0;', {}, [
      h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-lg);color:var(--navy-700);margin-bottom:14px;', { text: 'Final validation checklist' }),
      h('div', 'display:flex;flex-direction:column;gap:2px;', {}, vm.checklist.map((c) => h('div', 'display:flex;align-items:center;gap:12px;padding:12px 4px;border-bottom:1px solid var(--border-subtle);', {}, [
        h('span', c.markStyle, { html: svg(13, 13, 3.2, P.check) }),
        h('span', 'font-size:15px;color:var(--text-body);', { text: c.text })
      ])))
    ]);

    const kids = [
      h('span', 'font-family:var(--font-mono);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-700);', { text: 'The decision point' }),
      h('h1', 'font-family:var(--font-display);font-weight:800;font-size:var(--text-2xl);line-height:1.08;letter-spacing:-0.02em;color:var(--navy-700);margin:14px 0 0;', { text: "Here's where your idea stands." }),
      h('div', 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0 0;', {}, [
        stat(String(vm.completedCount), 'Sections complete', 'var(--forest-600)', '/' + vm.totalSections),
        stat(vm.progressPct + '%', 'Workbook filled in', 'var(--navy-700)', null)
      ]),
      h('div', vm.decisionBannerStyle, {}, banner),
      checklist
    ];

    if (vm.hasIncomplete) kids.push(h('div', 'margin:34px 0 0;background:var(--cream-100);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:22px;', {}, [
      h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-md);color:var(--navy-700);margin-bottom:4px;', { text: 'Still open' }),
      h('p', 'font-size:13px;color:var(--text-muted);margin:0 0 14px;', { text: "Jump back into any section you haven't finished." }),
      h('div', 'display:flex;flex-wrap:wrap;gap:8px;', {}, vm.incomplete.map((s) => h('button', 'display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:99px;background:var(--white);border:1px solid var(--border-strong);font-size:13px;color:var(--navy-700);font-weight:500;cursor:pointer;transition:border-color var(--dur-fast) var(--ease-out);', { text: s.title, onClick: s.onClick, hover: 'border-color:var(--navy-600);' })))
    ]));

    if (vm.allDone) kids.push(h('div', 'margin:34px 0 0;display:flex;gap:14px;background:var(--forest-050);border:1px solid var(--forest-100);border-radius:var(--radius-lg);padding:22px;', {}, [
      iconSpan('display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;flex:none;border-radius:99px;background:var(--forest-600);color:#fff;', svg(18, 18, 3, P.check)),
      h('div', '', {}, [
        h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-md);color:var(--forest-700);', { text: 'Every section complete.' }),
        h('p', 'font-size:14px;line-height:1.55;color:var(--text-body);margin:6px 0 0;', { text: "You've thought this through end to end. Trust the evidence, make your call, and start building." })
      ])
    ]));

    kids.push(h('div', 'margin:36px 0 0;padding-top:24px;border-top:1px solid var(--border-subtle);', {}, [
      h('button', 'display:inline-flex;align-items:center;gap:.5rem;height:46px;padding:0 1.2rem;border-radius:var(--radius-md);background:transparent;color:var(--navy-700);font-family:var(--font-sans);font-weight:600;font-size:15px;border:1px solid var(--border-strong);cursor:pointer;', { onClick: vm.backToWork, hover: 'background:var(--cream-100);' }, [
        h('span', 'display:inline-flex;', { html: svg(17, 17, 2.2, P.arrowL) }),
        document.createTextNode(' Back to the workbook')
      ])
    ]));

    return h('div', 'max-width:760px;margin:0 auto;padding:' + vm.sumPad + ';', { cls: 'att-fade' }, kids);
  }

  /* ====================== RESOURCE VIEWS (consult/howto/kb/legal) ====================== */
  function backBtn(vm) {
    return h('button', 'display:inline-flex;align-items:center;gap:.4rem;background:none;border:none;color:var(--text-muted);font-family:var(--font-sans);font-size:13px;font-weight:600;cursor:pointer;padding:0;margin-bottom:18px;', { onClick: vm.onOverview }, [
      h('span', 'display:inline-flex;', { html: svg(15, 15, 2.2, P.arrowL) }),
      document.createTextNode(' Back')
    ]);
  }
  const EYE = 'font-family:var(--font-mono);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-700);';
  const RH1 = 'font-family:var(--font-display);font-weight:800;font-size:var(--text-2xl);line-height:1.08;letter-spacing:-0.02em;color:var(--navy-700);margin:10px 0 0;text-wrap:balance;';
  const RSUB = 'font-size:var(--text-md);line-height:1.55;color:var(--text-body);margin:14px 0 0;';

  function consultView(vm) {
    const rows = vm.acct.map((r) => h('div', 'display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 0;border-bottom:1px solid var(--border-subtle);', {}, [
      h('span', 'font-family:var(--font-mono);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-muted);', { text: r.label }),
      h('span', 'font-size:15px;font-weight:600;color:var(--navy-700);text-align:right;', { text: r.value })
    ]));
    return h('div', 'max-width:720px;margin:0 auto;padding:' + vm.secPad + ';', { cls: 'att-fade' }, [
      backBtn(vm),
      h('span', EYE, { text: 'One-on-one consulting' }),
      h('h1', RH1, { text: 'Book your consultation.' }),
      h('p', RSUB, { text: "Want a real person across the table? Send us a note and we'll set up a one-on-one. We've pre-filled the email with your account details so all you do is tap send." }),
      h('div', 'margin:26px 0 0;background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:8px 22px;', {}, rows),
      h('div', 'margin:24px 0 0;', {}, [
        h('a', 'display:inline-flex;align-items:center;justify-content:center;gap:.55rem;width:100%;height:52px;border-radius:var(--radius-md);background:var(--gold-500);color:var(--navy-900);font-family:var(--font-sans);font-weight:700;font-size:var(--text-md);text-decoration:none;cursor:pointer;', { attr: { href: vm.consultMailtoHref }, hover: 'background:var(--gold-400);' }, [
          h('span', 'display:inline-flex;', { html: svg(19, 19, 2.2, P.mailEnv) }),
          document.createTextNode(' Book your consultation')
        ]),
        h('p', 'font-size:12px;line-height:1.5;color:var(--text-faint);margin:12px 0 0;text-align:center;', { html: 'Opens an email to info@acrossthetable.biz. Prefer the web? Visit <a href="https://AcrosstheTable.biz" target="_blank" rel="noopener" style="color:var(--navy-600);font-weight:600;">AcrosstheTable.biz</a>.' })
      ])
    ]);
  }

  function howtoView(vm) {
    return h('div', 'max-width:720px;margin:0 auto;padding:' + vm.secPad + ';', { cls: 'att-fade' }, [
      backBtn(vm),
      h('span', EYE, { text: 'Getting started' }),
      h('h1', RH1, { text: 'How to use the app.' }),
      h('p', RSUB, { text: 'Everything works in seven simple moves. Take it at your own pace — your progress saves as you go.' }),
      h('div', 'margin:28px 0 0;display:flex;flex-direction:column;gap:12px;', {}, vm.howtoSteps.map((s) => h('div', 'display:flex;gap:16px;align-items:flex-start;background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:18px 20px;', {}, [
        h('span', 'flex:none;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:99px;background:var(--navy-700);color:#fff;font-family:var(--font-display);font-weight:800;font-size:15px;', { text: s.n }),
        h('div', 'min-width:0;', {}, [
          h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-md);color:var(--navy-700);', { text: s.title }),
          h('p', 'font-size:14px;line-height:1.55;color:var(--text-body);margin:5px 0 0;', { text: s.body })
        ])
      ])))
    ]);
  }

  function kbView(vm) {
    return h('div', 'max-width:720px;margin:0 auto;padding:' + vm.secPad + ';', { cls: 'att-fade' }, [
      backBtn(vm),
      h('span', EYE, { text: 'Knowledge base' }),
      h('h1', RH1, { text: 'Answers to common questions.' }),
      h('div', 'margin:26px 0 0;display:flex;flex-direction:column;gap:14px;', {}, vm.kbArticles.map((a) => h('div', 'background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:20px 22px;', {}, [
        h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-md);color:var(--navy-700);', { text: a.q }),
        h('p', 'font-size:14px;line-height:1.6;color:var(--text-body);margin:8px 0 0;', { text: a.a })
      ]))),
      h('div', 'margin:24px 0 0;display:flex;gap:14px;align-items:center;background:var(--navy-900);border-radius:var(--radius-lg);padding:20px 22px;', {}, [
        h('div', 'flex:1;min-width:0;', {}, [
          h('div', 'font-family:var(--font-display);font-weight:700;font-size:var(--text-md);color:#fff;', { text: 'Still have a question?' }),
          h('p', 'font-size:13.5px;line-height:1.5;color:var(--text-on-dark-muted);margin:5px 0 0;', { text: "We're real people and we read every message." })
        ]),
        h('a', 'flex:none;display:inline-flex;align-items:center;height:42px;padding:0 1.2rem;border-radius:var(--radius-md);background:var(--gold-500);color:var(--navy-900);font-family:var(--font-sans);font-weight:700;font-size:14px;text-decoration:none;', { text: 'Email us', attr: { href: 'mailto:info@acrossthetable.biz' }, hover: 'background:var(--gold-400);' })
      ])
    ]);
  }

  function legalView(vm) {
    return h('div', 'max-width:720px;margin:0 auto;padding:' + vm.secPad + ';', { cls: 'att-fade' }, [
      backBtn(vm),
      h('span', EYE, { text: 'Legal & licensing' }),
      h('h1', RH1, { text: 'The fine print, in plain language.' }),
      h('p', RSUB, { text: 'Your use of the app is covered by the documents below. They protect your work and our system alike.' }),
      h('div', 'margin:28px 0 0;display:flex;flex-direction:column;gap:16px;', {}, vm.legalDocs.map((d) => h('div', 'background:var(--white);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:24px 26px;', {}, [
        h('div', 'font-family:var(--font-display);font-weight:800;font-size:var(--text-lg);color:var(--navy-700);', { text: d.title }),
        h('div', 'font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-faint);margin-top:5px;', { text: d.updated }),
        h('div', 'margin-top:14px;display:flex;flex-direction:column;gap:11px;', {}, d.paras.map((p) => h('p', 'font-size:14px;line-height:1.65;color:var(--text-body);margin:0;', { text: p })))
      ]))),
      h('p', 'font-size:13px;line-height:1.6;color:var(--text-muted);margin:22px 0 0;text-align:center;', { html: 'Questions about licensing? Email <a href="mailto:info@acrossthetable.biz" style="color:var(--navy-600);font-weight:600;">info@acrossthetable.biz</a> or visit <a href="https://AcrosstheTable.biz" target="_blank" rel="noopener" style="color:var(--navy-600);font-weight:600;">AcrosstheTable.biz</a>.' })
    ]);
  }

  /* ============================== MOUNT =============================== */
  window.ATTRender = function (vm, app, mount) {
    // preserve main scroll across re-render
    let prevScroll = 0;
    const prevMain = mount.querySelector('#att-main');
    if (prevMain) prevScroll = prevMain.scrollTop;

    mount.textContent = '';
    const root = h('div', vm.rootStyle, {});
    root.appendChild(vm.isOnboarding ? Onboarding(vm) : AppShell(vm));
    mount.appendChild(root);

    const newMain = mount.querySelector('#att-main');
    if (newMain && prevScroll) newMain.scrollTop = prevScroll;
  };
})();
