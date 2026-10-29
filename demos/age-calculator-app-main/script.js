// Age calculator script
(function(){
  const form = document.getElementById('age-form');
  const dayInput = document.getElementById('day');
  const monthInput = document.getElementById('month');
  const yearInput = document.getElementById('year');

  const yearsEl = document.getElementById('years');
  const monthsEl = document.getElementById('months');
  const daysEl = document.getElementById('days');

  function setError(fieldName, message){
    const el = document.querySelector(`.error[data-for="${fieldName}"]`);
    if(el) el.textContent = message || '';
  }

  function clearErrors(){
    ['day','month','year'].forEach(f => setError(f, ''));
  }

  function isValidDate(y,m,d){
    const dt = new Date(y,m-1,d);
    return dt && dt.getFullYear() === y && (dt.getMonth() === m-1) && dt.getDate() === d;
  }

  function daysInMonth(year, month){
    return new Date(year, month, 0).getDate();
  }

  function calculateAge(fromDate, toDate){
    function utcDate(year, month, day){
      const date = new Date(0);
      date.setUTCFullYear(year, month, day);
      date.setUTCHours(0,0,0,0);
      return date;
    }
    const birthYear = fromDate.getFullYear(), birthMonth = fromDate.getMonth(), birthDay = fromDate.getDate();
    const end = utcDate(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
    let totalMonths = (toDate.getFullYear() - birthYear) * 12 + toDate.getMonth() - birthMonth;
    function anchor(months){
      const first = utcDate(birthYear, birthMonth + months, 1);
      const last = utcDate(first.getUTCFullYear(), first.getUTCMonth() + 1, 0).getUTCDate();
      return utcDate(first.getUTCFullYear(), first.getUTCMonth(), Math.min(birthDay, last));
    }
    if(anchor(totalMonths) > end) totalMonths -= 1;
    return {years: Math.floor(totalMonths / 12), months: totalMonths % 12,
      days: Math.round((end - anchor(totalMonths)) / 86400000)};
  }

  function animateValue(el, start, end, duration=800){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = String(end); return; }
    const startTime = performance.now();
    const range = end - start;
    if(range === 0) { el.textContent = String(end); return; }
    function step(now){
      const t = Math.min(1, (now - startTime)/duration);
      const ease = t<.5 ? 2*t*t : -1 + (4 - 2*t)*t; // easeInOut
      const val = Math.round(start + range * ease);
      el.textContent = String(val);
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearErrors();

    const day = Number(dayInput.value);
    const month = Number(monthInput.value);
    const year = Number(yearInput.value);

    let hasError = false;

    if(!dayInput.value){ setError('day', "This field is required"); hasError = true; }
    if(!monthInput.value){ setError('month', "This field is required"); hasError = true; }
    if(!yearInput.value){ setError('year', "This field is required"); hasError = true; }

    if(hasError) return;

    if(!(Number.isInteger(day) && day >= 1 && day <= 31)){ setError('day', 'Must be a valid day'); hasError = true; }
    if(!(Number.isInteger(month) && month >=1 && month <=12)){ setError('month', 'Must be a valid month'); hasError = true; }
    if(!Number.isInteger(year) || year < 100 || year > new Date().getFullYear()){ setError('year', 'Must be in the past'); hasError = true; }

    if(hasError) return;

    if(!isValidDate(year, month, day)){
      setError('day', 'Must be a valid date');
      setError('month', 'Must be a valid date');
      setError('year', 'Must be a valid date');
      return;
    }

    const birth = new Date(year, month-1, day);
    const now = new Date();
    if(birth > now){ setError('year','Must be in the past'); return; }

    const age = calculateAge(birth, now);

    // animate from current displayed values (if numeric) else from 0
    const currentYears = parseInt(yearsEl.textContent, 10);
    const currentMonths = parseInt(monthsEl.textContent, 10);
    const currentDays = parseInt(daysEl.textContent, 10);

    animateValue(yearsEl, Number.isFinite(currentYears) ? currentYears : 0, age.years);
    animateValue(monthsEl, Number.isFinite(currentMonths) ? currentMonths : 0, age.months);
    animateValue(daysEl, Number.isFinite(currentDays) ? currentDays : 0, age.days);
  });

})();

