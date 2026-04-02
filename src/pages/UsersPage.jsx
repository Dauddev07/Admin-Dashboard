import { useCallback, useEffect, useMemo, useState } from 'react'
import { usersSeed } from '../data/mockData.js'
import { mockRequest } from '../utils/mockApi.js'
import { formatCreatedAt, getInitials } from '../utils/format.js'
import { useToast } from '../context/ToastContext.jsx'
import { AdminRoute } from '../components/RoleGuard.jsx'
import { Breadcrumb } from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, CardHeader } from '../components/ui/Card.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { TableRowSkeleton } from '../components/ui/Skeleton.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'

function StatusPill({ active }) {
  return (
    <span className={`status-pill ${active ? 'status-pill--active' : 'status-pill--inactive'}`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function UserAvatar({ name, url }) {
  if (url) {
    return <img className="user-avatar user-avatar--sm" src={url} alt="" />
  }
  return (
    <span className="user-avatar user-avatar--sm" aria-hidden>
      {getInitials(name)}
    </span>
  )
}

function UsersContent() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewUser, setViewUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [busy, setBusy] = useState(false)
  const [actingId, setActingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await mockRequest(usersSeed, { delayMs: 550 })
      setRows(data)
      setSelectedIds([])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const toggleStatus = useCallback(
    async (id) => {
      const user = rows.find((u) => u.id === id)
      if (!user) return
      setActingId(id)
      try {
        await mockRequest(null, { delayMs: 450 })
        const next = user.status === 'active' ? 'inactive' : 'active'
        setRows((prev) => prev.map((u) => (u.id === id ? { ...u, status: next } : u)))
        toast.success(
          next === 'active' ? `${user.name} is now active.` : `${user.name} has been deactivated.`,
        )
      } catch {
        toast.error('Could not update user status')
      } finally {
        setActingId(null)
      }
    },
    [rows, toast],
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteUser) return
    setBusy(true)
    try {
      await mockRequest(null, { delayMs: 400 })
      setRows((prev) => prev.filter((u) => u.id !== deleteUser.id))
      setSelectedIds((s) => s.filter((x) => x !== deleteUser.id))
      toast.success(`${deleteUser.name} removed from the workspace.`)
      setDeleteUser(null)
    } catch {
      toast.error('Delete failed')
    } finally {
      setBusy(false)
    }
  }, [deleteUser, toast])

  const confirmBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return
    setBusy(true)
    try {
      await mockRequest(null, { delayMs: 500 })
      const set = new Set(selectedIds)
      setRows((prev) => prev.filter((u) => !set.has(u.id)))
      toast.success(`${selectedIds.length} users deleted (simulated).`)
      setSelectedIds([])
      setBulkDeleteOpen(false)
    } catch {
      toast.error('Bulk delete failed')
    } finally {
      setBusy(false)
    }
  }, [selectedIds, toast])

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'User',
        sortable: true,
        render: (row) => (
          <div className="user-cell">
            <UserAvatar name={row.name} url={row.avatarUrl} />
            <div>
              <div className="user-cell__name">{row.name}</div>
              <div className="user-cell__email">{row.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        sortable: true,
        render: (row) => <span className="text-capitalize">{row.role}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row) => <StatusPill active={row.status === 'active'} />,
      },
      {
        key: 'createdAt',
        header: 'Created at',
        sortable: true,
        render: (row) => formatCreatedAt(row.createdAt || row.joined),
      },
      {
        key: 'actions',
        header: '',
        render: (row) => {
          const isActive = row.status === 'active'
          const busyRow = actingId === row.id
          return (
            <div className="flex-gap">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                title="View profile details"
                disabled={busyRow}
                onClick={() => setViewUser(row)}
              >
                View
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                title={isActive ? 'Deactivate this user' : 'Activate this user'}
                disabled={busyRow}
                onClick={() => toggleStatus(row.id)}
              >
                {busyRow ? '…' : isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                title="Permanently remove user"
                disabled={busyRow}
                onClick={() => setDeleteUser(row)}
              >
                Delete
              </Button>
            </div>
          )
        },
      },
    ],
    [actingId, toggleStatus],
  )

  const searchKeys = ['name', 'email', 'department', 'role']

  const items = [
    { label: 'Dashboard', to: '/' },
    { label: 'Users' },
  ]

  const bulkBar =
    selectedIds.length > 0 ? (
      <Button type="button" variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>
        Delete selected ({selectedIds.length})
      </Button>
    ) : null

  return (
    <div>
      <Breadcrumb items={items} />
      <Card>
        <CardHeader
          title="User management"
          subtitle="Search is debounced. Select rows for bulk delete. All changes are simulated locally."
          action={
            <Button type="button" variant="secondary" size="sm" onClick={load} disabled={loading} title="Reload data">
              Refresh
            </Button>
          }
        />
        {loading ? (
          <table className="skeleton-table data-table">
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TableRowSkeleton key={i} cols={6} />
              ))}
            </tbody>
          </table>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No users yet"
            description="The directory is empty. Refresh to reload demo data from the mock API."
            actionLabel="Reload users"
            onAction={load}
          />
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            searchKeys={searchKeys}
            searchPlaceholder="Search users by name, email, department, or role…"
            searchAriaLabel="Search users on this page"
            filterKey="status"
            filterOptions={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            initialSort={{ key: 'name', dir: 'asc' }}
            debounceMs={320}
            entityLabelPlural="users"
            selection={{
              selectedIds,
              onChange: setSelectedIds,
              rowIdKey: 'id',
            }}
            bulkActions={bulkBar}
            emptyMessage="No users match your search or filters."
          />
        )}
      </Card>

      <Modal
        open={!!viewUser}
        title={viewUser ? viewUser.name : ''}
        onClose={() => setViewUser(null)}
        footer={
          <Button type="button" onClick={() => setViewUser(null)}>
            Close
          </Button>
        }
      >
        {viewUser && (
          <dl className="dl-grid">
            <div>
              <dt>Email</dt>
              <dd>{viewUser.email}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{viewUser.department}</dd>
            </div>
            <div>
              <dt>Created at</dt>
              <dd>{formatCreatedAt(viewUser.createdAt || viewUser.joined)}</dd>
            </div>
          </dl>
        )}
      </Modal>

      <Modal
        open={!!deleteUser}
        title="Delete user?"
        onClose={() => !busy && setDeleteUser(null)}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setDeleteUser(null)} disabled={busy}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={confirmDelete} disabled={busy}>
              {busy ? 'Deleting…' : 'Delete user'}
            </Button>
          </>
        }
      >
        <p className="modal-copy">
          {deleteUser && (
            <>
              Are you sure you want to remove <strong>{deleteUser.name}</strong> ({deleteUser.email})? This action is
              simulated and can be undone by refreshing the page.
            </>
          )}
        </p>
      </Modal>

      <Modal
        open={bulkDeleteOpen}
        title={`Delete ${selectedIds.length} users?`}
        wide
        onClose={() => !busy && setBulkDeleteOpen(false)}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setBulkDeleteOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={confirmBulkDelete} disabled={busy}>
              {busy ? 'Deleting…' : `Delete ${selectedIds.length} users`}
            </Button>
          </>
        }
      >
        <p className="modal-copy">
          This will remove {selectedIds.length} selected accounts from the workspace (simulated). This cannot be undone
          in a real system.
        </p>
      </Modal>
    </div>
  )
}

export default function UsersPage() {
  return (
    <AdminRoute>
      <UsersContent />
    </AdminRoute>
  )
}
