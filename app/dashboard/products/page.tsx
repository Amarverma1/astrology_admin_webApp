"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Edit, Trash2, CheckCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const IMG_BASE = process.env.NEXT_PUBLIC_IMG_BASE!;

interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    short_description?: string;
    description?: string;
    price: number;
    mrp?: number;
    discount_percent?: number;
    stock: number;
    sku?: string;
    image: string | File;
    gallery?: any;
    rating?: number;
    reviews_count?: number;
    is_featured?: boolean;
    is_best_seller?: boolean;
    status: boolean;
    meta_title?: string;
    meta_description?: string;
    created_at?: string;
    updated_at?: string;
    category_name?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [expanded, setExpanded] = useState<number | null>(null);

    const [editModal, setEditModal] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [success, setSuccess] = useState(false);

    const [page, setPage] = useState(1);
    const limit = 8;
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / limit);

    // FETCH
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${API_BASE}/products?page=${page}&limit=${limit}`
            );
            const data = await res.json();
            setProducts(data.products);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    // SEARCH
    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // DELETE
    const deleteProduct = async (id: number) => {
        if (!confirm("Delete product?")) return;

        await fetch(`${API_BASE}/products/delete/${id}`, {
            method: "DELETE",
        });

        setSuccess(true);
        fetchProducts();
    };

    // TOGGLE STATUS
    const toggleStatus = async (id: number, status: boolean) => {
        await fetch(`${API_BASE}/products/toggle-status/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: !status }),
        });

        fetchProducts();
    };

    // EDIT
    const openEdit = (p: Product) => {
        setSelected(p);
        setPreview(null);
        setEditModal(true);
    };

    const updateProduct = async () => {
        if (!selected) return;

        const formData = new FormData();

        Object.entries(selected).forEach(([key, value]) => {
            if (key === "image" && value instanceof File) {
                formData.append("image", value);
            } else {
                formData.append(key, String(value ?? ""));
            }
        });

        await fetch(`${API_BASE}/products/update/${selected.id}`, {
            method: "PUT",
            body: formData,
        });

        setEditModal(false);
        setSuccess(true);
        fetchProducts();
    };

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-5">

                    {/* HEADER */}


                    <div>
                        <h1 className="text-lg font-semibold">Products</h1>
                        <p className="text-sm text-gray-500">
                            Manage your product Products
                        </p>
                    </div>


                    <div className="bg-white rounded-xl shadow-sm">

                        {/* SEARCH */}
                        <div className="p-4">
                            <input
                                placeholder="Search products..."
                                className="bg-gray-50 px-3 py-2 rounded-lg w-80"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product</th>
                                        <th>Price</th>
                                        <th>MRP</th>
                                        <th>Stock</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((p) => (
                                        <React.Fragment key={p.id}>

                                            {/* MAIN ROW */}
                                            <tr
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() =>
                                                    setExpanded(expanded === p.id ? null : p.id)
                                                }
                                            >
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <img
                                                        src={`${IMG_BASE}${p.image}`}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{p.name}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {p.short_description}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td>₹{p.price}</td>
                                                <td>₹{p.mrp || "-"}</td>
                                                <td>{p.stock}</td>
                                                <td>{p.sku || "-"}</td>
                                                <td>{p.category_name}</td>

                                                {/* STATUS */}
                                                <td>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleStatus(p.id, p.status);
                                                        }}
                                                        className={`px-3 py-1 rounded text-xs ${p.status
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-600"
                                                            }`}
                                                    >
                                                        {p.status ? "Active" : "Inactive"}
                                                    </button>
                                                </td>

                                                {/* ACTION */}
                                                <td className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEdit(p);
                                                            }}
                                                            className="p-2 bg-blue-50 rounded"
                                                        >
                                                            <Edit className="w-4 h-4 text-blue-600" />
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteProduct(p.id);
                                                            }}
                                                            className="p-2 bg-red-50 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* EXPANDED ROW */}
                                            {expanded === p.id && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={8} className="p-4 text-xs">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                                                            <p><b>ID:</b> {p.id}</p>
                                                            <p><b>Slug:</b> {p.slug}</p>
                                                            <p><b>Category ID:</b> {p.category_id}</p>
                                                            <p><b>Discount:</b> {p.discount_percent}%</p>
                                                            <p><b>Rating:</b> {p.rating}</p>
                                                            <p><b>Reviews:</b> {p.reviews_count}</p>
                                                            <p><b>Featured:</b> {p.is_featured ? "Yes" : "No"}</p>
                                                            <p><b>Best Seller:</b> {p.is_best_seller ? "Yes" : "No"}</p>
                                                            <p><b>Meta Title:</b> {p.meta_title}</p>
                                                            <p><b>Created:</b> {p.created_at}</p>
                                                            <p><b>Updated:</b> {p.updated_at}</p>

                                                            <div className="col-span-2">
                                                                <b>Description:</b>
                                                                <p>{p.description}</p>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-between p-4">
                            <p>Page {page} / {totalPages}</p>

                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 bg-gray-100 rounded"
                                >
                                    Prev
                                </button>

                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 bg-gray-100 rounded"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editModal && selected && (
                <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
                    <div className="bg-white w-[420px] p-6 overflow-y-auto">

                        <div className="flex justify-between mb-4">
                            <h2 className="font-semibold">Edit Product</h2>
                            <button onClick={() => setEditModal(false)}>✖</button>
                        </div>

                        <div className="space-y-3 text-sm">

                            {/* NAME */}
                            <input value={selected.name}
                                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                                className="w-full border p-2 rounded" placeholder="Name" />

                            {/* SLUG */}
                            <input value={selected.slug}
                                onChange={(e) => setSelected({ ...selected, slug: e.target.value })}
                                className="w-full border p-2 rounded" placeholder="Slug" />

                            {/* SHORT DESC */}
                            <input value={selected.short_description || ""}
                                onChange={(e) => setSelected({ ...selected, short_description: e.target.value })}
                                className="w-full border p-2 rounded" placeholder="Short Description" />

                            {/* DESCRIPTION */}
                            <textarea value={selected.description || ""}
                                onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                                className="w-full border p-2 rounded" placeholder="Description" />

                            {/* PRICE */}
                            <input value={selected.price}
                                onChange={(e) => setSelected({ ...selected, price: Number(e.target.value) })}
                                className="w-full border p-2 rounded" placeholder="Price" />

                            {/* MRP */}
                            <input value={selected.mrp || ""}
                                onChange={(e) => setSelected({ ...selected, mrp: Number(e.target.value) })}
                                className="w-full border p-2 rounded" placeholder="MRP" />

                            {/* DISCOUNT */}
                            <input value={selected.discount_percent || ""}
                                onChange={(e) => setSelected({ ...selected, discount_percent: Number(e.target.value) })}
                                className="w-full border p-2 rounded" placeholder="Discount %" />

                            {/* STOCK */}
                            <input value={selected.stock}
                                onChange={(e) => setSelected({ ...selected, stock: Number(e.target.value) })}
                                className="w-full border p-2 rounded" placeholder="Stock" />

                            {/* SKU */}
                            <input value={selected.sku || ""}
                                onChange={(e) => setSelected({ ...selected, sku: e.target.value })}
                                className="w-full border p-2 rounded" placeholder="SKU" />

                            {/* RATING */}
                            <input value={selected.rating || ""}
                                onChange={(e) => setSelected({ ...selected, rating: Number(e.target.value) })}
                                className="w-full border p-2 rounded" placeholder="Rating" />

                            {/* REVIEWS */}
                            <input value={selected.reviews_count || ""}
                                onChange={(e) => setSelected({ ...selected, reviews_count: Number(e.target.value) })}
                                className="w-full border p-2 rounded" placeholder="Reviews Count" />

                            {/* IMAGE UPLOAD */}
                            <input
                                type="file"
                                onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    setSelected({ ...selected, image: file });
                                    setPreview(URL.createObjectURL(file));
                                }}
                                className="w-full border p-2 rounded"
                            />

                            {/* IMAGE PREVIEW */}
                            <img
                                src={
                                    preview
                                        ? preview
                                        : typeof selected.image === "string"
                                            ? `${IMG_BASE}${selected.image}`
                                            : URL.createObjectURL(selected.image)
                                }
                                className="w-24 h-24 rounded object-cover"
                            />

                            {/* FLAGS */}
                            <label className="flex gap-2">
                                <input type="checkbox"
                                    checked={selected.is_featured || false}
                                    onChange={(e) => setSelected({ ...selected, is_featured: e.target.checked })} />
                                Featured
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox"
                                    checked={selected.is_best_seller || false}
                                    onChange={(e) => setSelected({ ...selected, is_best_seller: e.target.checked })} />
                                Best Seller
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox"
                                    checked={selected.status}
                                    onChange={(e) => setSelected({ ...selected, status: e.target.checked })} />
                                Active
                            </label>

                            {/* META */}
                            <input value={selected.meta_title || ""}
                                onChange={(e) => setSelected({ ...selected, meta_title: e.target.value })}
                                className="w-full border p-2 rounded" placeholder="Meta Title" />

                            <textarea value={selected.meta_description || ""}
                                onChange={(e) => setSelected({ ...selected, meta_description: e.target.value })}
                                className="w-full border p-2 rounded" placeholder="Meta Description" />

                            {/* UPDATE */}
                            <button
                                onClick={updateProduct}
                                className="w-full bg-green-600 text-white py-2 rounded"
                            >
                                Update Product
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS */}
            {success && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

                    <div className="bg-white px-8 py-7 rounded-2xl shadow-xl text-center animate-scaleIn w-[320px]">

                        {/* ICON */}
                        <div className="flex justify-center mb-3">
                            <div className="bg-green-100 p-3 rounded-full animate-bounce">
                                <CheckCircle className="text-green-600" size={40} />
                            </div>
                        </div>

                        {/* TEXT */}
                        <h2 className="text-lg font-semibold text-gray-800">
                            Success
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Product updated successfully
                        </p>

                        {/* BUTTON */}
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                        >
                            OK
                        </button>

                    </div>

                    {/* ANIMATION */}
                    <style jsx>{`
      .animate-scaleIn {
        animation: scaleIn 0.25s ease;
      }

      @keyframes scaleIn {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `}</style>

                </div>
            )}
        </>
    );
}