const uid = localStorage.getItem('auth_uid');
if (!uid) location.href = 'index.html';

const ap = JSON.parse(localStorage.getItem('ap_profile'));

async function load(path){ return fetch(path).then(r=>r.json()); }

Promise.all([
  load('data/user.json'),
  load('data/work.json'),
  load('data/documents.json'),
  load('data/duties.json')
]).then(([users, work, docs, duties])=>{

  const me = users.find(u=>u.uid===uid);
  if(!me){ alert('No permission'); return; }

  if(document.getElementById('profile')){
    profile.innerHTML = `
      <p>Name: ${ap.name}</p>
      <p>Employee ID: ${ap.employee_id}</p>
      <p>Organization: ${me.organization}</p>
      <p>Role: ${me.role}</p>
    `;
  }

  if(document.getElementById('work')){
    const list = me.role==='employee'
      ? work.filter(w=>w.employee_id===ap.employee_id)
      : work;

    workDiv = list.map(w=>
      `<div>${w.date} | ${w.hours}h</div>`
    ).join('');
    document.getElementById('work').innerHTML = workDiv;
  }

  if(document.getElementById('docs')){
    document.getElementById('docs').innerHTML = docs
      .filter(d=>d.visible_for.includes(me.role))
      .map(d=>`<a href="${d.file_url}">${d.title}</a>`)
      .join('<br>');
  }

  if(document.getElementById('duties')){
    const d = duties.find(x=>x.role===me.role);
    if(d) dutiesDiv.innerHTML = d.description;
  }

  if(document.getElementById('admin')){
    if(me.role!=='manager'){
      admin.innerHTML='Access denied'; return;
    }
    admin.innerHTML = users.map(u=>
      `<div>${u.uid} - ${u.role}</div>`
    ).join('');
  }
});
