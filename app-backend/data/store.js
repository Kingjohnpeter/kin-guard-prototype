// Simple in-memory store for backend prototype
const { v4: uuidv4 } = require('uuid');

const users = {
  'alice@citoyen': { userId:'U_cit_1', role:'citoyen', username:'Alice' },
  'police1': { userId:'U_pol_1', role:'policier', username:'Police One', unit_id:'U1', numero_ordre:'P-247' },
  'comm1': { userId:'U_comm_1', role:'commissaire', username:'Comm Commune', commune_id:'Ngaliema', numero_ordre:'C-101' },
  'general': { userId:'U_gen_1', role:'commissaire_general', username:'General', numero_ordre:'CG-1' }
};

const units = [
  { unit_id: 'U1', unit_code: 'P-247', commune_id: 'Ngaliema', location: {lat:-4.345, lon:15.266}, status:'available' },
  { unit_id: 'U2', unit_code: 'P-248', commune_id: 'Kintambo', location: {lat:-4.321, lon:15.260}, status:'available' },
];

let incidents = []; // stored incidents
let auditLogs = [];

function createIncident(reporter_user_id, location, nature='Demande d\'aide', priority='normal'){
  const kg_id = 'KG-' + Math.floor(10000 + Math.random()*90000);
  const now = new Date().toISOString();
  const incident = { kg_id, reporter_user_id, created_at: now, location, nature, priority, status:'Nouveau', tracks:[{timestamp:now, action:'Signalement reçu', actor:reporter_user_id}], assignment:null };
  incidents.push(incident);
  auditLogs.push({timestamp:now, user:reporter_user_id, action:'create_incident', resource:'incident', resource_id:kg_id});
  return incident;
}

function listIncidentsForUser(user){
  if (user.role === 'citoyen') return incidents.filter(i=>i.reporter_user_id===user.userId);
  if (user.role === 'policier') return incidents.filter(i=>i.assignment && i.assignment.unit_id===user.unit_id);
  if (user.role === 'commissaire') return incidents.filter(i=> (i.assignment && units.find(u=>u.unit_id===i.assignment.unit_id)?.commune_id === user.commune_id) || false);
  if (user.role === 'commissaire_general') return incidents;
  return [];
}

function getIncident(kg_id){
  return incidents.find(i=>i.kg_id===kg_id);
}

function getUnit(unit_id){
  return units.find(u=>u.unit_id===unit_id);
}

module.exports = { users, units, createIncident, listIncidentsForUser, getIncident, getUnit, auditLogs };
