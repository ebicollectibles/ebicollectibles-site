import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { AdminNav } from '~/components/AdminNav'
import { ProductForm, type ProductFormValues } from '~/components/ProductForm'
import { requireAdmin } from '~/server/admin-auth'
import { adminCreateProduct, adminGetProduct } from '~/server/admin'
import type { GoogleCondition, ProductCategory, ProductSubcategory } from '~/lib/products'

const searchSchema = z.object({
  // Prefills the form from an existing product — everything except id,
  // squareVariationId, variantSortOrder and gtin, which must be unique per
  // product and would silently cause real problems if carried over
  // verbatim (a duplicate id errors on save; a duplicate squareVariationId
  // links two products to the same Square catalog item; a duplicate
  // variantSortOrder collides within the group). Set from the "Duplicate"
  // button on the edit page — built for runs of near-identical variants
  // (e.g. 30 keychains) where retyping category/price/variant group every
  // time is most of the slowdown.
  duplicateFrom: z.string().optional(),
})

export const Route = createFileRoute('/admin/products/new')({
  validateSearch: searchSchema,
  beforeLoad: () => requireAdmin(),
  component: NewProductPage,
})

function NewProductPage() {
  const navigate = useNavigate()
  const { duplicateFrom } = Route.useSearch()
  const [source, setSource] = React.useState<Awaited<ReturnType<typeof adminGetProduct>> | null | undefined>(duplicateFrom ? undefined : null)

  React.useEffect(() => {
    if (!duplicateFrom) return
    let cancelled = false
    adminGetProduct({ data: { id: duplicateFrom } }).then((result) => {
      if (!cancelled) setSource(result)
    })
    return () => {
      cancelled = true
    }
  }, [duplicateFrom])

  const initial: Partial<ProductFormValues> | undefined = source
    ? {
        name: source.name,
        category: source.category as ProductCategory,
        subcategory: source.subcategory as ProductSubcategory,
        price: source.price,
        compareAtPrice: source.compareAtPrice ?? 0,
        stock: source.stock,
        img: source.img ?? '',
        imgTablet: source.imgTablet ?? '',
        imgMobile: source.imgMobile ?? '',
        imgAlt: source.imgAlt ?? '',
        images: source.images ?? [],
        tags: source.tags ?? [],
        description: source.description ?? '',
        preorder: source.preorder,
        shipsWithDelay: source.shipsWithDelay,
        comingSoon: source.comingSoon,
        hidePrice: source.hidePrice,
        notSellable: source.notSellable,
        placeholder: source.placeholder ?? '',
        published: source.published,
        brand: source.brand ?? '',
        condition: (source.condition as GoogleCondition) ?? 'new',
        googleProductCategory: source.googleProductCategory ?? '',
        weightLb: source.weightLb ?? 0,
        variantGroupId: source.variantGroupId ?? '',
        variantLabel: source.variantLabel ?? '',
        hideFromShopGrid: source.hideFromShopGrid,
      }
    : undefined

  // Waiting on the duplicate source to load — render the form fresh once
  // it arrives (or empty, if duplicateFrom turned out not to exist) rather
  // than flashing a blank form first.
  if (duplicateFrom && source === undefined) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
        <AdminNav />
        <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>New product</h1>
        <p style={{ fontSize: 13.5, color: '#5a6875', marginTop: 20 }}>Loading…</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>New product</h1>
      {source && (
        <p style={{ fontSize: 13, color: '#5a6875', marginTop: 6 }}>
          Duplicated from "{source.name}" — give this one its own ID, name, variant label, and Square link.
        </p>
      )}
      <ProductForm
        key={source?.id ?? 'blank'}
        submitLabel="Create product"
        initial={initial}
        onSubmit={async (values) => {
          await adminCreateProduct({
            data: {
              ...values,
              compareAtPrice: values.compareAtPrice || null,
              bestSellingRank: values.bestSellingRank || null,
              newAndUpcomingRank: values.newAndUpcomingRank || null,
              squareVariationId: values.squareVariationId || null,
              img: values.img || undefined,
              imgTablet: values.imgTablet || undefined,
              imgMobile: values.imgMobile || undefined,
              imgAlt: values.imgAlt.trim() || undefined,
              images: values.images.map((u) => u.trim()).filter(Boolean),
              description: values.description.trim() || undefined,
              placeholder: values.placeholder || undefined,
              gtin: values.gtin.trim() || null,
              brand: values.brand.trim() || undefined,
              condition: values.condition || null,
              googleProductCategory: values.googleProductCategory.trim() || undefined,
              weightLb: values.weightLb || null,
              variantGroupId: values.variantGroupId.trim() || undefined,
              variantLabel: values.variantLabel.trim() || undefined,
              variantSortOrder: values.variantSortOrder || null,
            },
          })
          navigate({ to: '/admin' })
        }}
      />
    </div>
  )
}
