export const dashboardStats = {
  users: { value: 12847, change: 12.4, label: 'Total users' },
  revenue: { value: 482900, change: 8.2, label: 'Revenue (YTD)' },
  orders: { value: 3842, change: -2.1, label: 'Orders' },
}

export const revenueSeries = [
  { name: 'Jan', revenue: 42000, orders: 320 },
  { name: 'Feb', revenue: 38000, orders: 290 },
  { name: 'Mar', revenue: 51000, orders: 410 },
  { name: 'Apr', revenue: 47000, orders: 360 },
  { name: 'May', revenue: 62000, orders: 480 },
  { name: 'Jun', revenue: 58000, orders: 440 },
]

const USERS_BASE = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.io',
    role: 'admin',
    status: 'active',
    joined: '2024-06-12',
    department: 'Engineering',
    avatarUrl: null,
  },
  {
    id: '2',
    name: 'Marcus Webb',
    email: 'marcus@acme.io',
    role: 'user',
    status: 'active',
    joined: '2024-08-01',
    department: 'Sales',
    avatarUrl: null,
  },
  {
    id: '3',
    name: 'Elena Rossi',
    email: 'elena.r@acme.io',
    role: 'user',
    status: 'inactive',
    joined: '2023-11-20',
    department: 'Marketing',
    avatarUrl: null,
  },
  {
    id: '4',
    name: 'James Okonkwo',
    email: 'j.okonkwo@acme.io',
    role: 'user',
    status: 'active',
    joined: '2025-01-05',
    department: 'Support',
    avatarUrl: null,
  },
  {
    id: '5',
    name: 'Priya Nair',
    email: 'priya@acme.io',
    role: 'admin',
    status: 'active',
    joined: '2024-02-28',
    department: 'Operations',
    avatarUrl: null,
  },
  {
    id: '6',
    name: 'Tomás Silva',
    email: 'tomas@acme.io',
    role: 'user',
    status: 'active',
    joined: '2024-09-15',
    department: 'Engineering',
    avatarUrl: null,
  },
  {
    id: '7',
    name: 'Yuki Tanaka',
    email: 'yuki@acme.io',
    role: 'user',
    status: 'inactive',
    joined: '2023-07-08',
    department: 'Design',
    avatarUrl: null,
  },
  {
    id: '8',
    name: 'Olivia Hart',
    email: 'olivia@acme.io',
    role: 'user',
    status: 'active',
    joined: '2025-02-11',
    department: 'Sales',
    avatarUrl: null,
  },
]

const EXTRA_FIRST = [
  'Noah',
  'Emma',
  'Liam',
  'Ava',
  'Mason',
  'Sophia',
  'Ethan',
  'Isabella',
  'Lucas',
  'Mia',
  'Oliver',
  'Charlotte',
]
const EXTRA_LAST = [
  'Brooks',
  'Reed',
  'Cole',
  'Fox',
  'Hayes',
  'West',
  'Porter',
  'Blair',
  'Rhodes',
  'Spencer',
  'Knight',
  'Vaughn',
]
const DEPTS = ['Engineering', 'Sales', 'Marketing', 'Support', 'Operations', 'Design', 'Finance', 'HR']

function ymd(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** 50 realistic rows for pagination / bulk demos; @acme.io emails preserved. */
export const usersSeed = (() => {
  const out = USERS_BASE.map((u) => ({ ...u, createdAt: u.joined }))
  for (let i = out.length; i < 50; i++) {
    const fi = i % EXTRA_FIRST.length
    const li = (i * 3) % EXTRA_LAST.length
    const name = `${EXTRA_FIRST[fi]} ${EXTRA_LAST[li]}`
    const slug = `${EXTRA_FIRST[fi]}${EXTRA_LAST[li]}`.toLowerCase()
    const month = (i % 12) + 1
    const day = Math.min((i % 28) + 1, 28)
    const year = 2023 + (i % 3)
    const joined = ymd(year, month, day)
    out.push({
      id: String(i + 1),
      name,
      email: `${slug}${i}@acme.io`,
      role: i % 8 === 1 ? 'admin' : 'user',
      status: i % 6 === 2 ? 'inactive' : 'active',
      joined,
      createdAt: joined,
      department: DEPTS[i % DEPTS.length],
      avatarUrl: null,
    })
  }
  return out
})()

export const productsSeed = [
  {
    id: 'p1',
    name: 'Analytics Pro',
    sku: 'NX-APL-01',
    price: 149,
    stock: 120,
    category: 'Software',
  },
  {
    id: 'p2',
    name: 'Team Seats (10)',
    sku: 'NX-TS-10',
    price: 499,
    stock: 45,
    category: 'License',
  },
  {
    id: 'p3',
    name: 'API Credits Pack',
    sku: 'NX-API-5K',
    price: 79,
    stock: 200,
    category: 'Add-on',
  },
  {
    id: 'p4',
    name: 'Onboarding Session',
    sku: 'NX-ONB-1',
    price: 899,
    stock: 8,
    category: 'Services',
  },
]

export const activityLogsSeed = [
  {
    id: 'a1',
    action: 'User invited',
    actor: 'Sarah Chen',
    target: 'new@client.com',
    at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'a2',
    action: 'Plan upgraded',
    actor: 'Marcus Webb',
    target: 'Acme Retail',
    at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: 'a3',
    action: 'API key rotated',
    actor: 'Priya Nair',
    target: 'Production',
    at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'a4',
    action: 'Invoice paid',
    actor: 'System',
    target: '#INV-2048',
    at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'a5',
    action: 'Role changed',
    actor: 'Sarah Chen',
    target: 'Elena Rossi → user',
    at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
]

export const notificationsSeed = [
  {
    id: 'n1',
    title: 'New enterprise lead',
    body: 'Northwind submitted a demo request.',
    read: false,
    at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'n2',
    title: 'Deployment succeeded',
    body: 'api-gateway v2.4.1 is live.',
    read: false,
    at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'n3',
    title: 'Weekly digest',
    body: 'Usage up 6% vs last week.',
    read: true,
    at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
]
