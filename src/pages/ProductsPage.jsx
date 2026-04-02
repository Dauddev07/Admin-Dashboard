import { useCallback, useEffect, useMemo, useState } from 'react'
import { productsSeed } from '../data/mockData.js'
import { mockRequest } from '../utils/mockApi.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatCurrency } from '../utils/format.js'
import { Breadcrumb } from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, CardHeader } from '../components/ui/Card.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { Input, Select } from '../components/ui/Input.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { TableRowSkeleton } from '../components/ui/Skeleton.jsx'

const emptyProduct = { name: '', sku: '', price: '', stock: '', category: 'Software' }

export default function ProductsPage() {
  const { isAdmin } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    const data = await mockRequest(productsSeed, { delayMs: 500 })
    setRows(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    if (!isAdmin) return
    setEditing(null)
    setForm(emptyProduct)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = useCallback((row) => {
    if (!isAdmin) return
    setEditing(row)
    setForm({
      name: row.name,
      sku: row.sku,
      price: String(row.price),
      stock: String(row.stock),
      category: row.category,
    })
    setErrors({})
    setModalOpen(true)
  }, [isAdmin])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (Number.isNaN(price) || price < 0) e.price = 'Valid price required'
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) e.stock = 'Whole number stock required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async () => {
    if (!validate()) return
    setSaving(true)
    await mockRequest(null, { delayMs: 450 })
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
    }
    if (editing) {
      setRows((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p)))
    } else {
      const id = `p${Date.now()}`
      setRows((prev) => [...prev, { id, ...payload }])
    }
    setSaving(false)
    setModalOpen(false)
  }

  const columns = useMemo(
    () => [
      { key: 'name', header: 'Product', sortable: true },
      { key: 'sku', header: 'SKU', sortable: true },
      {
        key: 'price',
        header: 'Price',
        sortable: true,
        render: (row) => formatCurrency(row.price),
      },
      { key: 'stock', header: 'Stock', sortable: true },
      { key: 'category', header: 'Category', sortable: true },
      {
        key: 'actions',
        header: '',
        render: (row) =>
          isAdmin ? (
            <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(row)}>
              Edit
            </Button>
          ) : (
            <span className="text-muted">View only</span>
          ),
      },
    ],
    [isAdmin, openEdit],
  )

  const items = [
    { label: 'Dashboard', to: '/' },
    { label: 'Products' },
  ]

  return (
    <div>
      <Breadcrumb items={items} />
      <Card>
        <CardHeader
          title="Products"
          subtitle={isAdmin ? 'Manage catalog items with a simple modal form.' : 'You can browse products. Editing requires an admin role.'}
          action={
            isAdmin ? (
              <Button type="button" onClick={openCreate} disabled={loading}>
                Add product
              </Button>
            ) : null
          }
        />
        {loading ? (
          <table className="skeleton-table data-table">
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <TableRowSkeleton key={i} cols={6} />
              ))}
            </tbody>
          </table>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No products"
            description={
              isAdmin
                ? 'Add your first product to populate the table.'
                : 'The catalog is empty. Ask an administrator to add items.'
            }
            actionLabel={isAdmin ? 'Add product' : undefined}
            onAction={isAdmin ? openCreate : undefined}
          />
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            searchPlaceholder="Search products by name, SKU, or category…"
            searchAriaLabel="Search products on this page"
            filterKey="category"
            filterOptions={[
              { value: 'Software', label: 'Software' },
              { value: 'License', label: 'License' },
              { value: 'Add-on', label: 'Add-on' },
              { value: 'Services', label: 'Services' },
            ]}
            entityLabelPlural="products"
            debounceMs={300}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit product' : 'Add product'}
        onClose={() => !saving && setModalOpen(false)}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} error={errors.sku} />
          <div className="form-grid form-grid--2col">
            <Input label="Price (USD)" type="number" min="0" step="1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} error={errors.price} />
            <Input label="Stock" type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} error={errors.stock} />
          </div>
          <Select label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            <option value="Software">Software</option>
            <option value="License">License</option>
            <option value="Add-on">Add-on</option>
            <option value="Services">Services</option>
          </Select>
        </div>
      </Modal>
    </div>
  )
}
