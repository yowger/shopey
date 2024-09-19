"use client"

import { createContext, useRef, useContext } from "react"
import { useStore } from "zustand"

import { createProductStore, initStore } from "@/app/dashboard/products/_stores"

import type { ReactNode } from "react"
import type { StoreApi } from "zustand"
import type { Store } from "@/app/dashboard/products/_stores"

export const ProductStoreContext = createContext<StoreApi<Store> | null>(null)

export interface ProductStoreProviderProps {
    children: ReactNode
}

export const ProductStoreProvider = ({
    children,
}: ProductStoreProviderProps) => {
    const storeRef = useRef<StoreApi<Store>>()
    if (!storeRef.current) {
        storeRef.current = createProductStore(initStore())
    }

    return (
        <ProductStoreContext.Provider value={storeRef.current}>
            {children}
        </ProductStoreContext.Provider>
    )
}

export const useProductStore = <T,>(selector: (store: Store) => T): T => {
    const productStoreContext = useContext(ProductStoreContext)

    if (!productStoreContext) {
        throw new Error(
            `useProductStore must be used within ProductStoreProvider`
        )
    }

    return useStore(productStoreContext, selector)
}
