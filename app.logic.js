class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.KEY = 'attable-founder-workbook-v1';
    this.CKEY = 'attable-commitment-v1';
    this.AKEY = 'attable-account-v1';
    this.state = {
      step: 0, answers: {}, decision: '', view: null,
      isMobile: (typeof window !== 'undefined' && window.innerWidth < 980),
      navOpen: false, commitment: null, editing: false, openPart: null,
      account: null, acctStep: 'form',
      acct: { fullName: '', businessName: '', industry: '', bizType: '', email: '', phone: '' },
      onb: { name: '', mode: 'date', date: '', time: '', hours: 5, reminderTime: '09:00', reminders: true, state: '' }
    };
    this._onResize = this._onResize.bind(this);
  }

  componentDidMount() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) { const d = JSON.parse(raw); this.setState({ step: d.step || 0, answers: d.answers || {}, decision: d.decision || '' }); }
    } catch (e) {}
    try {
      const ra = localStorage.getItem(this.AKEY);
      if (ra) { const a = JSON.parse(ra); if (a && a.verified) this.setState({ account: a }); }
    } catch (e) {}
    try {
      const rc = localStorage.getItem(this.CKEY);
      if (rc) { const c = JSON.parse(rc); if (c) this.setState({ commitment: c, onb: Object.assign({ name: '', mode: 'date', date: '', time: '', hours: 5, reminderTime: '09:00', reminders: true, state: '' }, c) }); }
    } catch (e) {}
    if (typeof window !== 'undefined') window.addEventListener('resize', this._onResize);
    if ('serviceWorker' in navigator) { try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {} }
    setTimeout(() => this.scheduleReminder(), 500);
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') window.removeEventListener('resize', this._onResize);
    if (this._remTimer) clearTimeout(this._remTimer);
  }

  _onResize() { const m = window.innerWidth < 980; if (m !== this.state.isMobile) this.setState({ isMobile: m, navOpen: false }); }

  save(next) {
    const s = Object.assign({}, this.state, next);
    try {
      localStorage.setItem(this.KEY, JSON.stringify({ step: s.step, answers: s.answers, decision: s.decision }));
    } catch (e) {}
  }

  go(step) {
    this.setState({ step, navOpen: false, view: null });
    this.save({ step });
    const m = document.getElementById('att-main');
    if (m) m.scrollTop = 0;
  }

  stateData() {
    // Official government business-registration & tax sites only (no third parties).
    return {
      AL: { name: 'Alabama', regName: 'Alabama Secretary of State', regUrl: 'https://www.sos.alabama.gov/business-services', taxName: 'Alabama Department of Revenue', taxUrl: 'https://www.revenue.alabama.gov' },
      AK: { name: 'Alaska', regName: 'Alaska Division of Corporations', regUrl: 'https://www.commerce.alaska.gov/web/cbpl/corporations.aspx', taxName: 'Alaska Department of Revenue', taxUrl: 'https://tax.alaska.gov' },
      AZ: { name: 'Arizona', regName: 'Arizona Corporation Commission', regUrl: 'https://azcc.gov/corporations', taxName: 'Arizona Department of Revenue', taxUrl: 'https://azdor.gov' },
      AR: { name: 'Arkansas', regName: 'Arkansas Secretary of State', regUrl: 'https://www.sos.arkansas.gov/business-commercial-services-bcs', taxName: 'Arkansas Dept. of Finance & Administration', taxUrl: 'https://www.dfa.arkansas.gov' },
      CA: { name: 'California', regName: 'California Secretary of State (bizfile)', regUrl: 'https://bizfileonline.sos.ca.gov', taxName: 'California Franchise Tax Board', taxUrl: 'https://www.ftb.ca.gov' },
      CO: { name: 'Colorado', regName: 'Colorado Secretary of State', regUrl: 'https://www.sos.state.co.us/biz/', taxName: 'Colorado Department of Revenue', taxUrl: 'https://tax.colorado.gov' },
      CT: { name: 'Connecticut', regName: 'CT Business (Secretary of the State)', regUrl: 'https://business.ct.gov', taxName: 'CT Department of Revenue Services', taxUrl: 'https://portal.ct.gov/DRS' },
      DE: { name: 'Delaware', regName: 'Delaware Division of Corporations', regUrl: 'https://corp.delaware.gov', taxName: 'Delaware Division of Revenue', taxUrl: 'https://revenue.delaware.gov' },
      FL: { name: 'Florida', regName: 'Florida Division of Corporations (Sunbiz)', regUrl: 'https://dos.fl.gov/sunbiz/', taxName: 'Florida Department of Revenue', taxUrl: 'https://floridarevenue.com' },
      GA: { name: 'Georgia', regName: 'Georgia Corporations Division (SOS)', regUrl: 'https://sos.ga.gov/georgia-corporations-division', taxName: 'Georgia Department of Revenue', taxUrl: 'https://dor.georgia.gov' },
      HI: { name: 'Hawaii', regName: 'Hawaii Business Registration Division', regUrl: 'https://cca.hawaii.gov/breg/', taxName: 'Hawaii Department of Taxation', taxUrl: 'https://tax.hawaii.gov' },
      ID: { name: 'Idaho', regName: 'Idaho Secretary of State', regUrl: 'https://sos.idaho.gov/business-services/', taxName: 'Idaho State Tax Commission', taxUrl: 'https://tax.idaho.gov' },
      IL: { name: 'Illinois', regName: 'Illinois Secretary of State', regUrl: 'https://www.ilsos.gov/departments/business_services/home.html', taxName: 'Illinois Department of Revenue', taxUrl: 'https://tax.illinois.gov' },
      IN: { name: 'Indiana', regName: 'Indiana Secretary of State (INBiz)', regUrl: 'https://inbiz.in.gov', taxName: 'Indiana Department of Revenue', taxUrl: 'https://www.in.gov/dor/' },
      IA: { name: 'Iowa', regName: 'Iowa Secretary of State', regUrl: 'https://sos.iowa.gov/business/', taxName: 'Iowa Department of Revenue', taxUrl: 'https://tax.iowa.gov' },
      KS: { name: 'Kansas', regName: 'Kansas Secretary of State', regUrl: 'https://sos.ks.gov/business/business.html', taxName: 'Kansas Department of Revenue', taxUrl: 'https://www.ksrevenue.gov' },
      KY: { name: 'Kentucky', regName: 'Kentucky Business One Stop', regUrl: 'https://onestop.ky.gov', taxName: 'Kentucky Department of Revenue', taxUrl: 'https://revenue.ky.gov' },
      LA: { name: 'Louisiana', regName: 'Louisiana Secretary of State (geauxBIZ)', regUrl: 'https://www.sos.la.gov/BusinessServices', taxName: 'Louisiana Department of Revenue', taxUrl: 'https://revenue.louisiana.gov' },
      ME: { name: 'Maine', regName: 'Maine Secretary of State', regUrl: 'https://www.maine.gov/sos/cec/corp/', taxName: 'Maine Revenue Services', taxUrl: 'https://www.maine.gov/revenue/' },
      MD: { name: 'Maryland', regName: 'Maryland Business Express (SDAT)', regUrl: 'https://businessexpress.maryland.gov', taxName: 'Comptroller of Maryland', taxUrl: 'https://www.marylandtaxes.gov' },
      MA: { name: 'Massachusetts', regName: 'Secretary of the Commonwealth, Corporations', regUrl: 'https://www.sec.state.ma.us/divisions/corporations/corporations.htm', taxName: 'Massachusetts Department of Revenue', taxUrl: 'https://www.mass.gov/orgs/massachusetts-department-of-revenue' },
      MI: { name: 'Michigan', regName: 'Michigan LARA (Corporations)', regUrl: 'https://www.michigan.gov/lara/bureau-list/cscl', taxName: 'Michigan Department of Treasury', taxUrl: 'https://www.michigan.gov/taxes' },
      MN: { name: 'Minnesota', regName: 'Minnesota Secretary of State', regUrl: 'https://www.sos.mn.gov/business-liens/', taxName: 'Minnesota Department of Revenue', taxUrl: 'https://www.revenue.state.mn.us' },
      MS: { name: 'Mississippi', regName: 'Mississippi Secretary of State', regUrl: 'https://www.sos.ms.gov/business-services', taxName: 'Mississippi Department of Revenue', taxUrl: 'https://www.dor.ms.gov' },
      MO: { name: 'Missouri', regName: 'Missouri Secretary of State', regUrl: 'https://www.sos.mo.gov/business', taxName: 'Missouri Department of Revenue', taxUrl: 'https://dor.mo.gov' },
      MT: { name: 'Montana', regName: 'Montana Secretary of State', regUrl: 'https://sosmt.gov/business/', taxName: 'Montana Department of Revenue', taxUrl: 'https://mtrevenue.gov' },
      NE: { name: 'Nebraska', regName: 'Nebraska Secretary of State', regUrl: 'https://sos.nebraska.gov/business-services', taxName: 'Nebraska Department of Revenue', taxUrl: 'https://revenue.nebraska.gov' },
      NV: { name: 'Nevada', regName: 'Nevada Secretary of State (SilverFlume)', regUrl: 'https://www.nvsos.gov/sos/businesses', taxName: 'Nevada Department of Taxation', taxUrl: 'https://tax.nv.gov' },
      NH: { name: 'New Hampshire', regName: 'NH Secretary of State (QuickStart)', regUrl: 'https://quickstart.sos.nh.gov', taxName: 'NH Dept. of Revenue Administration', taxUrl: 'https://www.revenue.nh.gov' },
      NJ: { name: 'New Jersey', regName: 'NJ Division of Revenue & Enterprise Services', regUrl: 'https://www.njportal.com/DOR/BusinessFormation', taxName: 'NJ Division of Taxation', taxUrl: 'https://www.nj.gov/treasury/taxation/' },
      NM: { name: 'New Mexico', regName: 'New Mexico Secretary of State', regUrl: 'https://www.sos.nm.gov/business-services/', taxName: 'NM Taxation & Revenue Department', taxUrl: 'https://www.tax.newmexico.gov' },
      NY: { name: 'New York', regName: 'NY Dept. of State, Division of Corporations', regUrl: 'https://dos.ny.gov/division-corporations', taxName: 'NY Dept. of Taxation & Finance', taxUrl: 'https://www.tax.ny.gov' },
      NC: { name: 'North Carolina', regName: 'North Carolina Secretary of State', regUrl: 'https://www.sosnc.gov/divisions/business_registration', taxName: 'NC Department of Revenue', taxUrl: 'https://www.ncdor.gov' },
      ND: { name: 'North Dakota', regName: 'North Dakota Secretary of State', regUrl: 'https://sos.nd.gov/business/', taxName: 'ND Office of State Tax Commissioner', taxUrl: 'https://www.tax.nd.gov' },
      OH: { name: 'Ohio', regName: 'Ohio Secretary of State', regUrl: 'https://www.ohiosos.gov/businesses/', taxName: 'Ohio Department of Taxation', taxUrl: 'https://tax.ohio.gov' },
      OK: { name: 'Oklahoma', regName: 'Oklahoma Secretary of State', regUrl: 'https://www.sos.ok.gov/business/', taxName: 'Oklahoma Tax Commission', taxUrl: 'https://oklahoma.gov/tax.html' },
      OR: { name: 'Oregon', regName: 'Oregon Secretary of State, Corporation Division', regUrl: 'https://sos.oregon.gov/business/Pages/default.aspx', taxName: 'Oregon Department of Revenue', taxUrl: 'https://www.oregon.gov/dor/' },
      PA: { name: 'Pennsylvania', regName: 'Pennsylvania Department of State', regUrl: 'https://www.pa.gov/services/dos/register-a-business', taxName: 'Pennsylvania Department of Revenue', taxUrl: 'https://www.pa.gov/agencies/revenue.html' },
      RI: { name: 'Rhode Island', regName: 'Rhode Island Secretary of State', regUrl: 'https://www.sos.ri.gov/divisions/business-services', taxName: 'RI Division of Taxation', taxUrl: 'https://tax.ri.gov' },
      SC: { name: 'South Carolina', regName: 'South Carolina Secretary of State', regUrl: 'https://sos.sc.gov/online-filings/business-entities', taxName: 'SC Department of Revenue', taxUrl: 'https://dor.sc.gov' },
      SD: { name: 'South Dakota', regName: 'South Dakota Secretary of State', regUrl: 'https://sdsos.gov/business-services/', taxName: 'SD Department of Revenue', taxUrl: 'https://dor.sd.gov' },
      TN: { name: 'Tennessee', regName: 'Tennessee Secretary of State', regUrl: 'https://sos.tn.gov/business-services', taxName: 'Tennessee Department of Revenue', taxUrl: 'https://www.tn.gov/revenue' },
      TX: { name: 'Texas', regName: 'Texas Secretary of State', regUrl: 'https://www.sos.state.tx.us/corp/index.shtml', taxName: 'Texas Comptroller of Public Accounts', taxUrl: 'https://comptroller.texas.gov' },
      UT: { name: 'Utah', regName: 'Utah Division of Corporations', regUrl: 'https://corporations.utah.gov', taxName: 'Utah State Tax Commission', taxUrl: 'https://tax.utah.gov' },
      VT: { name: 'Vermont', regName: 'Vermont Secretary of State', regUrl: 'https://sos.vermont.gov/corporations/', taxName: 'Vermont Department of Taxes', taxUrl: 'https://tax.vermont.gov' },
      VA: { name: 'Virginia', regName: 'Virginia State Corporation Commission', regUrl: 'https://www.scc.virginia.gov/pages/Businesses', taxName: 'Virginia Department of Taxation', taxUrl: 'https://www.tax.virginia.gov' },
      WA: { name: 'Washington', regName: 'Washington Secretary of State, Corporations', regUrl: 'https://www.sos.wa.gov/corporations-charities', taxName: 'Washington Department of Revenue', taxUrl: 'https://dor.wa.gov' },
      WV: { name: 'West Virginia', regName: 'WV Secretary of State (One Stop)', regUrl: 'https://sos.wv.gov/business', taxName: 'West Virginia Tax Division', taxUrl: 'https://tax.wv.gov' },
      WI: { name: 'Wisconsin', regName: 'WI Dept. of Financial Institutions', regUrl: 'https://www.wdfi.org/corporations/', taxName: 'Wisconsin Department of Revenue', taxUrl: 'https://www.revenue.wi.gov' },
      WY: { name: 'Wyoming', regName: 'Wyoming Secretary of State', regUrl: 'https://sos.wyo.gov/business/', taxName: 'Wyoming Department of Revenue', taxUrl: 'https://revenue.wyo.gov' },
      DC: { name: 'District of Columbia', regName: 'DC Dept. of Licensing & Consumer Protection', regUrl: 'https://dlcp.dc.gov/service/register-business', taxName: 'DC Office of Tax & Revenue', taxUrl: 'https://otr.cfo.dc.gov' }
    };
  }

  stateOptions() {
    const d = this.stateData();
    return Object.keys(d).sort((a, b) => d[a].name.localeCompare(d[b].name)).map(k => ({ value: k, label: d[k].name }));
  }

  stateCost(abbr) {
    // Estimated one-time LLC filing fees (Articles of Organization). Verify current fees with the state.
    const llc = { AL:'$200', AK:'$250', AZ:'$50', AR:'$45', CA:'$70', CO:'$50', CT:'$120', DE:'$110', FL:'$125', GA:'$100', HI:'$50', ID:'$100', IL:'$150', IN:'$95', IA:'$50', KS:'$160', KY:'$40', LA:'$100', ME:'$175', MD:'$100', MA:'$500', MI:'$50', MN:'$155', MS:'$50', MO:'$50', MT:'$35', NE:'$100', NV:'$425', NH:'$100', NJ:'$125', NM:'$50', NY:'$200', NC:'$125', ND:'$135', OH:'$99', OK:'$100', OR:'$100', PA:'$125', RI:'$150', SC:'$110', SD:'$150', TN:'$300', TX:'$300', UT:'$59', VT:'$125', VA:'$100', WA:'$200', WV:'$100', WI:'$130', WY:'$100', DC:'$99' };
    const note = { CA:'Plus $800 annual CA franchise tax.', NY:'Plus a newspaper publication requirement (cost varies by county).', NV:'Includes the initial member list and state business license.', TN:'Minimum $300 — $50 per member.', MA:'One of the higher filing fees in the U.S.', AZ:'Plus newspaper publication (except Maricopa & Pima counties).' };
    const salesTax = { AZ: { label:'Transaction Privilege Tax (TPT) license', cost:'$12 / location' } };
    const dba = { AZ:'$10' };
    return {
      llc: llc[abbr] || 'Varies',
      dbaCost: dba[abbr] || 'Varies (often county-level)',
      salesLabel: (salesTax[abbr] && salesTax[abbr].label) || 'State sales-tax / seller\u2019s permit',
      salesCost: (salesTax[abbr] && salesTax[abbr].cost) || 'Usually free to register',
      note: note[abbr] || ''
    };
  }

  toggleNav() { this.setState(s => ({ navOpen: !s.navOpen })); }
  togglePart(p) { this.setState(s => ({ openPart: s.openPart === p ? -1 : p })); }
  closeNav() { this.setState({ navOpen: false }); }
  setOnb(patch) { this.setState(s => ({ onb: Object.assign({}, s.onb, patch) })); }
  editCommitment() { this.setState({ editing: true, navOpen: false }); }

  // ----- account -----
  setAcct(patch) { this.setState(s => ({ acct: Object.assign({}, s.acct, patch) })); }
  industries() {
    return ['Retail & e-commerce','Food & beverage','Health & wellness','Beauty & personal care','Home & cleaning services','Construction & trades','Professional services','Creative & design','Technology & software','Education & coaching','Events & hospitality','Transportation & logistics','Real estate','Automotive','Agriculture','Nonprofit','Other'];
  }
  bizTypes() {
    return ['Sole proprietorship','Single-member LLC','Multi-member LLC','Partnership','S-Corporation','C-Corporation','Nonprofit','Not sure yet'];
  }
  acctValid() {
    const a = this.state.acct;
    const emailOk = /.+@.+\..+/.test((a.email || '').trim());
    return !!(a.fullName.trim() && a.businessName.trim() && a.industry && a.bizType && emailOk && a.phone.trim());
  }
  reviewAccount() { if (this.acctValid()) this.setState({ acctStep: 'verify' }); }
  backToAcctForm() { this.setState({ acctStep: 'form' }); }
  confirmAccount() {
    const a = this.state.acct;
    const accountNo = 'ATT-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' + Math.floor(Math.random() * 9000 + 1000);
    const account = {
      fullName: a.fullName.trim(), businessName: a.businessName.trim(), industry: a.industry,
      bizType: a.bizType, email: a.email.trim(), phone: a.phone.trim(),
      accountNo, verified: true, createdAt: Date.now()
    };
    try { localStorage.setItem(this.AKEY, JSON.stringify(account)); } catch (e) {}
    this.setState({ account, acctStep: 'form' });
  }

  // ----- extra views -----
  openView(v) { this.setState({ view: v, navOpen: false }); const m = document.getElementById('att-main'); if (m) m.scrollTop = 0; }
  closeView() { this.setState({ view: null }); }

  // ----- affirmations (replaceable from an uploaded list) -----
  affirmations() {
    return [
      'You are building something only you can build.',
      'Small steps every day beat big leaps once a year.',
      'Your business deserves your consistency, not your perfection.',
      'Every expert was once a beginner who kept going.',
      'You don\u2019t have to be ready \u2014 you just have to start.',
      'Progress, not pressure. One task at a time.',
      'The work you do today is the proof you\u2019ll thank yourself for.',
      'You are capable of figuring this out.',
      'Showing up is the hardest part, and you\u2019re here.',
      'Your future customers are waiting for you to keep going.',
      'Done is better than perfect. Move it forward.',
      'You\u2019ve handled every hard day so far. You\u2019ve got this one too.',
      'Clarity comes from action, not from waiting.',
      'A finished page beats a perfect plan in your head.',
      'Your dream is worth the discipline.',
      'Keep your promise to yourself today.',
      'You are closer than you were yesterday.',
      'Real businesses are built in the unglamorous, daily reps.',
      'Trust the process you committed to.',
      'You set this goal for a reason \u2014 honor it.'
    ];
  }
  todaysAffirmation() {
    const list = this.affirmations();
    const day = Math.floor(Date.now() / 86400000);
    return list[day % list.length];
  }

  consultMailto() {
    const a = this.state.account || {};
    const subject = 'One-on-one consultation request \u2014 ' + (a.businessName || 'New client');
    const body = [
      'Hi Across the Table,',
      '',
      'I\u2019d like to book a one-on-one consultation. Here are my details:',
      '',
      'Name: ' + (a.fullName || ''),
      'Business name: ' + (a.businessName || ''),
      'Industry: ' + (a.industry || ''),
      'Business type: ' + (a.bizType || ''),
      'Email: ' + (a.email || ''),
      'Phone: ' + (a.phone || ''),
      'Account #: ' + (a.accountNo || ''),
      '',
      'A few things I\u2019d like help with:',
      '\u2022 ',
      '',
      'Thank you,',
      (a.fullName || '')
    ].join('\n');
    return 'mailto:info@acrossthetable.biz?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  requestNotif() {
    if (typeof Notification === 'undefined') return Promise.resolve('unsupported');
    if (Notification.permission === 'granted') return Promise.resolve('granted');
    try { return Promise.resolve(Notification.requestPermission()); } catch (e) { return Promise.resolve('default'); }
  }

  startWorkbook() {
    const o = this.state.onb;
    const commitment = { name: (o.name || '').trim(), mode: o.mode, date: o.date || '', time: o.time || '', hours: Number(o.hours) || 0, reminderTime: o.reminderTime || '09:00', reminders: !!o.reminders, state: o.state || '', createdAt: Date.now() };
    try { localStorage.setItem(this.CKEY, JSON.stringify(commitment)); } catch (e) {}
    const finish = () => { this.setState({ commitment: commitment, editing: false }, () => this.scheduleReminder()); };
    if (commitment.reminders) { this.requestNotif().then(finish); } else { finish(); }
  }

  scheduleReminder() {
    if (this._remTimer) clearTimeout(this._remTimer);
    const c = this.state.commitment;
    if (!c || !c.reminders) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const parts = (c.reminderTime || '09:00').split(':');
    const hh = parseInt(parts[0], 10) || 9, mm = parseInt(parts[1], 10) || 0;
    const now = new Date(); const next = new Date(); next.setHours(hh, mm, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const ms = Math.min(next - now, 2147483000);
    this._remTimer = setTimeout(() => { this.fireReminder(); this.scheduleReminder(); }, ms);
  }

  fireReminder() {
    try {
      const aff = this.todaysAffirmation();
      new Notification('Across the Table — keep building', { body: aff + '\n\nYou’re ' + (this._pct || 0) + '% through your workbook — a few minutes today moves you forward.', icon: 'assets/icon-192.png' });
    } catch (e) {}
  }

  setAnswer(qid, val) {
    this.setState(st => {
      const answers = Object.assign({}, st.answers, { [qid]: val });
      try { localStorage.setItem(this.KEY, JSON.stringify({ step: st.step, answers, decision: st.decision })); } catch (e) {}
      return { answers };
    });
  }

  setDecision(val) {
    this.setState({ decision: val });
    this.save({ decision: val });
  }

  reset() {
    try { localStorage.removeItem(this.KEY); } catch (e) {}
    this.setState({ step: 0, answers: {}, decision: '' });
  }

  sections() {
    return [
      // ===== PART 1 — Your roadmap (idea to launch) =====
      { id:'rm1', part:1, stage:'Purpose & idea', title:'Why this business?', lead:`Turning frustration, passion, or skill into an idea.`,
        teach:`Every business starts with a reason. It might be solving a problem you\u2019ve faced, sharing a skill, or pursuing a passion. Understanding your \u201Cwhy\u201D gives you direction and keeps you motivated when challenges arise \u2014 so your idea should connect to something you genuinely care about.`,
        why:`If you don\u2019t know why you\u2019re starting, it\u2019s easy to give up when things get hard.`,
        example:`You love baking and notice local bakeries don\u2019t offer gluten-free options \u2014 that becomes your business idea.`,
        quote:`If your business idea doesn\u2019t solve a real problem, it\u2019s just a hobby with a logo.`,
        questions:[`What\u2019s your \u201Cwhy\u201D \u2014 the frustration, passion, or skill behind your idea?`] },
      { id:'rm2', part:1, stage:'Purpose & idea', title:'Problem before product', lead:`Validating what people actually need.`,
        teach:`Before creating a product or service, understand the real problem your customers face. Many beginners build what they think people want instead of what they need. Research, ask questions, and observe to validate your idea \u2014 solving a real problem raises your odds of success and saves time, money, and frustration.`,
        why:`If you build something nobody needs, you won\u2019t make sales, no matter how good it is.`,
        example:`You plan to sell a paper planner, but research shows people struggle more with organizing tasks digitally \u2014 so you design a digital planner instead.`,
        quote:`Stop building products nobody asked for.`,
        questions:[`What real problem have you confirmed people actually need solved?`] },
      { id:'rm3', part:1, stage:'Purpose & idea', title:'Hobby or business?', lead:`Knowing when it\u2019s time to get serious.`,
        teach:`Some ideas start as hobbies but can grow into businesses. A hobby becomes a business when you want consistent income and treat it professionally \u2014 dedicating more time, building systems, and investing money. Deciding early helps you take the right steps and prevents burnout and confusion.`,
        why:`Treating a hobby like a business too late can slow your growth or lead to costly mistakes.`,
        example:`You\u2019ve been making handmade candles for friends \u2014 deciding to sell them online and manage orders professionally turns the hobby into a business.`,
        quote:`If you\u2019re not tracking the money, it\u2019s not a business yet.`,
        questions:[`Is this a hobby or a business for you \u2014 and what would make it a business?`] },
      { id:'rm4', part:1, stage:'Purpose & idea', title:'Your first customer', lead:`Defining who you\u2019re really building for.`,
        teach:`Identify the very first person you want to serve. Knowing your first customer helps you design, market, and sell effectively \u2014 it clarifies which problems to solve and how to communicate. Early customers give feedback that shapes your business, so start with one real person in mind rather than everyone.`,
        why:`Without a clear first customer, your marketing and product decisions feel scattered.`,
        example:`Your first customer is a busy mom who needs quick, healthy meals \u2014 so your product is designed specifically for her.`,
        quote:`If you\u2019re talking to everyone, no one is listening.`,
        questions:[`Who is the one real first customer you\u2019re building for?`] },

      { id:'rm5', part:1, stage:'Structure', title:'Drafting a business plan', lead:`What matters in a plan \u2014 and what doesn\u2019t.`,
        teach:`A business plan is a simple roadmap showing where your business is going. You don\u2019t need hundreds of pages \u2014 just the basics: what you sell, who your customer is, and how you\u2019ll make money. Writing it forces you to think through challenges and opportunities, and you can update it as you learn.`,
        why:`It keeps you focused, reduces guesswork, and gives clarity when making decisions.`,
        example:`You write a one-page plan outlining your target audience, pricing, and marketing ideas before launching a handmade jewelry business.`,
        quote:`You don\u2019t need a 40-page business plan. You need a clear one.`,
        questions:[`In a sentence or two \u2014 what do you sell, who is it for, and how do you make money?`] },
      { id:'rm6', part:1, stage:'Structure', title:'Choosing a business model', lead:`How your business will actually make money.`,
        teach:`Your business model explains how you\u2019ll earn \u2014 selling products, offering services, subscriptions, or online courses. Understanding it early helps you plan pricing, marketing, and operations, and the model should fit your skills and resources.`,
        why:`Without a clear business model, your income is unpredictable and your business struggles to grow.`,
        example:`You decide to sell handmade soaps online (product-based) rather than giving them away or only selling locally.`,
        quote:`If you don\u2019t know how you make money, you don\u2019t have a business.`,
        questions:[`How will your business actually make money?`] },
      { id:'rm7', part:1, stage:'Structure', title:'Pricing without panic', lead:`Charging enough to survive and grow.`,
        teach:`Pricing is how much you charge for your product or service. Beginners often price too low or too high out of fear. Start with your costs, your time, and the value you provide \u2014 then adjust as you learn more about the market. Pricing doesn\u2019t have to be perfect at first; it can evolve.`,
        why:`Correct pricing covers your costs, makes a profit, and attracts the right customers.`,
        example:`Materials cost $5, you add $10 for time and value, and charge $15 per item \u2014 covering costs and making a profit.`,
        quote:`Undercharging is not humble. It\u2019s harmful.`,
        questions:[`What will you charge, and how did you arrive at it (cost + time + value)?`] },
      { id:'rm8', part:1, stage:'Structure', title:'Naming your business', lead:`Branding, trademarks, and common mistakes.`,
        teach:`Your business name is how people remember and find you. It should reflect what you do and be easy to say and spell. Avoid copying others or using confusing words, and check trademarks and social media handles \u2014 a good name sets the tone for your branding.`,
        why:`A clear, available name makes you easy to find \u2014 a weak one can force a costly rebrand later.`,
        example:`Instead of \u201CSweet Treats,\u201D you name your bakery \u201CSunrise Bakes\u201D to stand out and secure the matching domain.`,
        quote:`Cute names don\u2019t build companies. Clear names do.`,
        questions:[`What name are you considering, and is the domain or handle available?`] },

      { id:'rm9', part:1, stage:'Legal & financial setup', title:'LLC, sole prop, or corp?', lead:`Choosing the right structure.`,
        teach:`When starting out, you choose a legal structure. A sole proprietorship is simplest but doesn\u2019t protect your personal assets. An LLC or corporation separates personal and business liability. Your choice affects taxes, paperwork, and how much risk you take on \u2014 picking the right one early sets you up for smoother growth.`,
        why:`The wrong structure can put your personal savings at risk or complicate your taxes.`,
        example:`You start a small consulting service and form an LLC to protect your personal bank account if something goes wrong.`,
        quote:`Protect your business like it already makes millions.`,
        questions:[`Which legal structure fits you right now, and why?`] },
      { id:'rm10', part:1, stage:'Legal & financial setup', title:'Licenses, permits & compliance', lead:`What you really need to operate.`,
        teach:`Most businesses need some license or permit to operate legally, and requirements vary by city, state, and industry. Following the rules keeps you out of fines or legal trouble. You don\u2019t need every license at once \u2014 start with what applies to you, and check compliance early.`,
        why:`Operating without required permits can mean fines or being forced to close.`,
        example:`You open a home bakery and get a local health permit to legally sell your products.`,
        quote:`Don\u2019t let paperwork shut down your dream.`,
        questions:[`What licenses or permits does your business actually need to start?`] },
      { id:'rm11', part:1, stage:'Legal & financial setup', title:'Business banking basics', lead:`Separating personal and business money.`,
        teach:`It\u2019s important to have a separate business bank account. Mixing personal and business funds makes taxes and accounting confusing. A separate account also looks more professional to customers and lenders, and helps you track income, expenses, and profit accurately.`,
        why:`Separating accounts prevents mistakes, protects your personal finances, and simplifies taxes.`,
        example:`You open a business checking account and deposit all client payments there instead of into your personal account.`,
        quote:`Mixing personal and business money is financial chaos.`,
        questions:[`What\u2019s your plan for separating business and personal money?`] },
      { id:'rm12', part:1, stage:'Legal & financial setup', title:'Taxes for new business owners', lead:`What new owners need to know about taxes.`,
        teach:`Taxes work differently for business owners than for employees. You may owe income tax, self-employment tax, and sales tax depending on your business. Setting money aside regularly prevents surprises at tax time, and keeping simple records makes filing far easier.`,
        why:`Not understanding taxes can lead to fines, late fees, or cash-flow problems.`,
        example:`You set aside 20% of every sale in a separate account to cover quarterly taxes and avoid last-minute stress.`,
        quote:`If you\u2019re not saving for taxes monthly, you\u2019re gambling.`,
        questions:[`How will you set money aside for taxes each month?`] },

      { id:'rm13', part:1, stage:'Funding & finance', title:'Bootstrapping vs borrowing', lead:`Funding without drowning in debt.`,
        teach:`Bootstrapping means starting with your own money or savings. Borrowing means getting money from loans, credit cards, or investors. Bootstrapping keeps you in control but may limit early growth; borrowing can help you grow faster but carries risk if you can\u2019t repay. Know the difference and choose what fits your situation.`,
        why:`The wrong funding method can put your personal finances or your business at risk.`,
        example:`You use $500 from savings to start a small soap business instead of taking a $5,000 loan \u2014 growing slowly but safely.`,
        quote:`Slow money is often smart money.`,
        questions:[`Will you bootstrap or borrow \u2014 and what\u2019s right for your situation?`] },
      { id:'rm14', part:1, stage:'Funding & finance', title:'Credit, loans & investors', lead:`What to know before you say yes.`,
        teach:`Many new owners are tempted by loans or investors. Each comes with rules, expectations, and sometimes high interest. Understand the details before agreeing \u2014 know how repayment works or what investors expect in return \u2014 so you can make the right decision for your business.`,
        why:`Signing agreements you don\u2019t understand can lead to debt or losing control of your business.`,
        example:`You consider a $2,000 loan, read the terms first, realize the interest is too high, and decide to bootstrap instead.`,
        quote:`Not all money is good money.`,
        questions:[`If you took outside money, what terms or expectations would come with it?`] },
      { id:'rm15', part:1, stage:'Funding & finance', title:'Cash flow reality check', lead:`Why profit isn\u2019t cash.`,
        teach:`Profit is what\u2019s left after expenses, but that doesn\u2019t mean it\u2019s in your bank account \u2014 some profit is tied up in inventory, bills, or unpaid invoices. Cash flow tracks the actual money you have available. Watching it prevents surprises like not being able to pay bills; even a profitable business can run into trouble without cash management.`,
        why:`Understanding cash flow keeps your business running and prevents financial emergencies.`,
        example:`You sold $1,000 in products, but $600 is still owed by clients \u2014 so your account only has $400 to spend.`,
        quote:`Profit on paper won\u2019t pay your rent.`,
        questions:[`What\u2019s the gap between your profit and the cash actually in your account?`] },
      { id:'rm16', part:1, stage:'Funding & finance', title:'Budgeting for uncertainty', lead:`Planning when income isn\u2019t steady.`,
        teach:`Most new businesses don\u2019t have steady income at first. A budget helps you plan for slow months and unexpected costs by prioritizing essentials like supplies, bills, and marketing. Tracking spending and setting limits keeps you from running out of money and reduces stress.`,
        why:`Without a budget, you overspend in good months and struggle in slower ones.`,
        example:`You budget $200 a month for supplies even when you earn $500 some months and $100 others, so you always stay afloat.`,
        quote:`Budgeting is not restriction. It\u2019s control.`,
        questions:[`What monthly budget keeps you afloat through the slow months?`] },

      { id:'rm17', part:1, stage:'Launch & early growth', title:'Your first launch', lead:`Soft launch, beta, or all-in?`,
        teach:`Your first launch is the moment your idea meets real people. A soft launch or beta lets you test with a small group first; going all-in offers it to everyone at once. Testing first helps you find problems and improve, and launching at the right scale gives you feedback without overwhelming yourself.`,
        why:`A careful launch reduces risk and shows what works before you invest too much.`,
        example:`You offer your new coaching service to 5 friends first, gather feedback, and adjust before opening it to the public.`,
        quote:`Your first launch is practice, not perfection.`,
        questions:[`Will you soft-launch, beta, or go all-in \u2014 and to whom first?`] },
      { id:'rm18', part:1, stage:'Launch & early growth', title:'Finding customers without a big budget', lead:`Sales before marketing.`,
        teach:`You don\u2019t need a big ad budget to get your first customers. Start by talking to your network, attending local events, or posting online for free. Personal connections often lead to first sales faster than ads, and selling early builds confidence and proves real demand.`,
        why:`Early sales validate your idea and help you grow without debt.`,
        example:`You share your handmade jewelry on Instagram and with friends \u2014 your first 10 sales come without spending a dime.`,
        quote:`Sales is conversation, not manipulation.`,
        questions:[`Where will your first 10 customers come from, for free?`] },
      { id:'rm19', part:1, stage:'Launch & early growth', title:'Mistakes that kill new businesses', lead:`Lessons from year one.`,
        teach:`New businesses often fail from common mistakes \u2014 overspending, poor pricing, or ignoring customers. Learning from them early saves time, money, and stress. Many are preventable with planning and advice, and every mistake is also a learning opportunity.`,
        why:`Avoiding common pitfalls increases your chance of surviving the critical first year.`,
        example:`You priced a product too low, lost money, then adjusted your pricing based on cost and market research.`,
        quote:`The first year isn\u2019t about profit. It\u2019s about survival.`,
        questions:[`Which first-year mistake are you most at risk of, and how will you avoid it?`] },
      { id:'rm20', part:1, stage:'Launch & early growth', title:'Knowing when to pivot', lead:`Adjusting without giving up.`,
        teach:`Sometimes your original idea doesn\u2019t work as planned. Pivoting means adjusting your product, service, or approach while keeping your vision. Listening to customers and watching results shows when a change is needed \u2014 pivoting isn\u2019t failing, it\u2019s adapting, and small changes early prevent bigger problems later.`,
        why:`Recognizing when to pivot saves money, builds better products, and keeps your business alive.`,
        example:`Your retail store isn\u2019t selling well, so you switch to an online store and sales improve.`,
        quote:`Pivoting isn\u2019t quitting. It\u2019s leveling up.`,
        questions:[`What signal would tell you it\u2019s time to pivot \u2014 without giving up your vision?`] },

      // ===== PART 2 — Validate your idea =====
      { id:'p1s1', part:2, title:'The idea overview', lead:'Turn a vague thought into a clear, communicable concept.',
        why:'A clear overview gives your business purpose and direction from the start. Without it you get confusion, lack of focus, and an inability to communicate or execute the idea.',
        questions:['What is the name of the business idea?','What product or service will you offer?','What industry does this business belong to?','What inspired the idea?','What makes the idea exciting to you?','What problem does this idea solve?','Why is this problem worth solving?','Who will benefit from this solution?'],
        exercise:'Describe your idea in one sentence.', example:'My business helps busy professionals receive healthy meal prep delivered weekly.' },
      { id:'p1s2', part:2, title:'The problem', lead:'Every successful business solves a real problem.',
        why:'Rooting your business in a real, meaningful need validates its relevance. Skip it and you build solutions for problems too minor, infrequent, or nonexistent — leading to low demand.',
        questions:['What specific problem are you solving?','Who experiences this problem the most?','How often does this problem occur?','What frustration does this problem create?','What emotional impact does the problem have?','What financial cost does the problem create?','What happens if the problem is not solved?','What situations trigger the problem?'],
        exercise:'Describe the problem in detail.' },
      { id:'p1s3', part:2, title:'The target customer', lead:'Understanding your customer is critical.',
        why:'A clear, detailed customer profile guides all marketing, product, and sales decisions. Too broad and unfocused means ineffective marketing and wasted resources.',
        questions:['Who is your ideal customer?','What age group are they?','What income level do they have?','What profession do they work in?','Where do they live?','What daily challenges do they face?','What motivates them to purchase solutions?','Where do they spend time online?','What brands do they currently trust?','What communities or groups do they belong to?'],
        exercise:'Create a customer persona — age, career, income, lifestyle, frustrations, and goals.' },
      { id:'p1s4', part:2, title:'Existing solutions', lead:'Understanding competitors helps validate demand.',
        why:'Analyzing competitors confirms a market already exists and reveals gaps you can fill. Without it you risk a saturated market with no edge, or an idea with no proven demand.',
        questions:['How is this problem currently solved?','What businesses already solve this problem?','What products exist today?','What do customers like about these solutions?','What complaints do customers have?','What price do customers currently pay?','What features are missing?','What opportunities exist for improvement?'],
        exercise:'Build a competitor list — for each one, note its strength, weakness, and price.' },
      { id:'p1s5', part:2, title:'Your unique solution', lead:'Now define what makes your idea different.',
        why:'Differentiation is your competitive advantage. Without it your business blends into the market, making it hard to attract attention, justify pricing, or convert customers.',
        questions:['What makes your solution unique?','What improvement does your product provide?','What result will customers experience?','Why would customers switch to your solution?','What emotional benefit does it provide?','What practical benefit does it provide?','What convenience does it create?','What problem does it eliminate?'],
        exercise:'Write your value proposition.', example:'Our service delivers healthy, ready-to-eat meals for busy professionals in under 24 hours.' },
      { id:'p1s6', part:2, title:'Market demand test', lead:'Before launching, test interest.',
        why:'Real feedback turns assumptions into evidence and reduces risk. Without it your business is built on guesses, raising the odds of launching something with no demand.',
        methods:['Online surveys','Customer interviews','Pre-orders','Landing pages','Social interest posts'],
        questions:['How many people expressed interest?','How many people would pay for this solution?','What feedback did customers give?','What objections did customers have?','What features did customers request?'],
        exercise:'Collect at least 10–20 real customer responses, then summarize what you learned.' },
      { id:'p1s7', part:2, title:'Pricing validation', lead:'Your idea must generate revenue.',
        why:'Validating price keeps the model viable and aligned with what customers expect. Underprice and you lose profit; overprice and you lose customers.',
        questions:['What price will customers pay?','What do competitors charge?','What price feels reasonable to customers?','What price feels premium?','What price would customers consider too expensive?','What discounts might attract customers?','Would customers pay monthly or one-time?'],
        exercise:'Test two or three price points with potential customers and record their reactions.' },
      { id:'p1s8', part:2, title:'Cost structure', lead:'Understand the costs of running the business.',
        why:'Knowing your costs lets you plan, budget, and stay profitable. Overlook them and unexpected expenses can overwhelm the business before it grows.',
        questions:['What are your startup costs?','What equipment is required?','What software is needed?','What licenses or permits are required?','What marketing costs exist?','What operational costs exist?','What employee costs exist?','What overhead costs exist?'],
        exercise:'Create a startup cost list with a rough number next to each line.' },
      { id:'p1s9', part:2, title:'Revenue potential', lead:'Calculate the business opportunity.',
        why:'Estimating revenue shows whether the idea is financially worth pursuing and scalable. Skip it and you may invest in a concept that can\u2019t generate enough income to survive.',
        questions:['How many customers exist in the market?','How many customers can you realistically reach?','How often will customers buy?','What is the average sale price?','What monthly revenue could be generated?','What yearly revenue could be generated?','What profit margins exist?'],
        exercise:'Estimate your monthly revenue potential: reachable customers × purchase frequency × average sale.' },
      { id:'p1s10', part:2, title:'Market risks', lead:'Identify potential challenges.',
        why:'Spotting threats early lets you prepare strategies to mitigate them. Without this, the business is vulnerable to disruptions that can derail progress or cause loss.',
        questions:['What risks could harm the business?','What competitors could enter the market?','What legal regulations exist?','What economic conditions could affect demand?','What operational challenges exist?'],
        exercise:'Create a risk assessment list — and a first response for the top three.' },
      { id:'p1s11', part:2, title:'Minimum viable product (MVP)', lead:'Instead of building everything, start small.',
        why:'The simplest version that solves the core problem accelerates learning and reduces risk. Skip it and you over-invest in unproven concepts, delaying feedback.',
        questions:['What is the simplest version of the product?','What core feature solves the problem?','What features can wait until later?','How quickly can the MVP be built?','What resources are needed?'],
        exercise:'Define the first version of your product — just enough to solve the core problem.' },
      { id:'p1s12', part:2, title:'Go-or-no-go decision', lead:'After validation, decide whether to proceed.',
        why:'Reviewing all your evidence keeps the decision objective rather than emotional, so resources are invested wisely. Without it you may keep pursuing an idea that isn\u2019t viable.',
        questions:['Did customers confirm the problem exists?','Did customers express interest in the solution?','Would customers pay for the product?','Is the market large enough?','Are startup costs manageable?','Can the business become profitable?','Are you committed to building it?'],
        isDecision:true },

      // ===== PART 3 — Plan your business =====
      { id:'p2s1', part:3, title:'Mission & purpose', lead:'Your mission gives your business meaning beyond money.',
        why:'A clear purpose guides daily decisions, attracts the right customers and team, and builds trust. Without it your business can lose direction.',
        mistakes:'Many make a mission too vague or money-focused, never revisit it, or fail to align daily actions with it.',
        questions:['Why does this business exist?','What problem am I solving?','Who specifically am I solving this problem for?','What change do I want my business to create in people\u2019s lives?','What values will guide every decision in this business?','What impact do I want this company to have in 5, 10, and 20 years?','What makes this mission meaningful to me personally?','What principles will I never compromise on?'] },
      { id:'p2s2', part:3, title:'Vision & long-term direction', lead:'Think bigger than today and plan for tomorrow.',
        why:'A strong vision sets your path, guides strategic decisions, and keeps you focused through challenges. Without it, growth feels scattered and unclear.',
        mistakes:'Thinking too short-term, never clearly defining where you want to go, or chasing quick wins over long-term goals.',
        questions:['What do I want this company to become?','How big do I want this business to grow?','What will success look like in 3 years?','What will success look like in 10 years?','What industries or markets might this business expand into later?','Will this remain a small lifestyle business or become a scalable company?','Do I want to sell this business someday or keep it long term?','What legacy do I want this business to leave?'] },
      { id:'p2s3', part:3, title:'Business idea validation', lead:'Strong ideas are built, not guessed.',
        why:'Validation confirms your idea solves a real problem and reduces risk before you invest time or money. Without it, you may build something no one wants.',
        mistakes:'Skipping testing, relying only on opinions from friends and family, or ignoring negative feedback.',
        questions:['What problem does my product or service solve?','Is this a real problem people already pay to fix?','Who is currently solving this problem?','How is my solution different or better?','How urgent is the customer\u2019s need?','How often will customers need this product or service?','Is this idea a hobby or a viable business?','Who will be my first paying customer?'] },
      { id:'p2s4', part:3, title:'Target customer', lead:'Your customer is the heart of your business.',
        why:'Knowing your customer lets you tailor messaging and offers, improving marketing, sales, and loyalty. Without it, your efforts feel unfocused.',
        mistakes:'Trying to serve everyone, basing decisions on assumptions instead of data, or failing to adjust as your audience changes.',
        questions:['Who is my ideal customer?','What age group are they?','What income level do they have?','Where do they live?','What problems frustrate them daily?','What solutions are they currently using?','Where do they spend time online?','What motivates them to buy?','What objections might they have?'] },
      { id:'p2s5', part:3, title:'Branding', lead:'Your brand is how people feel when they experience your business.',
        why:'Branding builds recognition, trust, and emotional connection, and helps you stand out in a crowded market. Without it, your business feels forgettable.',
        mistakes:'Inconsistent messaging, copying others instead of being authentic, or underestimating visual identity.',
        questions:['What emotions should people feel when they see my brand?','What personality will my brand have?','What is the brand story?','What colors represent my brand?','What fonts and visual identity will I use?','What tone of voice will the brand communicate with?','How do I want customers to describe my business?','What makes the brand memorable?'] },
      { id:'p2s6', part:3, title:'Business name & identity', lead:'Choose a name that reflects your purpose and vision.',
        why:'Your name is often the first impression and signals your values. A strong identity makes your brand memorable and credible. Without it, your business lacks clarity.',
        mistakes:'Confusing or hard-to-spell names, names that don\u2019t reflect the business, or skipping availability and trademark checks.',
        questions:['Is the business name easy to remember?','Is the name easy to spell and pronounce?','Is the website domain available?','Are social media handles available?','Does the name communicate what the business does?','Can the name grow with the business?'] },
      { id:'p2s7', part:3, title:'Media kit & public presence', lead:'Tell your story boldly.',
        why:'A media kit helps others understand your brand quickly and opens doors to partnerships. A strong presence builds credibility. Without it, you miss valuable exposure.',
        mistakes:'Having no media kit, providing outdated or incomplete information, or being inconsistent across platforms.',
        questions:['What is my founder story?','What is my elevator pitch?','What makes this business newsworthy?','What problem does my company help solve for society?','What media outlets would cover my story?','Do I have professional photos?','What statistics or credibility can I show?','Do I have testimonials or case studies?'] },
      { id:'p2s8', part:3, title:'Marketing strategy', lead:'Your message deserves to be heard.',
        why:'A marketing strategy gives direction, keeps messaging consistent, and reaches the right audience efficiently. Without it, your efforts may produce no results.',
        mistakes:'Posting without a plan, trying every platform at once, not tracking results, or giving up too quickly.',
        questions:['How will people discover my business?','Which marketing channels will I focus on first?','Will I use social media, ads, SEO, email, or partnerships?','What content will I create regularly?','How will I build trust with potential customers?','What is my marketing budget?','What is my customer acquisition strategy?','What message will attract customers?'] },
      { id:'p2s9', part:3, title:'Sales strategy', lead:'Sales is about helping, not convincing.',
        why:'A sales strategy converts interest into revenue and gives structure to customer interactions. Without it, opportunities are lost.',
        mistakes:'Avoiding sales conversations, relying only on marketing to close, lacking a process, or focusing on selling over helping.',
        questions:['How will I convert interest into paying customers?','What is my sales process?','What objections might customers have?','What makes my offer irresistible?','What pricing strategy will I use?','What guarantees or assurances will I offer?','How will I follow up with potential buyers?','What will my average sale be worth?'] },
      { id:'p2s10', part:3, title:'Product or service development', lead:'Build something you\u2019re proud of.',
        why:'Development ensures your offer meets customer needs and stays competitive over time. Without it, your offerings become outdated.',
        mistakes:'Launching without proper testing, ignoring customer feedback, overcomplicating the offer, or never improving it.',
        questions:['What exactly am I selling?','What makes my product or service unique?','How will I test my product before launching?','How will I improve the product over time?','What will customers experience when using my product?'] },
      { id:'p2s11', part:3, title:'Operations', lead:'Structure is your foundation.',
        why:'Operations keep the business running smoothly, improving efficiency and consistency while reducing errors. Without them, things get disorganized fast.',
        mistakes:'Having no systems or documentation, relying on memory, or waiting too long to organize operations.',
        questions:['What systems will run the business?','What tools or software will I need?','What daily tasks must be completed?','What processes can be automated?','How will I track performance and productivity?'] },
      { id:'p2s12', part:3, title:'Financial planning', lead:'Every dollar has a purpose.',
        why:'Financial planning helps you manage and grow money wisely, understand income and expenses, and reduce surprises. Without it, the business can struggle to survive.',
        mistakes:'Not tracking expenses, mixing personal and business finances, underestimating costs, or not planning for taxes.',
        questions:['How much money do I need to start?','What are my startup costs?','What are my monthly operating costs?','What is my expected revenue in year one?','How long can I operate before needing profit?','What is my break-even point?','What financial risks exist?'] },
      { id:'p2s13', part:3, title:'Funding', lead:'Funding is a tool, not a solution.',
        why:'Funding provides the resources to grow and scale faster when used wisely, supporting stability and expansion. Without it, growth may be limited.',
        mistakes:'Relying too heavily on loans without a plan, seeking funding too early, or misusing funds once received.',
        questions:['Will I self-fund the business?','Do I need investors?','Do I need a business loan?','How much equity am I willing to give up?','What is the return for investors?','What funding stage am I currently in?'] },
      { id:'p2s14', part:3, title:'Legal structure', lead:'Do it right, not rushed.',
        why:'Your legal structure affects taxes, liability, and operations, and creates a solid foundation for growth. Without it, you may face legal and financial risks.',
        mistakes:'Choosing the wrong structure, delaying setup, ignoring legal requirements, or skipping professional advice.',
        questions:['Will I operate as a sole proprietor, LLC, or corporation?','What licenses do I need?','What permits are required?','What contracts will I need?','How will I protect intellectual property?'] },
      { id:'p2s15', part:3, title:'Location & infrastructure', lead:'Build where you thrive.',
        why:'The right environment supports productivity, growth, and customer experience, and gives you the tools to succeed. Without it, the business struggles to function.',
        mistakes:'Choosing a location on cost alone, not planning for growth, or overlooking accessibility and proper tools.',
        questions:['Will this business operate online, physical, or hybrid?','Do I need office or retail space?','Is the location accessible to customers?','What equipment is required?','What utilities or logistics must be considered?'] },
      { id:'p2s16', part:3, title:'Hiring & HR', lead:'Hire for mindset, not just skill.',
        why:'The right team supports your vision and growth, and HR processes create structure and fairness. Without it, growth can become overwhelming.',
        mistakes:'Hiring too quickly or too late, focusing only on skills over culture fit, or lacking clear roles and expectations.',
        questions:['When will I hire my first employee?','What roles are essential early on?','What skills will I look for in employees?','How will I train staff?','What company culture do I want to build?','How will I motivate and retain employees?'] },
      { id:'p2s17', part:3, title:'Customer experience', lead:'Your service is your signature.',
        why:'Customer experience drives repeat business, loyalty, and word-of-mouth referrals. Without it, customers may not return.',
        mistakes:'Ignoring customer feedback, focusing only on new customers, inconsistent service, or no follow-up.',
        questions:['What will the first customer interaction look like?','What will the onboarding process be?','How will I handle complaints?','How will I collect customer feedback?','How will I build long-term customer loyalty?'] },
      { id:'p2s18', part:3, title:'Technology & tools', lead:'Smart tools create smart systems.',
        why:'The right technology increases efficiency and productivity, supports communication, and keeps you competitive. Without it, you may fall behind.',
        mistakes:'Using too many tools without strategy, avoiding technology, or never training and optimizing the tools you use.',
        questions:['What software will run my business?','What CRM will track customers?','What accounting software will I use?','What marketing tools will I use?','What cybersecurity protections do I need?'] },
      { id:'p2s19', part:3, title:'Growth & scaling', lead:'Think bigger as you grow.',
        why:'Growth planning prepares you for increased demand and lets you scale revenue strategically while your systems keep up. Without it, rapid growth creates problems.',
        mistakes:'Scaling too fast without systems, not preparing for demand, ignoring data, or expanding without a clear strategy.',
        questions:['How will the business grow?','What systems must be built before scaling?','Can the business operate without me?','What partnerships could accelerate growth?','What new markets could be entered?'] },
      { id:'p2s20', part:3, title:'Risk management', lead:'Strength comes from resilience.',
        why:'Risk management prepares you for challenges, reduces potential losses, and lets you respond quickly. Without it, unexpected problems cause major setbacks.',
        mistakes:'Ignoring risks until problems arise, having no backup plans, or never reviewing risks regularly.',
        questions:['What could cause this business to fail?','What economic changes could impact the business?','What legal risks exist?','What competition risks exist?','What backup plans exist?'] },
      { id:'p2s21', part:3, title:'Exit strategy', lead:'Build your business with the end in mind.',
        why:'An exit strategy ensures long-term, transferable value and gives you more control over future transitions. Without it, you may miss opportunities later.',
        mistakes:'Not planning an exit, assuming you\u2019ll figure it out later, or not building transferable systems and value.',
        questions:['Do I want to sell the business eventually?','Could this business be franchised?','Could it be acquired by a larger company?','Would I pass the business to family?'] },
      { id:'p2s22', part:3, title:'Personal founder questions', lead:'You are your greatest asset.',
        why:'Self-awareness improves your leadership, shapes better decisions, and keeps you aligned with your goals. Without it, you may lose clarity and direction.',
        mistakes:'Lacking self-awareness, ignoring your strengths and weaknesses, or avoiding personal growth.',
        questions:['Why am I the right person to build this?','What skills do I need to learn?','What sacrifices will I have to make?','How will I stay motivated during hard times?','What does success mean personally?'] },

      // ===== PART 4 — Business foundation framework =====
      { id:'bf1', part:4, isPledge:true, questions:[], title:'Legal setup', lead:`Formally establish and protect your business.`,
        teach:`Legal setup is how your business is officially formed and recognized in the eyes of the law. It separates your personal and business liability \u2014 protecting your personal assets, enabling proper taxation, and unlocking the ability to hire, open accounts, and pursue funding.`,
        includes:[`Business structure (LLC, sole proprietor, corporation)`,`Business registration`,`Licenses & permits`,`EIN (tax ID)`,`Operating agreements`],
        whyItems:[`Protects your personal assets`,`Makes your business legally recognized`,`Lets you open accounts, hire, and pay taxes properly`],
        overlook:[`You can be personally sued`,`IRS penalties or tax issues`,`Can\u2019t scale or get funding properly`],
        example:`A flower shop operating without an LLC gets sued for a customer injury in-store \u2014 the owner\u2019s personal savings and home are at risk.`,
        pledge:`I pledge not to overlook my legal setup \u2014 I\u2019ll form and protect my business properly before I grow.` },
      { id:'bf2', part:4, isPledge:true, questions:[], title:'Business plan', lead:`Your strategic blueprint and direction.`,
        teach:`A business plan turns your idea into a structured path forward. It defines why the business exists, where it\u2019s going, what it offers, and how it makes money \u2014 keeping you intentional instead of reactive.`,
        includes:[`Mission \u2014 why the business exists`,`Vision \u2014 your long-term goal`,`Products & services offered`,`Target audience`,`Revenue streams (how money is made)`,`Growth plan (expansion strategy)`],
        whyItems:[`Gives direction and clarity`,`Helps attract investors or partners`,`Prevents random decision-making`],
        overlook:[`You become reactive instead of strategic`,`Money is wasted on the wrong products or marketing`,`No clear direction for growth`],
        example:`Without a plan, the shop sells flowers, candles, balloons, and plants with no idea who the customer is or what\u2019s most profitable \u2014 income is inconsistent and the brand is confused.`,
        pledge:`I pledge not to overlook my business plan \u2014 I\u2019ll write it down and let it guide my decisions.` },
      { id:'bf3', part:4, isPledge:true, questions:[], title:'Contracts & legal protection', lead:`Put every important relationship in writing.`,
        teach:`Contracts formalize the relationships and expectations between your business and everyone it works with \u2014 vendors, employees, clients, and partners. Clear terms reduce ambiguity, keep everyone accountable, and prevent disputes.`,
        includes:[`Vendor & supplier agreements`,`Employee contracts`,`Independent contractor agreements`,`Lease agreements (store location)`,`Service agreements (events, weddings, subscriptions)`,`Non-disclosure agreements (NDAs)`],
        whyItems:[`Protects business relationships`,`Defines expectations clearly`,`Prevents disputes and lawsuits`],
        overlook:[`Vendors can raise prices without notice`,`Employees may create legal issues`,`No protection during disputes`],
        example:`A wedding florist agrees verbally to supply an event; the client cancels last-minute \u2014 no contract means lost revenue and no compensation.`,
        pledge:`I pledge not to overlook my contracts \u2014 I\u2019ll put every important agreement in writing.` },
      { id:'bf4', part:4, isPledge:true, questions:[], title:'Financial system', lead:`Track and manage every dollar in and out.`,
        teach:`Your financial system tracks, organizes, and manages all the money flowing in and out of the business. It gives you a clear picture of profitability and keeps you compliant \u2014 so you can make informed decisions instead of guessing.`,
        includes:[`Business bank accounts`,`Accounting system`,`Budget planning`,`Sales tracking`,`Expense tracking`,`Taxes (income, payroll, sales tax)`],
        whyItems:[`Tracks profitability`,`Keeps you compliant with the IRS`,`Helps control spending and growth decisions`],
        overlook:[`You look profitable but are actually losing money`,`Tax penalties or audits`,`Cash-flow crises`],
        example:`The shop is slammed on Valentine\u2019s Day but never tracks the cost of flowers, delivery, and labor \u2014 then realizes it made almost no profit despite high sales.`,
        pledge:`I pledge not to overlook my financial system \u2014 I\u2019ll track every dollar and stay tax-compliant.` },
      { id:'bf5', part:4, isPledge:true, questions:[], title:'Operations cost & daily operations', lead:`What it takes to run, day to day.`,
        teach:`Daily operations cover the ongoing activities and expenses that keep the business functioning \u2014 rent, payroll, technology, insurance, and maintenance. Managing them keeps you stable and efficient and stops hidden costs from eroding profit.`,
        includes:[`Accounting & banking fees`,`Insurance`,`Office or store rent`,`Technology (POS systems, software)`,`Payroll, benefits & training`,`Maintenance, cleaning & repairs`,`Waste disposal`],
        whyItems:[`Keeps the business running daily`,`Prevents unexpected shutdowns`,`Controls overhead costs`],
        overlook:[`Hidden costs destroy profit margins`,`Equipment breaks and stops operations`,`Staff are untrained or underpaid`],
        example:`The flower refrigeration breaks and maintenance was never budgeted \u2014 flowers spoil, causing inventory loss and lost sales.`,
        pledge:`I pledge not to overlook daily operations \u2014 I\u2019ll budget for the costs that keep me running.` },
      { id:'bf6', part:4, isPledge:true, questions:[], title:'Inventory & product management', lead:`Control what you sell and what it costs.`,
        teach:`Inventory and product management is how you control the goods and materials you offer \u2014 sourcing, tracking, costing, and keeping the right stock levels. Done well, it balances supply with demand, cuts waste, and protects your margins.`,
        includes:[`Raw materials (flowers, vases, wrapping)`,`Cost of goods sold (COGS)`,`Product list`,`Vendor relationships`,`Stock tracking`],
        whyItems:[`Ensures you always have product to sell`,`Controls profit margins`,`Reduces waste`],
        overlook:[`Overstock and waste`,`Stockouts and lost sales`,`No idea what\u2019s actually profitable`],
        example:`The shop buys too many roses without tracking demand \u2014 half the inventory dies before sale, a direct financial loss.`,
        pledge:`I pledge not to overlook inventory \u2014 I\u2019ll track stock and know what\u2019s truly profitable.` },
      { id:'bf7', part:4, isPledge:true, questions:[], title:'Logistics & operations support', lead:`Get the product to the customer, on time.`,
        teach:`Logistics manages the movement, coordination, and delivery of your products or services so everything reaches the customer efficiently. Even a great product can fail from delays, damage, or poor execution \u2014 strong logistics protect your reputation.`,
        includes:[`Shipping & delivery`,`Travel (event setups, weddings)`,`Vendor coordination`,`Storage & handling`],
        whyItems:[`Ensures timely delivery of products and services`,`Maintains customer satisfaction`,`Supports scaling`],
        overlook:[`Late deliveries`,`Damaged products`,`Poor customer experience`],
        example:`Wedding flowers arrive late because delivery routes weren\u2019t planned \u2014 the bride is unhappy, leading to bad reviews and reputation loss.`,
        pledge:`I pledge not to overlook logistics \u2014 I\u2019ll plan delivery so customers get what they need, on time.` },
      { id:'bf8', part:4, isPledge:true, questions:[], title:'Marketing system', lead:`Attract, engage, and convert customers.`,
        teach:`Your marketing system is how you attract, engage, and convert customers through branding, messaging, and promotion. It defines how the business presents itself and communicates its value \u2014 without it, even great products go unnoticed.`,
        includes:[`Branding (identity, logo, messaging)`,`Social media presence`,`Market research`,`Marketing strategy`,`Campaigns (seasonal promotions, ads)`],
        whyItems:[`Brings customers into the business`,`Builds brand recognition`,`Drives consistent revenue`],
        overlook:[`No customers despite a good product`,`Weak brand identity`,`Inconsistent sales`],
        example:`The shop has beautiful arrangements but no Instagram or local marketing \u2014 competitors dominate online searches and walk-in traffic stays low.`,
        pledge:`I pledge not to overlook marketing \u2014 I\u2019ll make sure the right people can find me.` },
      { id:'bf9', part:4, isPledge:true, questions:[], title:'Strategic marketing & growth campaigns', lead:`Planned campaigns that drive growth.`,
        teach:`Growth campaigns build on your marketing system with intentional, time-based initiatives \u2014 launches, seasonal promotions, loyalty programs, and referrals \u2014 that drive revenue spikes and turn one-time buyers into repeat customers.`,
        includes:[`Launch campaigns (grand opening)`,`Seasonal campaigns (Valentine\u2019s Day, Mother\u2019s Day)`,`Loyalty programs`,`Referral systems`],
        whyItems:[`Creates predictable revenue spikes`,`Builds customer retention`,`Expands your market reach`],
        overlook:[`You depend only on random walk-ins`,`No repeat customers`,`Missed peak-season revenue`],
        example:`With no Mother\u2019s Day campaign, a competitor captures the holiday demand \u2014 the shop misses its biggest revenue opportunity of the year.`,
        pledge:`I pledge not to overlook growth campaigns \u2014 I\u2019ll plan for my biggest revenue moments.` },
      { id:'bf10', part:4, isPledge:true, questions:[], title:'Education & professional services', lead:`Keep learning and bring in expert support.`,
        teach:`Education and professional services keep you and your team growing through training, industry insight, and experts like accountants, lawyers, and consultants. This strengthens your decisions and keeps you compliant and competitive.`,
        includes:[`Training (employees & leadership)`,`Industry education`,`Professional services (accounting, legal, consultants)`],
        whyItems:[`Improves efficiency and decision-making`,`Keeps you compliant and competitive`,`Reduces costly mistakes`],
        overlook:[`Employees make avoidable mistakes`,`You operate blindly`,`Inefficient systems never improve`],
        example:`Without ongoing training or an accountant, a new florist mishandles orders and misses tax deductions \u2014 small, avoidable mistakes quietly add up.`,
        pledge:`I pledge not to overlook learning \u2014 I\u2019ll keep growing and bring in expert help when I need it.` },

      // ===== PART 5 — Business planning & growth worksheet =====
      {"id":"gp1","part":5,"title":"Mission & Purpose","lead":"Your mission defines what your business does, who it serves, and why it exists. It is the foundation for decisions and strategy.","learn":[{"title":"How to write a clear mission statement","body":"A mission statement should clearly explain what you do, who you serve, and why it matters. It should be simple, specific, and easy to remember. Avoid vague or overly broad language. This becomes your foundation for decision-making."},{"title":"Aligning mission with daily operations","body":"Your daily actions should reflect your mission. This means your services, customer interactions, and processes all support your purpose. If they don’t align, your business feels disconnected. Alignment builds trust and consistency."},{"title":"Measuring impact vs. income","body":"Success isn’t just about money—it’s also about the value you create. Track how you’re helping your customers. This can include results, testimonials, or outcomes. Balancing impact and income creates a meaningful business."},{"title":"Evolving your mission over time","body":"As your business grows, your mission may need to evolve. Your audience, services, and goals can change. Revisit your mission regularly to keep it relevant. Growth should be reflected in your purpose."},{"title":"Communicating your mission to your audience","body":"Your audience should clearly understand what you stand for. Share your mission through your content, website, and messaging. Consistent communication builds connection. People support businesses they believe in."}],"questions":["What is your core purpose?","Who do you serve?","How does your business create impact?","How will you align your daily operations with your mission?","How will you communicate your mission to customers and partners?"]},
      {"id":"gp2","part":5,"title":"Vision & Long-Term Direction","lead":"A clear vision gives your business direction and inspires growth. It ensures your decisions align with your long-term goals.","learn":[{"title":"Creating 1-year, 3-year, and 5-year plans","body":"Break your big vision into smaller timeframes. This makes your goals more manageable and realistic. Each stage should build toward the bigger picture. It keeps you focused and organized."},{"title":"Reverse engineering your goals","body":"Start with your end goal, then work backward. Identify the steps needed to get there. This creates a clear action plan. It removes guesswork and builds clarity."},{"title":"Vision boards vs. strategic planning","body":"Vision boards help you visualize your goals. Strategic planning turns those ideas into action steps. Both are important but serve different purposes. You need inspiration and execution."},{"title":"Staying adaptable while focused","body":"Your vision should guide you, but you must stay flexible. Markets change and opportunities arise. Adapt without losing your core direction. Balance structure with flexibility."},{"title":"Decision-making based on long-term vision","body":"Every decision should support your future goals. This helps you avoid distractions. It keeps you aligned and intentional. Your vision becomes your filter."}],"questions":["Where do you want your business in 1 year? 3 years? 5 years?","What steps are required to reach that vision?","How can you remain adaptable while staying focused on your goals?","What decisions will you make differently based on your vision?","How will you track progress toward your long-term direction?"]},
      {"id":"gp3","part":5,"title":"Business Idea Validation","lead":"Validating your idea ensures there is real demand and reduces risk before investing heavily.","learn":[{"title":"Minimum viable product (MVP) strategy","body":"An MVP is a simple version of your product or service. It allows you to test your idea quickly. You don’t need perfection to start. The goal is learning, not perfection."},{"title":"Pre-selling before building","body":"Sell your idea before fully creating it. This proves demand and reduces risk. If people are willing to pay, your idea has value. It also helps fund development."},{"title":"Survey and interview techniques","body":"Ask your audience direct questions about their needs. Use surveys or one-on-one conversations. This gives real insights instead of assumptions. Listening is key."},{"title":"Competitor research methods","body":"Study others in your space. Look at what they do well and where they fall short. This helps you position yourself differently. Competition provides valuable information."},{"title":"Pricing validation","body":"Test different price points to see what people will pay. Pricing too low or too high can hurt your business. Feedback helps you find the right balance. Value should match price."}],"questions":["What is your minimum viable product (MVP)?","How will you pre-sell or test your idea?","What questions will you ask potential customers to get feedback?","Who are your competitors, and what can you learn from them?","How will you determine the right price for your product or service?"]},
      {"id":"gp4","part":5,"title":"Target Customer","lead":"Knowing your audience ensures you create products and marketing that truly meet their needs.","learn":[{"title":"Creating customer avatars/personas","body":"A customer avatar is a detailed profile of your ideal client. Include demographics, goals, and challenges. This helps you understand who you’re serving. Clarity improves communication."},{"title":"Understanding customer pain points","body":"Identify the problems your audience faces. Your business should solve these problems. The better you understand their struggles, the stronger your offer. Pain points drive buying decisions."},{"title":"Buying behavior and habits","body":"Learn how your customers make decisions. Do they research first or buy quickly? Where do they spend time online? Understanding behavior improves marketing."},{"title":"Customer journey mapping","body":"Map out the steps a customer takes from discovery to purchase. This helps you improve each stage. A smooth journey increases conversions. It enhances the experience."},{"title":"Niche vs. broad audience strategy","body":"Choosing a niche helps you stand out. A broad audience gives more reach but less focus. Starting niche often leads to stronger results. You can expand later."}],"questions":["What problems or pain points do they have?","What motivates them to buy?","How do they interact with businesses like yours?","Are you targeting a niche or broad audience, and why?","Who is my ideal customer?"]},
      {"id":"gp5","part":5,"title":"Branding","lead":"Branding creates recognition, trust, and emotional connection with your audience.","learn":[{"title":"Brand voice and tone","body":"This is how your brand sounds when it communicates. It can be professional, friendly, bold, or inspirational. Consistency builds recognition. Your voice should match your audience."},{"title":"Emotional vs. visual branding","body":"Visual branding includes logos and colors. Emotional branding is how people feel about your brand. Both work together to create a strong identity. Emotion builds loyalty."},{"title":"Brand consistency across platforms","body":"Your brand should look and feel the same everywhere. This includes social media, website, and emails. Consistency builds trust. It makes your business recognizable."},{"title":"Storytelling in branding","body":"Sharing your story creates connection. People relate to experiences and journeys. Storytelling makes your brand more human. It builds deeper relationships."},{"title":"Personal brand vs. business brand","body":"A personal brand focuses on you as the face. A business brand focuses on the company. Both have benefits. Choose based on your goals and scalability."}],"questions":["What is your brand voice and tone?","How will you connect emotionally with your audience?","How will you ensure consistency across platforms?","What story does your brand tell?","Is your personal brand separate or integrated with your business brand?"]},
      {"id":"gp6","part":5,"title":"Business Name & Identity","lead":"Your name and visual identity make a first impression and help customers remember you.","learn":[{"title":"Domain and social handle availability","body":"Before finalizing your name, check if the website domain and social media handles are available. Consistency across platforms makes your business easier to find. It also prevents confusion with other brands. Securing your name early protects your identity."},{"title":"Trademark basics","body":"A trademark protects your business name and brand legally. It prevents others from using a similar name in your industry. This is especially important as you grow. Protecting your brand early avoids future legal issues."},{"title":"Tagline creation","body":"A tagline is a short phrase that explains what you do or what you stand for. It should be clear, memorable, and aligned with your mission. A strong tagline strengthens your brand message. It helps people quickly understand your value."},{"title":"Logo and color psychology","body":"Your logo and colors influence how people feel about your brand. Different colors create different emotions and perceptions. A well-designed logo builds professionalism and trust. Visual identity plays a major role in first impressions."},{"title":"Rebranding strategies","body":"Sometimes your brand needs to evolve as your business grows. Rebranding helps you stay relevant and aligned with your vision. It should be done strategically, not impulsively. A strong rebrand can refresh your entire business image."}],"questions":["Is your desired domain and social handle available?","Do you need to consider trademark protection?","What tagline reflects your business purpose?","How will your logo and colors reflect your brand values?","If needed, how would you approach rebranding in the future?"]},
      {"id":"gp7","part":5,"title":"Media Kit & Public Presence","lead":"A professional media kit and public presence build credibility and opportunities for collaboration.","learn":[{"title":"What to include in a media kit","body":"A media kit should include your bio, services, audience, and contact information. It gives a quick overview of your brand. This makes it easier for others to collaborate with you. It positions you as professional and prepared."},{"title":"Speaker/press bio writing","body":"Your bio tells your story and highlights your expertise. It should be clear, engaging, and relevant to your audience. A strong bio builds credibility. It helps others understand your value quickly."},{"title":"Building authority online","body":"Authority comes from consistently sharing valuable content. This includes social media, blogs, or videos. The more you educate and help, the more trust you build. Authority attracts opportunities."},{"title":"Press outreach strategies","body":"Reaching out to media outlets can increase your visibility. You can pitch your story, expertise, or business. This helps you reach new audiences. Strategic outreach can lead to major exposure."},{"title":"Podcast and collaboration pitching","body":"Being featured on podcasts or collaborations expands your reach. You can share your story and expertise with new audiences. It builds credibility and connections. Partnerships can accelerate growth."}],"questions":["What will your media kit include?","How will you write a compelling speaker/press bio?","How will you build authority online?","What press outreach strategies will you implement?","Which podcasts or collaborations will you pitch? What is my founder story?"]},
      {"id":"gp8","part":5,"title":"Marketing Strategy","lead":"Marketing connects your business to your audience and drives sales.","learn":[{"title":"Organic vs. paid marketing","body":"Organic marketing uses free methods like social media and content. Paid marketing involves ads and promotions. Both have benefits depending on your goals. A balanced approach can maximize results."},{"title":"Content marketing strategy","body":"This involves creating valuable content to attract your audience. It can include videos, posts, blogs, or emails. Consistency is key. Good content builds trust and engagement."},{"title":"Social media platforms breakdown","body":"Each platform serves a different purpose and audience. Understanding where your audience spends time is important. Focus on platforms that align with your business. This improves effectiveness."},{"title":"Email marketing basics","body":"Email allows direct communication with your audience. You can nurture relationships and promote offers. Building an email list is a valuable asset. It gives you control over your audience."},{"title":"Analytics and performance tracking","body":"Tracking results helps you understand what works. Use data to improve your strategy. This prevents wasted time and effort. Data-driven decisions lead to better outcomes."}],"questions":["Will you focus on organic, paid, or a mix of marketing?","What type of content will you create to attract your audience?","Which social media platforms will you focus on and why?","How will you use email marketing to nurture leads?","What metrics will you track to measure success?"]},
      {"id":"gp9","part":5,"title":"Sales Strategy","lead":"A structured sales strategy improves conversions and revenue.","learn":[{"title":"Sales funnels and pipelines","body":"A sales funnel guides customers from awareness to purchase. It creates a structured process. This improves conversions. Clear steps make selling more predictable."},{"title":"Closing techniques","body":"Closing is the final step of a sale. It involves guiding the customer to make a decision. Confidence and clarity are key. Strong closing increases revenue."},{"title":"Handling objections","body":"Customers may have concerns before buying. Addressing objections builds trust. Listen and provide solutions. This can turn hesitation into sales."},{"title":"Follow-up systems","body":"Not all customers buy immediately. Following up keeps you top of mind. Consistent follow-up increases conversions. Many sales happen after multiple touches."},{"title":"Pricing psychology","body":"How you price your product affects perception. Pricing too low may reduce value. Pricing strategically builds confidence. Perception plays a big role in buying decisions."}],"questions":["What does your sales funnel or pipeline look like?","What techniques will you use to close sales?","How will you handle objections?","What follow-up system will you implement?","How will you use pricing psychology to increase conversions?"]},
      {"id":"gp10","part":5,"title":"Product or Service Development","lead":"Strong product development ensures your offerings meet customer needs and stand out in the market.","learn":[{"title":"Packaging your offer","body":"How you present your product matters. Clear structure makes it easier to understand and sell. Packaging can increase perceived value. It improves the customer experience."},{"title":"Creating tiers (basic, premium, VIP)","body":"Offering different levels gives customers options. It allows you to serve different budgets. Higher tiers increase revenue potential. It also creates scalability."},{"title":"Beta launches","body":"A beta launch is a test version of your product. It allows you to gather feedback before a full launch. This helps you improve. It reduces risk."},{"title":"Customer feedback loops","body":"Continuously collecting feedback helps you improve. Your customers tell you what works and what doesn’t. This keeps your offer relevant. Improvement should be ongoing."},{"title":"Product-market fit","body":"This means your product meets real demand. When achieved, sales become easier. It shows you’re solving the right problem. This is key to long-term success."}],"questions":["How will you package your product or service?","Will you offer tiers (basic, premium, VIP)?","How will you run beta tests?","How will you collect ongoing customer feedback?","How will you determine product-market fit?"]},
      {"id":"gp11","part":5,"title":"Operations","lead":"Effective operations ensure consistency, efficiency, and scalability.","learn":[{"title":"SOPs (Standard Operating Procedures)","body":"SOPs document how tasks are done. This creates consistency and efficiency. It makes training easier. Systems reduce confusion and errors."},{"title":"Time management systems","body":"Managing your time effectively increases productivity. Systems help you stay organized. Prioritization is key. Good time management reduces stress."},{"title":"Workflow automation","body":"Automation saves time by handling repetitive tasks. This increases efficiency. It allows you to focus on growth. Smart systems improve performance."},{"title":"Delegation strategies","body":"Delegating tasks frees up your time. It allows you to focus on high-level work. Trusting others is important. Delegation supports growth."},{"title":"Project management tools","body":"These tools help organize tasks and deadlines. They improve team communication. Staying organized keeps projects on track. Structure leads to better results."}],"questions":["What are your key SOPs (standard operating procedures)?","How will you manage your time effectively?","Which processes can be automated?","Which tasks will you delegate, and to whom?","What project management tools will you use to stay organized?"]},
      {"id":"gp12","part":5,"title":"Financial Planning","lead":"Financial planning ensures your business is profitable, sustainable, and ready for growth.","learn":[{"title":"Budget creation","body":"A budget helps you plan your spending. It keeps you in control of your finances. This prevents overspending. Financial discipline is key."},{"title":"Profit vs. revenue understanding","body":"Revenue is what you earn, profit is what you keep. Understanding the difference is critical. Many businesses fail due to lack of profit. Focus on both."},{"title":"Cash flow management","body":"Cash flow tracks money coming in and out. Positive cash flow keeps your business running. Poor cash flow can cause problems. Monitoring is essential."},{"title":"Break-even analysis","body":"This shows when your business covers its costs. It helps you set realistic goals. Knowing your numbers builds clarity. It guides pricing decisions."},{"title":"Financial goal setting","body":"Setting financial goals gives direction. It helps you measure progress. Goals keep you focused. Clear targets drive growth."}],"questions":["What is your budget for the next 12 months?","How will you track revenue vs. profit?","How will you manage cash flow?","What is your break-even point?","What financial goals will you set for short-term and long-term growth?"]},
      {"id":"gp13","part":5,"title":"Funding","lead":"Proper funding ensures your business has the resources to grow without taking unnecessary risk.","learn":[{"title":"Bootstrapping vs. outside funding","body":"Bootstrapping means using your own resources to grow. Outside funding comes from loans, investors, or grants. Knowing which approach fits your goals is key. Each has risks and benefits. Choose wisely to maintain control and sustainability."},{"title":"Grants and loans","body":"Grants provide free money but require specific criteria. Loans must be repaid but can accelerate growth. Research options carefully. The right funding supports expansion without over-leverage."},{"title":"Investor pitching basics","body":"If seeking investors, you need a clear pitch. Show your vision, growth potential, and revenue plan. Confidence and clarity attract funding. A strong pitch builds credibility."},{"title":"Business credit building","body":"Strong business credit opens opportunities for loans and partnerships. Start early with vendor accounts or small credit lines. Paying on time improves your rating. Good credit strengthens financial stability."},{"title":"ROI on funding decisions","body":"Every investment should have a return. Evaluate potential gains versus costs. Smart funding accelerates growth. Poor funding choices can create debt or risk. Always plan strategically."}],"questions":["Will you bootstrap or seek outside funding?","Are there grants or loans available for your business?","How will you pitch your business to potential investors?","How will you build strong business credit?","How will you measure the ROI of funding decisions?"]},
      {"id":"gp14","part":5,"title":"Legal Structure","lead":"The right legal structure protects your business and simplifies taxes and operations.","learn":[{"title":"LLC vs. S-Corp vs. sole proprietorship","body":"Each structure affects taxes, liability, and management. Choosing the right one impacts long-term growth. Research options carefully. The right structure protects you and your business."},{"title":"Contracts and agreements","body":"Written agreements prevent disputes. They define expectations with clients, vendors, and employees. Legal clarity reduces risk. Always have contracts in place."},{"title":"Licenses and permits","body":"Operating legally avoids fines and shutdowns. Different businesses require different permits. Compliance ensures peace of mind. Don’t overlook this step."},{"title":"Intellectual property protection","body":"Protect your ideas, logos, and products legally. IP safeguards your brand from copycats. Early protection strengthens your position. It adds long-term value."},{"title":"Compliance requirements","body":"Follow tax laws, employment rules, and safety regulations. Noncompliance risks fines or legal issues. Staying compliant builds credibility. Protect your business foundation."}],"questions":["Which contracts and agreements will you need?","What licenses and permits are required?","How will you protect intellectual property?","How will you ensure ongoing legal compliance?","Will I operate as a sole proprietor, LLC, or corporation?"]},
      {"id":"gp15","part":5,"title":"Location & Infrastructure","lead":"Your business location and infrastructure affect efficiency, customer experience, and growth potential.","learn":[{"title":"Home-based vs. commercial space","body":"Decide whether your business operates from home, online, or a physical location. Each option has cost and operational differences. Choose what fits your needs and scalability."},{"title":"Online vs. physical business models","body":"Some businesses thrive entirely online; others need in-person presence. Knowing your model affects marketing, operations, and costs. Match infrastructure to your strategy."},{"title":"Equipment and setup needs","body":"The right tools, furniture, and tech improve productivity. Avoid overbuying but don’t skimp. Proper setup makes operations efficient."},{"title":"Scalability of your setup","body":"Plan infrastructure with growth in mind. Can your space, tech, or systems handle more clients? Scalability prevents costly adjustments later."},{"title":"Cost vs. functionality decisions","body":"Budgeting is important but don’t sacrifice efficiency. Invest in essentials that streamline work. Functionality supports consistent delivery."}],"questions":["Will your business operate from home, online, or a commercial space?","What equipment and setup do you need?","How scalable is your current infrastructure?","Are there costs you can reduce without sacrificing functionality?","How will your location support business growth?"]},
      {"id":"gp16","part":5,"title":"Hiring & HR","lead":"Hiring the right people and having clear HR processes ensures productivity and culture alignment.","learn":[{"title":"When to hire your first employee","body":"Know when your workload exceeds your capacity. Hiring too early or late can hurt growth. First hires should align with your mission. Timing impacts efficiency and cost."},{"title":"Contractors vs. employees","body":"Contractors offer flexibility; employees bring long-term stability. Choose based on your needs and budget. Legal distinctions matter. The right choice improves performance."},{"title":"Onboarding processes","body":"A structured onboarding ensures new hires understand expectations. It reduces errors and builds confidence. Proper onboarding accelerates productivity."},{"title":"Company culture building","body":"Culture defines your team environment. Strong culture attracts the right people. It boosts morale and retention. Intentional culture drives long-term success."},{"title":"Performance management","body":"Set clear goals and review performance regularly. Feedback improves growth. Recognize achievements to motivate. Accountability drives results."}],"questions":["When will you hire your first employee?","Will you use contractors or full-time employees?","How will you onboard new hires effectively?","How will you define and maintain company culture?","How will you track and manage performance?"]},
      {"id":"gp17","part":5,"title":"Customer Experience","lead":"Exceptional customer experience drives loyalty, referrals, and repeat business.","learn":[{"title":"Onboarding new clients","body":"Make a strong first impression. Clear instructions and communication build trust. Good onboarding increases satisfaction. It sets the tone for the relationship."},{"title":"Customer communication systems","body":"Use email, chat, or CRM tools to stay connected. Consistency improves relationships. Clear communication reduces confusion."},{"title":"Retention strategies","body":"Keeping customers costs less than acquiring new ones. Loyalty programs, follow-ups, and personalization help. Retention drives recurring revenue."},{"title":"Loyalty programs","body":"Rewards and incentives encourage repeat business. They show appreciation and build connection. Loyalty programs create long-term value."},{"title":"Handling complaints professionally","body":"Respond quickly and empathetically. Turn negative experiences into learning opportunities. How you handle issues reflects your brand. Satisfaction strengthens trust."}],"questions":["How will you onboard new customers?","What communication systems will you use?","What retention strategies will you implement?","Will you offer loyalty programs or rewards?","How will you handle complaints professionally?"]},
      {"id":"gp18","part":5,"title":"Technology & Tools","lead":"The right tools improve efficiency, communication, and security.","learn":[{"title":"CRM systems","body":"Customer Relationship Management tools organize contacts and interactions. They improve follow-ups and sales. CRMs enhance customer experience."},{"title":"Automation tools","body":"Automation reduces repetitive work. Tasks like email sequences or social posting save time. Automation improves efficiency and consistency."},{"title":"Communication platforms","body":"Tools like Slack, Teams, or Zoom improve team collaboration. Clear communication avoids errors. Technology supports remote and hybrid work."},{"title":"Cybersecurity basics","body":"Protecting data is critical. Strong passwords, encryption, and backups prevent losses. Cybersecurity builds customer and business trust."},{"title":"Tool stack optimization","body":"Choose tools that integrate well and reduce complexity. Avoid too many platforms. Streamlined tech improves workflow."}],"questions":["Which CRM system will you use?","Which tasks can you automate?","Which communication platforms will your team use?","How will you ensure cybersecurity?","How will you optimize your tool stack for simplicity?"]},
      {"id":"gp19","part":5,"title":"Growth & Scaling","lead":"Planned growth ensures long-term sustainability and profitability.","learn":[{"title":"When to scale vs. stabilize","body":"Scaling too early can overwhelm your systems. Stabilizing ensures your business runs smoothly first. Balance growth with readiness. Timing impacts success."},{"title":"Expanding product lines","body":"Adding complementary products increases revenue. Test new offers carefully. Expansion should meet customer needs. Avoid overextending resources."},{"title":"Entering new markets","body":"Research audience and competition before expansion. Understand local needs and regulations. Strategic entry reduces risk. Growth opportunities must be calculated."},{"title":"Partnerships and collaborations","body":"Strategic alliances can accelerate growth. Choose partners that align with your mission. Collaboration opens new audiences and resources."},{"title":"Scaling systems and teams","body":"Strong systems and trained teams are required to handle more business. Scaling without structure causes chaos. Prepare infrastructure before growth."}],"questions":["When will you scale vs. stabilize operations?","Will you expand product lines or services?","Which new markets could you enter?","What partnerships or collaborations could support growth?","Are your systems and teams prepared to handle scaling?"]},
      {"id":"gp20","part":5,"title":"Risk Management","lead":"Identifying and mitigating risks protects your business from financial, operational, or reputational harm.","learn":[{"title":"Identifying business risks","body":"Recognize potential threats to operations, finances, or reputation. Awareness is the first step to prevention. Risk assessment protects stability."},{"title":"Insurance coverage","body":"Insurance mitigates financial losses. Different types cover different risks. Adequate coverage protects against unforeseen events."},{"title":"Emergency planning","body":"Have contingency plans for crises like tech failures or natural disasters. Preparation reduces downtime. It ensures continuity."},{"title":"Diversifying income streams","body":"Relying on one revenue source is risky. Multiple streams reduce vulnerability. Diversification strengthens stability."},{"title":"Legal and financial safeguards","body":"Contracts, compliance, and accounting controls reduce exposure. Protecting your assets avoids costly issues. Risk management ensures business longevity."}],"questions":["What are the biggest risks to your business?","Which insurance policies do you need?","What is your emergency contingency plan?","How will you diversify income streams?","What legal or financial safeguards will you implement?"]},
      {"id":"gp21","part":5,"title":"Exit Strategy","lead":"Planning an exit ensures maximum value and smooth transition when you leave the business.","learn":[{"title":"Selling your business","body":"Planning ahead maximizes value and smooth transfer. Understand valuation and potential buyers. A strategic sale secures financial returns."},{"title":"Passing it to family or partners","body":"Transitioning ownership requires planning. Ensure readiness and clear agreements. Smooth succession prevents disputes."},{"title":"Mergers and acquisitions basics","body":"M&A can be an exit or growth strategy. Understand processes, negotiations, and legalities. Preparation ensures favorable outcomes."},{"title":"Building business valuation","body":"Strong systems, revenue, and reputation increase worth. Track KPIs and profitability. Value grows with strategic planning."},{"title":"Passive income transition","body":"Plan for income beyond active management. Systems and staff must sustain operations. Transitioning ensures financial freedom."}],"questions":["Do you plan to sell, merge, or pass your business on?","How will you prepare for a sale or transfer?","How will you determine business valuation?","What systems must be in place for passive income or transition?","How will you maximize your long-term return?"]},
      {"id":"gp22","part":5,"title":"Personal Founder Questions","lead":"Your personal growth and mindset are essential for business success.","learn":[{"title":"Time management and boundaries","body":"Effective founders set clear work hours. Boundaries prevent burnout. Prioritization protects focus. Time is a finite resource."},{"title":"Burnout prevention","body":"Self-care and balance are essential. Avoid overwork by scheduling rest and recovery. Sustainable energy drives consistent results."},{"title":"Leadership development","body":"Invest in skills like communication, delegation, and decision-making. Strong leadership inspires teams. Growth starts with the founder."},{"title":"Mindset and discipline","body":"Success requires focus, perseverance, and resilience. Mindset influences outcomes. Discipline turns ideas into results."},{"title":"Work-life balance","body":"Separating personal and business time preserves well-being. Balance prevents stress and improves creativity. Healthy founders lead better businesses."}],"questions":["How will you manage time and set boundaries?","What strategies will you use to prevent burnout?","How will you develop leadership skills?","How will you maintain a disciplined mindset?","How will you balance work and personal life?"]},

      // ===== PART 6 — The entrepreneur business workbook =====
      {"id":"mw1","part":6,"title":"Entrepreneur mindset","lead":"Understand what it takes to build and sustain a business.","questions":[],"blocks":[{"t":"points","label":"Key concepts","items":["Success requires discipline, resilience, and clarity","You must develop both skills and mindset","Growth comes from action plus reflection"]},{"t":"fields","label":"Personal motivation","items":["Why do you want to start a business?","What personal goals do you hope to achieve?","What problems in the world bother you most?","What skills do you already have?"]},{"t":"rating","label":"Strength assessment — rate yourself 1 to 5","items":["Leadership","Communication","Financial discipline","Creativity","Persistence"]},{"t":"fields","label":"Reflection","items":["Which skills must you develop?"]}]},
      {"id":"mw2","part":6,"title":"Discovering business ideas","lead":"Generate and evaluate potential business ideas.","questions":[],"blocks":[{"t":"numbered","label":"Brainstorm — list 10 ideas","count":10},{"t":"fields","label":"Passion + skill + market","items":["What are you passionate about?","What skills do you have?","What market need exists?"]},{"t":"note","label":"The sweet spot","text":"Where your passion, your skill, and a real market need overlap — that’s a strong opportunity."}]},
      {"id":"mw3","part":6,"title":"Problem identification","lead":"Every business must solve a real problem.","questions":[],"blocks":[{"t":"fields","label":"Problem discovery","items":["What problem are you solving?","Who experiences it?","How often does it occur?","What frustration does it cause?","What happens if it’s not solved?"]}]},
      {"id":"mw4","part":6,"title":"Customer research","lead":"Understand your customer deeply.","questions":[],"blocks":[{"t":"fields","label":"Ideal customer profile","items":["Name","Age","Career","Income","Lifestyle","Challenges","Goals","Fears","Buying motivations"]},{"t":"fields","label":"Customer interview questions","items":["Biggest frustration?","Current solution?","What works?","What doesn’t?","What would you pay?"]}]},
      {"id":"mw5","part":6,"title":"Market research","lead":"Validate demand and potential.","questions":[],"blocks":[{"t":"fields","label":"Market size","items":["Total customers in the market","Percent likely interested","Potential customers","Average price","Market value"]}]},
      {"id":"mw6","part":6,"title":"Competitor analysis","lead":"Understand your competition.","questions":[],"blocks":[{"t":"table","label":"Competitor table","columns":["Competitor","Strength","Weakness","Price"],"rows":3},{"t":"fields","label":"Key questions","items":["What do customers complain about?","Where can you improve?"]}]},
      {"id":"mw7","part":6,"title":"Value proposition","lead":"Define why customers choose you.","questions":[],"blocks":[{"t":"fields","label":"Value proposition formula","items":["We help…","Who struggle with…","By providing…","So they can…"]},{"t":"note","label":"Example","text":"“We help busy professionals eat healthier by delivering fresh meals weekly.”"}]},
      {"id":"mw8","part":6,"title":"Business model design","lead":"Define how your business makes money.","questions":[],"blocks":[{"t":"numbered","label":"Revenue streams","count":4},{"t":"fields","label":"Pricing","items":["Price","Cost","Profit","Monthly sales goal","Monthly revenue"]}]},
      {"id":"mw9","part":6,"title":"Product or service development","lead":"Create your minimum viable product (MVP).","questions":[],"blocks":[{"t":"fields","label":"MVP questions","items":["What is the simplest version of the product?","What is the core feature?","What can wait?"]}]},
      {"id":"mw10","part":6,"title":"Branding strategy","lead":"Define how your business is perceived.","questions":[],"blocks":[{"t":"fields","label":"Brand identity","items":["Name","Mission","Values","Personality","Customer emotion"]},{"t":"checks","label":"Brand voice — choose what fits","items":["Professional","Friendly","Inspirational","Educational","Bold"]}]},
      {"id":"mw11","part":6,"title":"Marketing strategy","lead":"Attract and engage customers.","questions":[],"blocks":[{"t":"points","label":"Channels to consider","items":["Social media","Email","Content","Partnerships","Advertising"]},{"t":"numbered","label":"Content ideas — list 20","count":20}]},
      {"id":"mw12","part":6,"title":"Sales strategy","lead":"Convert interest into revenue.","questions":[],"blocks":[{"t":"note","label":"Sales funnel","text":"Awareness → Interest → Decision → Purchase"},{"t":"fields","label":"Key questions","items":["How will customers find you?","How will you convert them?"]}]},
      {"id":"mw13","part":6,"title":"Financial planning","lead":"Understand costs and financial needs.","questions":[],"blocks":[{"t":"fields","label":"Startup budget","items":["Website","Marketing","Equipment","Legal","Software","Total"]}]},
      {"id":"mw14","part":6,"title":"Funding options","lead":"Determine how to fund your business.","questions":[],"blocks":[{"t":"checks","label":"Funding options — select what applies","items":["Personal savings","Investors","Bank loan","Grants","Crowdfunding"]}]},
      {"id":"mw15","part":6,"title":"Legal setup","lead":"Legally establish your business.","questions":[],"blocks":[{"t":"checks","label":"Checklist","items":["Register business name","Choose structure (LLC recommended)","Obtain licenses","Open bank account","Protect intellectual property"]}]},
      {"id":"mw16","part":6,"title":"Systems & operations","lead":"Run your business efficiently.","questions":[],"blocks":[{"t":"fields","label":"Essential tools — what will you use?","items":["CRM","Accounting software","Email platform","Project management tool"]}]},
      {"id":"mw17","part":6,"title":"Launch plan","lead":"Successfully go to market.","questions":[],"blocks":[{"t":"checks","label":"Launch checklist","items":["Website ready","Marketing plan ready","Product ready","Sales process ready","Customer support ready"]}]},
      {"id":"mw18","part":6,"title":"Growth strategy","lead":"Scale your business over time.","questions":[],"blocks":[{"t":"fields","label":"Your 12-month plan","items":["Months 1–3 — get your first customers","Months 4–6 — improve the product","Months 7–9 — increase marketing","Months 10–12 — scale operations"]}]},
      {"id":"mw19","part":6,"title":"Exit strategy & long-term vision","lead":"Define your long-term goal.","questions":[],"blocks":[{"t":"checks","label":"Exit options","items":["Sell the business","Scale and keep","Pass it on","Merge","Close"]},{"t":"fields","label":"Vision questions","items":["Where is this business in 5–10 years?","What impact do you want to create?","What does success look like?"]}]},

      // ===== PART 7 — Starting a business, step-by-step (Arizona) =====
      {"id":"sb1","part":7,"title":"Why the right order matters","lead":"Turn your idea into a legal, protected, scalable business.","questions":[],"blocks":[{"t":"note","label":"The big picture","text":"Starting a business feels overwhelming, but breaking it into steps makes it achievable: validate the idea, choose and check a name, pick a structure, register with the state, get your EIN, obtain licenses and permits, open a business bank account, and set up operations."},{"t":"points","label":"Why this order pays off","items":["Validating first, then registering, getting an EIN, and organizing finances keeps you compliant and protects your personal assets.","It lets you open a business bank account, access funding (e.g. the SBA), and build business credit.","Free expert help from SCORE and the SBDC guides you at no cost.","Overall you operate professionally, earn faster, and scale with confidence."]},{"t":"mark","label":"I’ve reviewed this"}]},
      {"id":"sb7","part":7,"title":"Timeline","lead":"From filing to launch in about four weeks (Arizona example — timelines vary).","questions":[],"blocks":[{"t":"timeline","label":"Week by week","items":[{"label":"Week 1 — Planning","items":["Idea validation","Name selection","Business structure decision"]},{"label":"Week 2 — Formation","items":["File LLC with the AZ Corporation Commission","Online filing: 1–3 business days","Standard: 1–2 weeks"]},{"label":"Week 2–3 — Federal setup","items":["Get EIN from the IRS — immediate online"]},{"label":"Week 3 — Legal & banking","items":["Register TPT (AZ Dept. of Revenue)","Apply for city license (Phoenix)","Open business bank account","~2–5 days total"]},{"label":"Week 4 — Launch","items":["Set up website","Begin marketing","Start sales"]}]},{"t":"mark","label":"I’ve reviewed the timeline"}]},
      {"id":"sb4","part":7,"title":"Common mistakes to avoid","lead":"Sidestep the errors that trip up new owners.","questions":[],"blocks":[{"t":"avoid","label":"Don’t do these","items":["Getting your EIN before forming your LLC","Skipping a DBA when using a different brand name","Not checking name availability first","Mixing personal and business finances","Not registering for Arizona TPT when required"]},{"t":"note","label":"Pro insight","text":"Building a platform/podcast + real estate? Start with one LLC, use multiple DBAs under it for different brands, and build business credit early after your EIN and bank account."},{"t":"mark","label":"I’ve reviewed this"}]},
      {"id":"sb5","part":7,"title":"Printable startup checklist","lead":"Work the phases — check each off as you go.","questions":[],"blocks":[{"t":"checks","label":"Phase 1 — Planning","items":["Validate business idea","Define target customer","Set pricing strategy","Choose business name","Check name availability","Secure domain + social handles"]},{"t":"checks","label":"Phase 2 — Structure & formation","items":["Choose business structure (LLC recommended)","File formation documents with your state","Create Operating Agreement (for LLC)","Get EIN from the IRS"]},{"t":"checks","label":"Phase 3 — Legal setup","items":["Register a trade name (DBA) if needed","Register for state sales/seller’s tax (if required)","Obtain city/county business license (if required)"]},{"t":"checks","label":"Phase 4 — Banking & finance","items":["Open business bank account","Set up bookkeeping system","Apply for business credit (optional)"]},{"t":"checks","label":"Phase 5 — Operations","items":["Set up invoicing system","Create contracts/templates","Set up business email & phone","Launch website"]}]},
      {"id":"sb6","part":7,"title":"Estimated cost","lead":"Estimated startup costs to plan for. State filing fees change, so confirm the current amount with your state using the link below.","questions":[],"blocks":[{"t":"statecost"},{"t":"costs"},{"t":"mark","label":"I’ve reviewed costs"}]},
      {"id":"sb2","part":7,"title":"Step-by-step: starting a business","lead":"The exact order to set up your business — with the official links for your state.","questions":[],"blocks":[{"t":"statelinks"},{"t":"steps","label":"Follow these in order","items":[{"title":"Check name availability","desc":"Search your state’s official business-entity database (the “Register your business” link above) to make sure your name isn’t already taken."},{"title":"Register your business (state filing)","desc":"File your formation documents with your state’s filing agency using the official link above. Most states let you create an account and file online."},{"title":"Choose your business structure","desc":"Sole proprietor (simple, no liability protection), LLC (most common, flexible, protects personal assets), or corporation (for scaling/investors). Most small businesses choose an LLC and file Articles of Organization."},{"title":"Register a trade name (DBA) — if needed","desc":"Only needed if you operate under a name different from your legal entity. File it with your state’s filing agency (link above)."},{"title":"Get your EIN (federal tax ID)","desc":"Apply free with the IRS — takes about 10 minutes. Do this after your business is registered with the state.","url":"https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"},{"title":"Open a business bank account","desc":"Bring your EIN confirmation letter, formation documents, and Operating Agreement (for an LLC). Keeps finances clean and protects your liability shield."},{"title":"Get state & local licenses","desc":"Check license and permit requirements with your state and your city or county. The SBA license guide is a good federal starting point.","url":"https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits"},{"title":"Register for state taxes (if applicable)","desc":"Register with your state’s Department of Revenue (the “State taxes” link above) — e.g. a sales/seller’s permit, and employer taxes if you’ll hire."},{"title":"Set up your business operations","desc":"Accounting system (QuickBooks, Wave), contracts and templates, business email + phone, and payment processing (Stripe, Square)."}]},{"t":"mark","label":"I’ve reviewed this"}]},
      {"id":"sb3","part":7,"title":"Free business resources","lead":"Expert help and tools at no cost — use them.","questions":[],"blocks":[{"t":"resources","label":"Where to get free help","items":[{"name":"Small Business Administration (SBA)","url":"https://www.sba.gov","items":["Free business guides","Funding programs","Business plan templates","Certifications for women-owned businesses"]},{"name":"SCORE","url":"https://www.score.org","items":["Free mentors (huge value)","Business plan help","Financial projections","Workshops and templates"]},{"name":"Small Business Development Center (SBDC)","url":"https://americassbdc.org","items":["Local, in-person help","Market research tools","Growth strategy support"]},{"name":"Arizona Commerce Authority","url":"https://www.azcommerce.com","items":["Arizona-specific programs","Grants & incentives","Startup guidance"]},{"name":"Women’s Business Centers","url":"https://www.sba.gov/local-assistance/resource-partners/womens-business-centers","items":["Funding guidance for women entrepreneurs","Coaching + training","Networking opportunities"]}]},{"t":"mark","label":"I’ve saved these"}]}
    ];
  }

  toggleKey(key) {
    this.setState(st => {
      const answers = Object.assign({}, st.answers, { [key]: !st.answers[key] });
      try { localStorage.setItem(this.KEY, JSON.stringify({ step: st.step, answers, decision: st.decision })); } catch (e) {}
      return { answers };
    });
  }

  blocksDone(sec) {
    const A = this.state.answers;
    return sec.blocks.every((b, bi) => {
      const k = (ii) => sec.id + ':' + bi + ':' + ii;
      if (b.t === 'fields') return b.items.every((_, ii) => (A[k(ii)] || '').toString().trim() !== '');
      if (b.t === 'rating') return b.items.every((_, ii) => !!A[k(ii)]);
      if (b.t === 'checks') return b.items.some((_, ii) => !!A[k(ii)]);
      if (b.t === 'numbered') { for (let ii = 0; ii < b.count; ii++) if ((A[k(ii)] || '').toString().trim() !== '') return true; return false; }
      if (b.t === 'table') { for (let r = 0; r < b.rows; r++) for (let c = 0; c < b.columns.length; c++) if ((A[sec.id + ':' + bi + ':' + r + ':' + c] || '').trim() !== '') return true; return false; }
      if (b.t === 'mark') return !!A[sec.id + ':' + bi + ':0'];
      return true;
    });
  }

  isDone(sec) {
    const A = this.state.answers;
    if (sec.isPledge) return !!A[sec.id + 'pledge'];
    if (sec.blocks) return this.blocksDone(sec);
    const allFilled = sec.questions.every((_, i) => (A[sec.id + 'q' + i] || '').trim() !== '');
    if (sec.isDecision) return allFilled && !!this.state.decision;
    return allFilled;
  }

  togglePledge(id) {
    const key = id + 'pledge';
    this.setState(st => {
      const answers = Object.assign({}, st.answers, { [key]: !st.answers[key] });
      try { localStorage.setItem(this.KEY, JSON.stringify({ step: st.step, answers, decision: st.decision })); } catch (e) {}
      return { answers };
    });
  }

  pad2(n) { return (n < 10 ? '0' : '') + n; }

  renderVals() {
    const S = this.sections();
    const N = S.length;
    const step = this.state.step;
    const A = this.state.answers;
    const completed = S.filter(sec => this.isDone(sec)).length;
    const pct = Math.round((completed / N) * 100);

    const isIntro = step === 0 && !this.state.view;
    const isSummary = step === N + 1 && !this.state.view;
    const isSection = step >= 1 && step <= N && !this.state.view;

    // ----- sidebar nav rows (part headers, stage subheaders, items) -----
    const partNames = { 1: 'Your roadmap', 2: 'Validate your idea', 3: 'Plan your business', 4: 'Business foundation', 5: 'Planning & growth', 6: 'Entrepreneur workbook', 7: 'Launch your business' };
    const partBlurb = { 1: 'Mindset, idea, structure, money, and your first launch.', 2: 'Test whether the idea is real, wanted, and worth pursuing.', 3: 'Mission to exit — every key question, answered.', 4: 'The systems that keep your business stable.', 5: 'Go deeper — key concepts plus strategic prompts.', 6: 'Hands-on worksheets from idea to launch to growth.', 7: 'Register, file, and open — official links for your state.' };
    const PARTS = [1, 2, 3, 4, 5, 6, 7];
    const partStat = {};
    S.forEach((sec, i) => { const p = sec.part; if (!partStat[p]) partStat[p] = { done: 0, total: 0, first: i + 1 }; partStat[p].total++; if (this.isDone(sec)) partStat[p].done++; });
    const curPart = isSection ? S[step - 1].part : null;
    const openPart = this.state.openPart != null ? this.state.openPart : curPart;

    const navRows = [];
    PARTS.forEach((p) => {
      const ps = partStat[p]; const expanded = openPart === p; const complete = ps.done === ps.total;
      const ppct = ps.total ? Math.round(ps.done / ps.total * 100) : 0;
      navRows.push({ isPartHeader: true, isItem: false, num: String(p), name: partNames[p], complete: complete, notComplete: !complete, expanded: expanded, countText: ps.done + '/' + ps.total + ' done',
        headerStyle: 'display:flex;align-items:center;gap:11px;padding:11px 10px;border-radius:var(--radius-md);cursor:pointer;margin-top:' + (p === 1 ? '0' : '3px') + ';transition:background var(--dur-fast) var(--ease-out);background:' + (expanded ? 'var(--cream-100)' : 'transparent') + ';',
        badgeStyle: 'display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;flex:none;border-radius:99px;font-family:var(--font-mono);font-size:11px;font-weight:700;' + (complete ? 'background:var(--forest-600);color:#fff;' : 'background:var(--navy-050);color:var(--navy-700);'),
        chevStyle: 'flex:none;color:var(--text-faint);font-size:18px;line-height:1;transition:transform var(--dur-fast) var(--ease-out);transform:rotate(' + (expanded ? '90deg' : '0deg') + ');',
        onToggle: () => this.togglePart(p) });
      if (expanded) {
        let n = 0;
        S.forEach((sec, i) => {
          if (sec.part !== p) return;
          n++; const itemStep = i + 1; const done = this.isDone(sec); const cur = itemStep === step;
          const rowStyle = 'display:flex;align-items:center;gap:11px;padding:8px 10px 8px 16px;border-radius:var(--radius-sm);cursor:pointer;margin-bottom:1px;transition:background var(--dur-fast) var(--ease-out);' + (cur ? 'background:var(--cream-100);' : 'background:transparent;');
          let circleStyle = 'display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;border-radius:99px;font-family:var(--font-mono);font-size:10px;font-weight:600;';
          if (cur) circleStyle += 'background:var(--navy-700);color:#fff;';
          else if (done) circleStyle += 'background:var(--forest-050);color:var(--forest-600);border:1px solid var(--forest-100);';
          else circleStyle += 'background:transparent;color:var(--text-faint);border:1px solid var(--border-default);';
          const titleStyle = 'font-size:13px;line-height:1.3;' + (cur ? 'color:var(--navy-700);font-weight:600;' : (done ? 'color:var(--text-muted);font-weight:500;' : 'color:var(--ink-600);font-weight:500;'));
          navRows.push({ isPartHeader: false, isItem: true, n2: this.pad2(n), title: sec.title, isDone: done, showNum: !done, rowStyle, circleStyle, titleStyle, onClick: () => this.go(itemStep) });
        });
      }
    });

    const parts = PARTS.map((p) => {
      const ps = partStat[p]; const complete = ps.done === ps.total; const ppct = ps.total ? Math.round(ps.done / ps.total * 100) : 0;
      return { num: String(p), name: partNames[p], blurb: partBlurb[p], complete: complete, notComplete: !complete, countText: ps.done + '/' + ps.total,
        badgeStyle: 'display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;flex:none;border-radius:99px;font-family:var(--font-display);font-size:15px;font-weight:800;' + (complete ? 'background:var(--forest-600);color:#fff;' : 'background:var(--gold-050);color:var(--gold-700);'),
        barStyle: 'height:100%;border-radius:99px;background:var(--forest-600);transition:width var(--dur-slow) var(--ease-out);width:' + ppct + '%;',
        onOpen: () => { this.setState({ openPart: p }); this.go(ps.first); } };
    });
    const ringC = 339.292;
    const ringOffset = ringC * (1 - pct / 100);
    const greeting = (this.state.commitment && this.state.commitment.name) ? ('Hi, ' + this.state.commitment.name + '.') : 'Your founder workbook';

    const navItemBase = 'display:flex;align-items:center;gap:11px;padding:11px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:13px;font-weight:600;transition:background var(--dur-fast) var(--ease-out);';
    const overviewStyle = navItemBase + (isIntro ? 'background:var(--cream-100);color:var(--navy-700);' : 'color:var(--ink-600);');
    const summaryStyle = navItemBase + 'margin-top:16px;border-top:1px solid var(--border-subtle);border-radius:0;padding-top:18px;' + (isSummary ? 'color:var(--navy-700);' : 'color:var(--ink-600);');

    // ----- current section -----
    let current = null;
    if (isSection) {
      const sec = S[step - 1];
      const partLabels = { 2: 'Part 2 · Validate', 3: 'Part 3 · Plan', 4: 'Part 4 · Foundation', 5: 'Part 5 · Planning', 6: 'Part 6 · Workbook', 7: 'Part 7 · Launch' };
      const partTag = sec.part === 1 ? ('Part 1 · ' + sec.stage) : partLabels[sec.part];
      const nInPart = S.slice(0, step).filter(x => x.part === sec.part).length;
      const isLesson = sec.part === 1;
      const questions = sec.questions.map((text, i) => {
        const qid = sec.id + 'q' + i;
        return { num: this.pad2(i + 1), text, value: A[qid] || '', onChange: (e) => this.setAnswer(qid, e.target.value) };
      });
      const exId = sec.id + 'ex';
      const buildBlocks = () => (sec.blocks || []).map((b, bi) => {
        const key = (ii) => sec.id + ':' + bi + ':' + ii;
        if (b.t === 'points') return { isPoints: true, label: b.label, items: b.items };
        if (b.t === 'note') return { isNote: true, label: b.label, text: b.text };
        if (b.t === 'fields') return { isFields: true, label: b.label, fields: b.items.map((lab, ii) => ({ label: lab, value: A[key(ii)] || '', onChange: (e) => this.setAnswer(key(ii), e.target.value) })) };
        if (b.t === 'numbered') { const arr = []; for (let ii = 0; ii < b.count; ii++) arr.push({ n: this.pad2(ii + 1), value: A[key(ii)] || '', onChange: (e) => this.setAnswer(key(ii), e.target.value) }); return { isNumbered: true, label: b.label, items: arr }; }
        if (b.t === 'checks') return { isChecks: true, label: b.label, items: b.items.map((lab, ii) => { const ck = !!A[key(ii)]; return { label: lab, checked: ck,
          rowStyle: 'display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:var(--radius-md);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out);border:1px solid ' + (ck ? 'var(--forest-600)' : 'var(--border-default)') + ';background:' + (ck ? 'var(--forest-050)' : 'var(--white)') + ';',
          boxStyle: 'display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;border-radius:var(--radius-sm);margin-top:1px;transition:background var(--dur-fast) var(--ease-out);' + (ck ? 'background:var(--forest-600);color:#fff;border:1.5px solid var(--forest-600);' : 'background:var(--white);border:1.5px solid var(--border-strong);'),
          onClick: () => this.toggleKey(key(ii)) }; }) };
        if (b.t === 'rating') return { isRating: true, label: b.label, rows: b.items.map((lab, ii) => { const val = A[key(ii)] || 0; return { label: lab, opts: [1,2,3,4,5].map(n => ({ n, onClick: () => this.setAnswer(key(ii), n),
          dotStyle: 'display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-mono);font-size:13px;font-weight:600;transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out);' + (val >= n ? 'background:var(--forest-600);color:#fff;border:1px solid var(--forest-600);' : 'background:var(--white);color:var(--text-muted);border:1px solid var(--border-strong);') })) }; }) };
        if (b.t === 'table') { const rows = []; for (let r = 0; r < b.rows; r++) { rows.push(b.columns.map((col, c) => { const kk = sec.id + ':' + bi + ':' + r + ':' + c; return { value: A[kk] || '', onChange: (e) => this.setAnswer(kk, e.target.value) }; })); } return { isTable: true, label: b.label, columns: b.columns, rows }; }
        if (b.t === 'costs') {
          const sdc2 = this.stateData();
          const cm = this.state.commitment;
          const sn = (cm && sdc2[cm.state]) ? sdc2[cm.state].name : 'your state';
          const sc = this.stateCost(cm ? cm.state : '');
          return { isCosts: true, stateName: sn, note: sc.note, hasNote: !!sc.note,
            formationRows: [['LLC filing (Articles of Organization)', sc.llc], ['Trade name (DBA), optional', sc.dbaCost], ['Registered agent (optional service)', '$0–$300/yr'], ['EIN (IRS)', 'Free'], ['Operating agreement', 'Free–$200']],
            licenseRows: [[sc.salesLabel, sc.salesCost], ['City / county business license', 'Varies ($0–$150+)'], ['Industry-specific permits', 'Varies ($0–$500+)']],
            toolRows: [['Business bank account', 'Free–$25/mo'], ['Accounting software', '$0–$70/mo'], ['Website domain', '$10–$20/yr'], ['Website hosting', '$5–$30/mo']] };
        }
        if (b.t === 'statecost') {
          const sdc = this.stateData();
          const stc = this.state.commitment && sdc[this.state.commitment.state];
          return { isStateCost: true, hasState: !!stc, noState: !stc, stateName: stc ? stc.name : '', regName: stc ? stc.regName : '', regUrl: stc ? stc.regUrl : '', onEditState: () => this.editCommitment() };
        }
        if (b.t === 'statelinks') {
          const sd = this.stateData();
          const st = this.state.commitment && sd[this.state.commitment.state];
          return { isStateLinks: true, hasState: !!st, noState: !st, stateName: st ? st.name : '', regName: st ? st.regName : '', regUrl: st ? st.regUrl : '', taxName: st ? st.taxName : '', taxUrl: st ? st.taxUrl : '', onEditState: () => this.editCommitment() };
        }
        if (b.t === 'steps') return { isSteps: true, label: b.label, items: b.items.map((s, ii) => ({ n: this.pad2(ii + 1), title: s.title, desc: s.desc, url: s.url || '', hasUrl: !!s.url })) };
        if (b.t === 'resources') return { isResources: true, label: b.label, items: b.items };
        if (b.t === 'avoid') return { isAvoid: true, label: b.label, items: b.items };
        if (b.t === 'datatable') return { isDataTable: true, label: b.label, columns: b.columns, rows: b.rows };
        if (b.t === 'timeline') return { isTimeline: true, label: b.label, items: b.items };
        if (b.t === 'mark') { const ck = !!A[sec.id + ':' + bi + ':0']; return { isMark: true, label: b.label, checked: ck,
          rowStyle: 'display:inline-flex;gap:12px;align-items:center;margin-top:8px;padding:12px 16px;border-radius:var(--radius-md);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out);border:1px solid ' + (ck ? 'var(--forest-600)' : 'var(--border-default)') + ';background:' + (ck ? 'var(--forest-050)' : 'var(--white)') + ';',
          boxStyle: 'display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;border-radius:var(--radius-sm);transition:background var(--dur-fast) var(--ease-out);' + (ck ? 'background:var(--forest-600);color:#fff;border:1.5px solid var(--forest-600);' : 'background:var(--white);border:1.5px solid var(--border-strong);'),
          onClick: () => this.toggleKey(sec.id + ':' + bi + ':0') }; }
        return { isNote: true, label: '', text: '' };
      });
      const hasWhyItems = Array.isArray(sec.whyItems) && sec.whyItems.length > 0;
      current = {
        partTag, sectionNo2: this.pad2(nInPart), title: sec.title, lead: sec.lead, why: sec.why,
        isLesson,
        hasQuestions: sec.questions.length > 0,
        hasLearn: Array.isArray(sec.learn) && sec.learn.length > 0, learn: sec.learn || [],
        hasBlocks: Array.isArray(sec.blocks), blocks: buildBlocks(),
        hasQuestionsLabel: isLesson || sec.part === 5, questionsLabel: isLesson ? 'Your turn — reflect' : (sec.part === 5 ? 'Worksheet prompts' : ''),
        hasTeach: !!sec.teach, teach: sec.teach || '',
        hasQuote: !!sec.quote, quote: sec.quote || '',
        hasIncludes: Array.isArray(sec.includes) && sec.includes.length > 0, includes: sec.includes || [],
        hasWhy: hasWhyItems || !!sec.why, hasWhyItems, whyItems: sec.whyItems || [], hasWhyText: !!sec.why && !hasWhyItems,
        hasOverlook: Array.isArray(sec.overlook) && sec.overlook.length > 0, overlook: sec.overlook || [],
        hasMistakes: !!sec.mistakes, mistakes: sec.mistakes || '',
        hasMethods: !!sec.methods, methods: sec.methods || [],
        questions,
        hasExercise: !!sec.exercise, exercise: sec.exercise || '',
        hasExample: !!sec.example, example: sec.example || '',
        hasStandaloneExample: !!sec.example && !sec.exercise, standaloneExample: sec.example || '',
        exValue: A[exId] || '', exChange: (e) => this.setAnswer(exId, e.target.value),
        isDecision: !!sec.isDecision,
        isPledge: !!sec.isPledge, pledge: sec.pledge || '', pledged: !!A[sec.id + 'pledge'], togglePledge: () => this.togglePledge(sec.id),
        pledgeCardStyle: 'display:flex;gap:14px;align-items:flex-start;margin:30px 0 0;padding:18px 20px;border-radius:var(--radius-lg);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out);' + (A[sec.id + 'pledge'] ? 'background:var(--forest-050);border:1.5px solid var(--forest-600);' : 'background:var(--gold-050);border:1px solid var(--gold-100);'),
        pledgeBoxStyle: 'display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;flex:none;border-radius:var(--radius-sm);margin-top:2px;transition:background var(--dur-fast) var(--ease-out);' + (A[sec.id + 'pledge'] ? 'background:var(--forest-600);color:#fff;border:1.5px solid var(--forest-600);' : 'background:var(--white);border:1.5px solid var(--border-strong);'),
        stepOfTotal: 'Section ' + step + ' of ' + N
      };
    }

    // ----- decision options -----
    const dec = this.state.decision;
    const decDefs = [
      { val: 'go', label: 'Move forward', desc: 'The evidence supports building this. Commit and start.', color: 'var(--forest-600)', bg: 'var(--forest-050)', border: 'var(--forest-100)' },
      { val: 'adjust', label: 'Adjust the idea', desc: 'Promising — but refine the concept before you commit.', color: 'var(--gold-600)', bg: 'var(--gold-050)', border: 'var(--gold-100)' },
      { val: 'stop', label: 'Abandon the idea', desc: 'The signal isn\u2019t there. Free yourself to explore something better.', color: 'var(--red-600)', bg: 'var(--red-050)', border: 'var(--red-100)' }
    ];
    const decisionOptions = decDefs.map(d => {
      const sel = dec === d.val;
      const cardStyle = 'display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:var(--radius-md);cursor:pointer;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out);'
        + (sel ? ('background:' + d.bg + ';border:1.5px solid ' + d.color + ';') : 'background:var(--white);border:1px solid var(--border-default);');
      const dotStyle = 'display:inline-flex;flex:none;width:20px;height:20px;border-radius:99px;'
        + (sel ? ('background:' + d.color + ';box-shadow:inset 0 0 0 4px #fff,0 0 0 1.5px ' + d.color + ';') : 'background:transparent;border:2px solid var(--border-strong);');
      return { label: d.label, desc: d.desc, cardStyle, dotStyle, onClick: () => this.setDecision(d.val) };
    });

    // ----- summary -----
    const decMap = {
      go: { title: 'Move forward', blurb: 'You\u2019ve validated the idea and you\u2019re committed. Turn Part 3 into your build plan and get going.', bg: 'var(--forest-600)', fg: '#fff' },
      adjust: { title: 'Adjust the idea', blurb: 'There\u2019s something here, but the concept needs refining. Revisit the weak sections, then re-test.', bg: 'var(--gold-500)', fg: 'var(--navy-900)' },
      stop: { title: 'Abandon the idea', blurb: 'The evidence didn\u2019t hold up — and that\u2019s a win. You saved time and money to chase a stronger idea.', bg: 'var(--navy-700)', fg: '#fff' }
    };
    const decInfo = decMap[dec] || { title: 'Not decided yet', blurb: 'Finish the go-or-no-go section to lock in your call.', bg: 'var(--cream-100)', fg: 'var(--navy-700)' };
    const decisionBannerStyle = 'margin:28px 0 0;border-radius:var(--radius-lg);padding:24px;background:' + decInfo.bg + ';color:' + decInfo.fg + ';'
      + (dec ? '' : 'border:1px solid var(--border-default);');

    const checkItems = [
      'A real problem exists', 'Customers want a solution', 'Customers will pay',
      'A market opportunity exists', 'Profit potential exists', 'An MVP can be built quickly'
    ];
    const dn = (id) => { const s = S.find(x => x.id === id); return s ? this.isDone(s) : false; };
    const checkDone = [dn('p1s2'), dn('p1s6'), dn('p1s7'), dn('p1s9'), dn('p1s9'), dn('p1s11')];
    const decIdx = S.findIndex(x => x.isDecision);
    const decisionStep = decIdx >= 0 ? decIdx + 1 : 1;
    const checklist = checkItems.map((text, i) => {
      const d = checkDone[i];
      const markStyle = 'display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;flex:none;border-radius:99px;'
        + (d ? 'background:var(--forest-600);color:#fff;' : 'background:var(--cream-100);color:var(--sand-300);border:1px solid var(--border-default);');
      return { text, markStyle };
    });

    const incomplete = [];
    S.forEach((sec, i) => { if (!this.isDone(sec)) incomplete.push({ title: sec.title, onClick: () => this.go(i + 1) }); });

    const hasProgress = completed > 0 || step > 0 || !!dec || Object.keys(A).length > 0;

    // ----- app shell / commitment / responsive -----
    this._pct = pct;
    const isMobile = this.state.isMobile;
    const navOpen = this.state.navOpen;
    const commitment = this.state.commitment;
    const account = this.state.account;
    const needAccount = !account;
    const onboarded = !!commitment && !!account;
    const editing = this.state.editing;
    const isOnboarding = needAccount || !commitment || editing;
    const isAccountScreen = needAccount;
    const isCommitScreen = !needAccount && (!commitment || editing);
    const showApp = !isOnboarding;
    const view = this.state.view;
    const viewConsult = showApp && view === 'consult';
    const viewHowto = showApp && view === 'howto';
    const viewKb = showApp && view === 'kb';
    const viewLegal = showApp && view === 'legal';
    const rootStyle = 'height:100vh;width:100%;overflow:hidden;background:var(--cream-50);position:relative;';
    const asideStyle = isMobile
      ? 'position:fixed;top:0;left:0;bottom:0;width:300px;max-width:84vw;background:var(--white);border-right:1px solid var(--border-default);display:flex;flex-direction:column;z-index:55;box-shadow:var(--shadow-xl);transition:transform 250ms var(--ease-out);transform:translateX(' + (navOpen ? '0' : '-101%') + ');'
      : 'width:320px;flex:none;background:var(--white);border-right:1px solid var(--border-default);display:flex;flex-direction:column;height:100%;';
    const scrimOn = isMobile && navOpen;
    const introPad = isMobile ? '36px 18px 110px' : '72px 48px 80px';
    const secPad = isMobile ? '24px 18px 110px' : '48px 48px 64px';
    const sumPad = isMobile ? '36px 18px 110px' : '64px 48px 80px';
    const introGrid = isMobile ? '1fr' : 'repeat(2,1fr)';
    const onbPad = isMobile ? '36px 18px 64px' : '60px 32px 64px';

    let commitmentLabel = '';
    if (commitment) {
      if (commitment.mode === 'date' && commitment.date) {
        const dt = new Date(commitment.date + 'T00:00:00');
        commitmentLabel = 'Launch by ' + dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      } else if (commitment.mode === 'hours') { commitmentLabel = commitment.hours + ' hrs / week'; }
    }
    const hasCommitment = !!commitmentLabel;
    const remindLabel = commitment && commitment.reminders ? ('Reminder at ' + (commitment.reminderTime || '09:00')) : 'Reminders off';
    const stName = (commitment && this.stateData()[commitment.state]) ? this.stateData()[commitment.state].name : '';

    const onb = this.state.onb;
    const onbModeDate = onb.mode === 'date';
    const onbModeHours = onb.mode === 'hours';
    const segBtn = (active) => 'flex:1;display:inline-flex;align-items:center;justify-content:center;height:46px;border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-sans);font-weight:600;font-size:14px;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out);border:1px solid ' + (active ? 'var(--navy-700)' : 'var(--border-strong)') + ';background:' + (active ? 'var(--navy-700)' : 'var(--white)') + ';color:' + (active ? '#fff' : 'var(--navy-700)') + ';';
    const remToggleStyle = 'position:relative;width:46px;height:26px;border-radius:99px;flex:none;cursor:pointer;transition:background var(--dur-base) var(--ease-out);background:' + (onb.reminders ? 'var(--forest-600)' : 'var(--sand-300)') + ';';
    const remKnobStyle = 'position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:99px;background:#fff;transition:transform var(--dur-base) var(--ease-out);transform:translateX(' + (onb.reminders ? '20px' : '0') + ');box-shadow:0 1px 2px rgba(0,0,0,.2);';
    const onbValid = (onbModeHours ? (Number(onb.hours) > 0) : !!onb.date) && !!onb.state;
    const ctaStyle = 'display:inline-flex;align-items:center;justify-content:center;gap:.5rem;width:100%;height:52px;border-radius:var(--radius-md);background:var(--navy-700);color:#fff;font-family:var(--font-sans);font-weight:600;font-size:var(--text-md);border:1px solid transparent;cursor:' + (onbValid ? 'pointer' : 'not-allowed') + ';opacity:' + (onbValid ? '1' : '.5') + ';transition:background var(--dur-fast) var(--ease-out);';

    // ----- account screen -----
    const acct = this.state.acct;
    const acctValid = this.acctValid();
    const acctCtaStyle = 'display:inline-flex;align-items:center;justify-content:center;gap:.5rem;width:100%;height:52px;border-radius:var(--radius-md);background:var(--navy-700);color:#fff;font-family:var(--font-sans);font-weight:600;font-size:var(--text-md);border:1px solid transparent;cursor:' + (acctValid ? 'pointer' : 'not-allowed') + ';opacity:' + (acctValid ? '1' : '.5') + ';transition:background var(--dur-fast) var(--ease-out);';
    const acctReview = [
      { label: 'Full name', value: acct.fullName },
      { label: 'Business name', value: acct.businessName },
      { label: 'Industry', value: acct.industry },
      { label: 'Business type', value: acct.bizType },
      { label: 'Email', value: acct.email },
      { label: 'Phone', value: acct.phone }
    ];
    const acctOut = account ? [
      { label: 'Account #', value: account.accountNo },
      { label: 'Full name', value: account.fullName },
      { label: 'Business name', value: account.businessName },
      { label: 'Industry', value: account.industry },
      { label: 'Business type', value: account.bizType },
      { label: 'Email', value: account.email },
      { label: 'Phone', value: account.phone }
    ] : [];

    // ----- resource nav styles -----
    const resNav = (active) => 'display:flex;align-items:center;gap:11px;padding:11px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:13px;font-weight:600;transition:background var(--dur-fast) var(--ease-out);' + (active ? 'background:var(--cream-100);color:var(--navy-700);' : 'color:var(--ink-600);');
    const consultNavStyle = resNav(view === 'consult');
    const howtoNavStyle = resNav(view === 'howto');
    const kbNavStyle = resNav(view === 'kb');
    const legalNavStyle = resNav(view === 'legal');

    // ----- resource content -----
    const howtoSteps = [
      { n: '1', title: 'Create your account', body: 'Enter your full name, business name, industry, business type, email, and phone. Verify the details \u2014 once confirmed they\u2019re locked to your account and used everywhere in the app.' },
      { n: '2', title: 'Make your commitment', body: 'Set a launch target date or weekly hours, choose your state, and turn on daily reminders so you stay on track.' },
      { n: '3', title: 'Work through the seven parts', body: 'Open each section, read the short lesson, and answer the prompts. Your answers save automatically on this device as you go.' },
      { n: '4', title: 'Watch your progress', body: 'The overview and sidebar show how many sections you\u2019ve completed. Aim for a little progress most days \u2014 it adds up fast.' },
      { n: '5', title: 'Get daily encouragement', body: 'If reminders are on, you\u2019ll get a daily nudge with an affirmation and your progress so you never lose momentum on a missed task.' },
      { n: '6', title: 'Reach the decision point', body: 'The Summary & decision page reviews your validation checklist and helps you make a confident go-or-no-go call.' },
      { n: '7', title: 'Book a one-on-one', body: 'When you want a real person across the table, open Book a consultation \u2014 your account details fill the request automatically.' }
    ];
    const kbArticles = [
      { q: 'How is my information stored?', a: 'Your workbook answers, commitment, and account details are saved locally on this device so your work is always here when you return. Booking a consultation sends your details to Across the Table by email.' },
      { q: 'Why can\u2019t I change my business details?', a: 'Your name, business name, industry, and business type are locked after you verify them at sign-up. This keeps each account tied to one business. To use the app for another business, you\u2019ll need a separate licensing term \u2014 contact info@acrossthetable.biz.' },
      { q: 'How do daily reminders work?', a: 'When reminders are on, the app sends a daily notification at the time you chose, including an affirmation and your progress, so a missed task never stalls you. You can change the time or turn reminders off from the commitment screen.' },
      { q: 'Can I use this for more than one business?', a: 'Each purchase covers a single business. If you\u2019d like to run multiple businesses through the app, purchase an additional licensing term at AcrosstheTable.biz or email us.' },
      { q: 'How do I book a one-on-one consultation?', a: 'Open Book a consultation in the sidebar and tap the button \u2014 it opens an email to info@acrossthetable.biz pre-filled with your business name, contact details, and account number.' },
      { q: 'How do I get help?', a: 'Email info@acrossthetable.biz or visit AcrosstheTable.biz. We\u2019re real people and we read every message.' }
    ];
    const legalDocs = [
      { title: 'Terms of Service', updated: 'Effective on first use', paras: [
        'Welcome to the Across the Table Founder\u2019s Workbook (the \u201CApp\u201D). By creating an account or using the App you agree to these Terms of Service.',
        'License to use. We grant you a limited, non-exclusive, non-transferable license to use the App for one business per account, for your own internal business-planning purposes.',
        'You may not: reverse engineer, decompile, or attempt to derive the source code of the App; copy, reproduce, or replicate the workbook structure, templates, prompts, or workflow; resell, sublicense, rent, or redistribute the App or its content; or remove any proprietary notices.',
        'Each account is tied to a single business. Using the App for additional businesses requires a separate licensing term. Contact info@acrossthetable.biz to purchase additional licenses.',
        'The App provides general educational guidance only and is not legal, tax, accounting, or financial advice. Always confirm requirements and fees with the relevant government agency or a licensed professional.',
        'We may update these Terms from time to time. Continued use after changes means you accept the updated Terms.'
      ] },
      { title: 'Privacy Policy', updated: 'Effective on first use', paras: [
        'We respect your privacy. This policy explains what we collect and how we use it.',
        'Information you provide. When you create an account you provide your full name, business name, industry, business type, email, and phone number. Your workbook answers and commitment settings are also stored.',
        'Where it lives. Your account details and workbook answers are stored locally on your device. We do not sell your information.',
        'When you share it. If you book a consultation, your details are sent to Across the Table by email so we can respond. If you enable reminders, notifications are generated on your device.',
        'Your choices. You can turn reminders off at any time. You can clear your local data by using \u201CStart over\u201D or clearing your browser/app storage.',
        'Questions? Contact info@acrossthetable.biz.'
      ] },
      { title: 'Software License Agreement', updated: 'Effective on first use', paras: [
        'This Software License Agreement governs your use of the App and is in addition to the Terms of Service.',
        'Ownership. The App, including its design, code, workbook content, templates, prompts, and underlying logic, is the exclusive property of Across the Table Small Business Consulting and is protected by intellectual-property law.',
        'Restrictions. You may not copy workflows, templates, or structure; resell or replicate the system logic; or reverse engineer any part of the App.',
        'Single-business license. Your license permits use for one business. Multi-business use requires a separate paid licensing term.',
        'Termination. We may suspend or terminate your license if you violate this Agreement or the Terms of Service.',
        'No warranty. The App is provided \u201Cas is\u201D without warranties of any kind. To the fullest extent permitted by law, Across the Table is not liable for any business decisions made using the App.'
      ] }
    ];


    return {
      progressPct: pct, completedCount: completed, totalSections: N,
      isIntro, isSection, isSummary,
      navRows, overviewStyle, summaryStyle,
      parts, greeting, ringC, ringOffset,
      onOverview: () => this.go(0), onSummary: () => this.go(N + 1),
      current, decisionOptions,
      start: () => this.go(step > 0 && step <= N ? step : 1),
      startLabel: hasProgress ? 'Continue where you left off' : 'Start the workbook',
      hasProgress, reset: () => this.reset(),
      next: () => this.go(step >= N ? N + 1 : step + 1),
      back: () => this.go(step <= 1 ? 0 : step - 1),
      nextLabel: step === N ? 'Review & finish' : 'Next section',
      // summary
      decisionBannerStyle, decisionTitle: decInfo.title, decisionBlurb: decInfo.blurb,
      needsDecision: !dec, goDecision: () => this.go(decisionStep),
      checklist, incomplete, hasIncomplete: incomplete.length > 0,
      allDone: completed === N,
      backToWork: () => this.go(step === N + 1 ? N : 1),
      // shell + responsive
      isMobile, navOpen, toggleNav: () => this.toggleNav(), closeNav: () => this.closeNav(),
      rootStyle, asideStyle, scrimOn, showApp, isOnboarding,
      introPad, secPad, sumPad, introGrid, onbPad,
      hasCommitment, commitmentLabel, remindLabel, onEdit: () => this.editCommitment(),
      // onboarding
      editing,
      // account
      isAccountScreen, isCommitScreen,
      acctStepForm: this.state.acctStep === 'form', acctStepVerify: this.state.acctStep === 'verify',
      acctFullName: acct.fullName, acctBusinessName: acct.businessName, acctIndustry: acct.industry, acctBizType: acct.bizType, acctEmail: acct.email, acctPhone: acct.phone,
      setAcctName: (e) => this.setAcct({ fullName: e.target.value }),
      setAcctBiz: (e) => this.setAcct({ businessName: e.target.value }),
      setAcctIndustry: (e) => this.setAcct({ industry: e.target.value }),
      setAcctType: (e) => this.setAcct({ bizType: e.target.value }),
      setAcctEmail: (e) => this.setAcct({ email: e.target.value }),
      setAcctPhone: (e) => this.setAcct({ phone: e.target.value }),
      industryOptions: this.industries(), bizTypeOptions: this.bizTypes(),
      acctValid, acctCtaStyle,
      reviewAccount: () => this.reviewAccount(),
      confirmAccount: () => this.confirmAccount(),
      backToAcctForm: () => this.backToAcctForm(),
      acctReview,
      // extra views
      viewConsult, viewHowto, viewKb, viewLegal,
      openConsult: () => this.openView('consult'),
      openHowto: () => this.openView('howto'),
      openKb: () => this.openView('kb'),
      openLegal: () => this.openView('legal'),
      consultNavStyle, howtoNavStyle, kbNavStyle, legalNavStyle,
      acct: acctOut, hasAccount: !!account,
      bizName: account ? account.businessName : '',
      consultMailtoHref: account ? this.consultMailto() : 'mailto:info@acrossthetable.biz',
      affirmationText: this.todaysAffirmation(),
      howtoSteps, kbArticles, legalDocs,
      onbName: onb.name, onbModeDate, onbModeHours, onbHours: onb.hours, onbDate: onb.date, onbTime: onb.time, onbReminderTime: onb.reminderTime, onbReminders: onb.reminders,
      onbState: onb.state, stateOptions: this.stateOptions(), stateName: stName,
      onbSetState: (e) => this.setOnb({ state: e.target.value }),
      segDateStyle: segBtn(onbModeDate), segHoursStyle: segBtn(onbModeHours), remToggleStyle, remKnobStyle, ctaStyle, onbValid,
      setName: (e) => this.setOnb({ name: e.target.value }),
      setModeDate: () => this.setOnb({ mode: 'date' }),
      setModeHours: () => this.setOnb({ mode: 'hours' }),
      setHours: (e) => this.setOnb({ hours: e.target.value }),
      setDate: (e) => this.setOnb({ date: e.target.value }),
      setTime: (e) => this.setOnb({ time: e.target.value }),
      setReminderTime: (e) => this.setOnb({ reminderTime: e.target.value }),
      toggleReminders: () => this.setOnb({ reminders: !this.state.onb.reminders }),
      startWorkbook: () => { var s = this.state.onb; if (!!s.state && (s.mode === 'hours' ? Number(s.hours) > 0 : !!s.date)) this.startWorkbook(); },
      onbCtaLabel: editing ? 'Save commitment' : 'Start the workbook'
    };
  }
}
