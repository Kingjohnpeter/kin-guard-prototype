// Mock in-memory API for prototype (frontend)
// Uses internal uuid generator to avoid external deps

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const units = [
  { unit_id: 'U1', unit_code: 'P-247', commune_id: 'Ngaliema', location: {lat:-4.345, lon:15.266}, status:'available' },
  { unit_id: 'U2', unit_code: 'P-248', commune_id: 'Kintambo', location: {lat:-4.321, lon:15.260}, status:'available' },
];

let incidents = []; // { kg_id, reporter_user_id, created_at, location, nature, priority, status, tracks, assignment }

export function loginMock(username, password) {
  const users = {
    'alice@citoyen': { userId:'U_cit_1', role:'citoyen', username:'Alice' },
    'police1': { userId:'U_pol_1', role:'policier', username:'Police One', unit_id:'U1', numero_ordre:'P-247' },
    'comm1': { userId:'U_comm_1', role:'commissaire', username:'Comm Commune', commune_id:'Ngaliema', numero_ordre:'C-101' },
    'general': { userId:'U_gen_1', role:'commissaire_general', username:'General', numero_ordre:'CG-1' }
  };
  const user = users[username];
  if (user && password === '1234') return { ok:true, user };
  return { ok:false, error:'Invalid credentials' };
}

export function createIncident(reporter_user_id, location, nature='Demande d\'aide', priority='normal') {
  const kg_id = 'KG-' + Math.floor(10000 + Math.random()*90000);
  const now = new Date().toISOString();
  const incident = {
    kg_id, reporter_user_id, created_at: now, location, kin_code:null, nature, priority, status:'Nouveau',
    tracks:[{timestamp:now, action:'Signalement reçu', actor:'system'}],
    assignment:null
  };
  incidents.push(incident);
  return incident;
}

export function listIncidentsForUser(user) {
  if (user.role === 'citoyen') {
    return incidents.filter(i => i.reporter_user_id === user.userId);
  }
  if (user.role === 'policier') {
    return incidents.filter(i => i.assignment && i.assignment.unit_id === user.unit_id);
  }
  if (user.role === 'commissaire') {
    return incidents.filter(i => (i.assignment && units.find(u=>u.unit_id===i.assignment.unit_id)?.commune_id === user.commune_id) || false);
  }
  if (user.role === 'commissaire_general') {
    return incidents;
  }
  return [];
}

function haversine(a,b){
  const R = 6371;
  const toRad = d => d * Math.PI/180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const hav = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(hav));
}

export function autoAssign(kg_id) {
  const incident = incidents.find(i=>i.kg_id===kg_id);
  if (!incident) return null;
  const candidates = units.filter(u => u.status === 'available').map(u => ({...u, dist: haversine({lat:incident.location.lat,lon:incident.location.lon}, {lat:u.location.lat,lon:u.location.lon})}));
  candidates.sort((a,b)=>a.dist - b.dist);
  const chosen = candidates[0];
  if (!chosen) return null;
  const assign = { assignment_id: uuidv4(), kg_id, unit_id:chosen.unit_id, assigned_by:'system', method:'auto', assigned_at:new Date().toISOString(), eta: Math.round(chosen.dist*2) + ' min' };
  incident.assignment = assign;
  incident.tracks.push({timestamp:new Date().toISOString(), action:'Affectation automatique', actor:'system', details:assign});
  incident.status = 'Affecté';
  chosen.status = 'en_route';
  return assign;
}

export function getIncident(kg_id) {
  return incidents.find(i=>i.kg_id===kg_id);
}
