import { signIn, me, get, post } from './supabase-api.js';
const $ = id => document.getElementById(id);

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.querySelector('#loginForm');
    const loginBtn = $('#loginButton');
    if(loginForm || loginBtn){
        const go = async ev => {
            ev && ev.preventDefault();
            const email = ($('#loginEmail')?.value||'').trim();
            const password = ($('#loginPassword')?.value||'').trim();
            try{
                await signIn(email, password);
                const m = await me();
                localStorage.setItem('rolle', m.role||'');
                location.href = '../homepage/index.html';
            }catch(e){ alert(e.message||e); }
        };
        loginForm && loginForm.addEventListener('submit', go);
        loginBtn && loginBtn.addEventListener('click', go);
    }

    const rb = $('#rolleBadge');
    if(rb){
        const m = await me().catch(()=> null);
        rb.textContent = m?.role || 'schueler';
    }

    const uBody = $('#uebungenTbody');
    if(uBody){
        const list = await get('/uebungen').catch(()=> []);
        uBody.innerHTML = list.map(u=>`<tr><td>${u.name}</td><td>${u.zielmuskulatur||''}</td></tr>`).join('');
    }

    const tbForm = $('#tagebuchForm');
    if(tbForm){
        tbForm.addEventListener('submit', async ev=>{
            ev.preventDefault();
            const payload = {
                datum: $('#tb_datum')?.value,
                feedback: $('#tb_feedback')?.value || '',
                eintraege: JSON.parse($('#tb_eintraege_json')?.value || '[]')
            };
            try{
                await post('/tagebuch', payload);
                alert('Eintrag gespeichert');
                tbForm.reset();
            }catch(e){ alert(e.message||e); }
        });
    }
});
