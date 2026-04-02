import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Breadcrumb } from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, CardHeader } from '../components/ui/Card.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Select } from '../components/ui/Input.jsx'

export default function SettingsPage() {
  const { user, setUser, setRole } = useAuth()
  const [profile, setProfile] = useState({ name: user.name, email: user.email })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [saved, setSaved] = useState(false)

  const items = [
    { label: 'Dashboard', to: '/' },
    { label: 'Settings' },
  ]

  const saveProfile = (e) => {
    e.preventDefault()
    setUser((u) => ({ ...u, name: profile.name, email: profile.email }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const savePassword = (e) => {
    e.preventDefault()
    setPassword({ current: '', next: '', confirm: '' })
    alert('Password change simulated — no data is sent.')
  }

  return (
    <div>
      <Breadcrumb items={items} />
      <h1 className="page-title settings-page-title">Settings</h1>

      <div className="settings-stack">
        <Card padding="md">
          <CardHeader title="Role preview" subtitle="Switch roles to see admin vs standard user navigation and permissions." />
          <Select
            label="Current role (demo)"
            value={user.role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Administrator</option>
            <option value="user">Standard user</option>
          </Select>
          <p className="role-hint">
            Users lose access to Users and Activity in the sidebar; product editing is read-only.
          </p>
        </Card>

        <Card padding="md">
          <CardHeader title="Profile" subtitle="Update display information (local state only)." />
          <form className="form-grid" onSubmit={saveProfile}>
            <Input label="Full name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} required />
            <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} required />
            <div>
              <Button type="submit">Save profile</Button>
              {saved && <span className="saved-badge">Saved</span>}
            </div>
          </form>
        </Card>

        <Card padding="md">
          <CardHeader title="Password" subtitle="UI-only — demonstrates form layout and validation patterns." />
          <form className="form-grid" onSubmit={savePassword}>
            <Input
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={password.current}
              onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
            />
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              value={password.next}
              onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))}
            />
            <Input
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={password.confirm}
              onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
            />
            <Button type="submit" variant="secondary">
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
