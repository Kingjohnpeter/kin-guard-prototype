// Simple mock backend for KIN-GUARD prototype
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const store = require('./data/store');
const assigner = require('./services/assigner');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Login
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = store.users[username];
  if (user && password === '1234') {
    return res.json({ ok:true, user });
  }
  return res.status(401).json({ ok:false, error:'Invalid credentials' });
});

// Middleware: simple user loader via header x-username (prototype)
function loadUser(req, res, next) {
  const username = req.header('x-username');
  if (!username) return res.status(401).json({ error:'Missing x-username header (prototype)' });
  const user = store.users[username];
  if (!user) return res.status(401).json({ error:'Unknown user' });
  req.user = user;
  next();
}

// Create incident
app.post('/incidents', loadUser, (req, res) => {
  const { location, nature, priority } = req.body;
  const inc = store.createIncident(req.user.userId, location || {lat:-4.345, lon:15.266}, nature || 'Demande d\'aide', priority || 'normal');
  return res.json(inc);
});

// List incidents according to role
app.get('/incidents', loadUser, (req, res) => {
  const list = store.listIncidentsForUser(req.user);
  res.json(list);
});

// Get incident
app.get('/incidents/:kg_id', loadUser, (req, res) => {
  const inc = store.getIncident(req.params.kg_id);
  if (!inc) return res.status(404).json({ error:'Not found' });
  // server-side RBAC check
  const user = req.user;
  const canView = (() => {
    if (user.role === 'commissaire_general') return true;
    if (user.role === 'citoyen') return inc.reporter_user_id === user.userId;
    if (user.role === 'policier') return inc.assignment && inc.assignment.unit_id === user.unit_id;
    if (user.role === 'commissaire') return inc.assignment && store.getUnit(inc.assignment.unit_id).commune_id === user.commune_id;
    return false;
  })();
  if (!canView) return res.status(403).json({ error:'Access denied' });
  return res.json(inc);
});

// Auto assign
app.post('/assignments/auto', loadUser, (req, res) => {
  const { kg_id } = req.body;
  const inc = store.getIncident(kg_id);
  if (!inc) return res.status(404).json({ error:'Incident not found' });
  // Only commissaire or commissaire_general or centre allowed
  if (!['commissaire','commissaire_general','operateur_centre'].includes(req.user.role)) {
    return res.status(403).json({ error:'Not allowed' });
  }
  const assign = assigner.autoAssign(store, kg_id);
  if (!assign) return res.status(400).json({ error:'No candidate' });
  return res.json(assign);
});

app.get('/units', loadUser, (req, res) => {
  res.json(store.units);
});

app.get('/audit/logs', loadUser, (req, res) => {
  if (req.user.role !== 'commissaire_general') return res.status(403).json({ error:'Access denied' });
  res.json(store.auditLogs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('KIN-GUARD backend mock listening on', PORT));
