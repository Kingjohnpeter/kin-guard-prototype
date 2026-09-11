const haversine = (a,b) => {
  const R = 6371;
  const toRad = d => d * Math.PI/180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const hav = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(hav));
};

module.exports = {
  autoAssign(store, kg_id) {
    const incident = store.getIncident(kg_id);
    if (!incident) return null;
    // filter available units
    const candidates = store.units.filter(u=>u.status==='available').map(u=>({...u, dist: haversine({lat:incident.location.lat, lon:incident.location.lon}, {lat:u.location.lat, lon:u.location.lon})}));
    candidates.sort((a,b)=>a.dist - b.dist);
    const chosen = candidates[0];
    if (!chosen) return null;
    const assign = { assignment_id: require('uuid').v4(), kg_id, unit_id:chosen.unit_id, assigned_by:'system', method:'auto', assigned_at:new Date().toISOString(), eta: Math.round(chosen.dist*2) + ' min' };
    incident.assignment = assign;
    incident.tracks.push({timestamp:new Date().toISOString(), action:'Affectation automatique', actor:'system', details:assign});
    incident.status = 'Affecté';
    // change unit status
    const u = store.units.find(x=>x.unit_id===chosen.unit_id);
    if (u) u.status = 'en_route';
    store.auditLogs.push({timestamp:new Date().toISOString(), user:'system', action:'auto_assign', resource:'incident', resource_id:kg_id, details:assign});
    return assign;
  }
};
