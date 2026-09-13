"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Scan, Plus, Minus, Trash2, Camera, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { localDb } from "@/lib/localdb"
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode"

type CollectedItem = {
  productId: string
  code: string
  name: string
  quantity: number
}

export default function CollectorForm({ 
  inventoryId, 
  locationId, 
  locationCode, 
  operatorId, 
  products 
}: any) {
  const router = useRouter()
  const [items, setItems] = useState<CollectedItem[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (showScanner) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: {width: 250, height: 250},
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        },
        false
      )
      
      scannerRef.current.render((decodedText) => {
        setSearchInput(decodedText)
        setShowScanner(false)
        scannerRef.current?.clear()
        
        // Simula o submit da busca
        processSearch(decodedText)
      }, undefined)
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }

    return () => {
      if (scannerRef.current) scannerRef.current.clear()
    }
  }, [showScanner])

  const processSearch = (term: string) => {
    if (!term.trim()) return

    const upperTerm = term.trim().toUpperCase()
    const found = products.find((p: any) => 
      p.code.toUpperCase() === upperTerm || 
      p.barcode?.toUpperCase() === upperTerm ||
      p.name.toUpperCase().includes(upperTerm)
    )

    if (found) {
      setItems(prev => {
        const existing = prev.find(i => i.productId === found.id)
        if (existing) {
          return prev.map(i => i.productId === found.id ? { ...i, quantity: i.quantity + 1 } : i)
        } else {
          return [{ productId: found.id, code: found.code, name: found.name, quantity: 1 }, ...prev]
        }
      })
      setSearchInput("") 
    } else {
      alert("Produto não encontrado!")
    }
  }

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault()
    processSearch(searchInput)
  }

  const changeQuantity = (productId: string, delta: number) => {
    setItems(items.map(i => {
      if (i.productId === productId) {
        const newQ = i.quantity + delta
        return { ...i, quantity: newQ > 0 ? newQ : 1 }
      }
      return i
    }))
  }

  const setExactQuantity = (productId: string, val: string) => {
    const num = parseInt(val, 10)
    if (!isNaN(num) && num > 0) {
      setItems(items.map(i => i.productId === productId ? { ...i, quantity: num } : i))
    }
  }

  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId))
  }

  const handleFinish = async () => {
    if (items.length === 0) return

    const payload = {
      inventoryId,
      locationId,
      operatorId,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
    }

    if (localDb) {
      // Salva offline no Dexie na fila de sincronização
      await localDb.syncQueue.add({
        operation: 'SUBMIT_COLLECTION',
        entityId: `${inventoryId}_${locationId}`,
        payload,
        status: navigator.onLine ? 'PENDING' : 'PENDING',
        attempts: 0,
        createdAt: new Date()
      })

      // Redireciona para a tela de sync que tentará processar
      router.push('/collector/sync')
    } else {
      // Fallback pra envio normal se IndexedDB não rolar (improvável em PWA)
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'SUBMIT_COLLECTION', payload })
      }).then(() => {
        router.push('/collector')
      })
    }
  }

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <Link href="/collector">
            <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-500 rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{locationCode}</h1>
            <p className="text-indigo-200 text-xs">Coleta em Andamento</p>
          </div>
        </div>
        <div className="bg-indigo-800 px-3 py-1 rounded-full text-sm font-bold shadow-inner">
          {items.length} itens
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setShowScanner(false)}
          >
            <X className="h-8 w-8" />
          </Button>
          <div className="w-full max-w-sm p-4 bg-white rounded-lg">
            <div id="reader" className="w-full"></div>
            <p className="text-center text-sm mt-4 text-gray-500">Aponte para o código de barras</p>
          </div>
        </div>
      )}

      {/* Área de Bipagem */}
      <div className="p-4 bg-white shadow-sm z-10">
        <form onSubmit={handleScan} className="flex gap-2">
          <Button 
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 border-gray-300"
            onClick={() => setShowScanner(true)}
          >
            <Camera className="h-6 w-6 text-gray-600" />
          </Button>
          <div className="relative flex-1">
            <Scan className="absolute left-3 top-3 h-6 w-6 text-indigo-400" />
            <Input 
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Cód. Barras ou SKU..." 
              className="pl-12 h-12 text-lg uppercase font-medium bg-gray-50 border-gray-300 focus-visible:ring-indigo-500"
              autoFocus
            />
          </div>
          <Button type="submit" size="icon" className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-6 w-6" />
          </Button>
        </form>
      </div>

      {/* Lista de Itens */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 mt-10">
            <Scan className="h-16 w-16 opacity-50" />
            <p className="text-lg font-medium text-center">Bipe um produto ou<br/>leia com a câmera</p>
          </div>
        ) : (
          <div className="space-y-3 pb-24">
            {items.map((item) => (
              <div key={item.productId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{item.code}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{item.name}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.productId)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => changeQuantity(item.productId, -1)}
                      className="h-10 w-10 p-0 rounded-md bg-white shadow-sm text-gray-600 active:bg-gray-200"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    
                    <input 
                      type="number" 
                      name={`qty_${item.productId}`}
                      value={item.quantity}
                      onChange={(e) => setExactQuantity(item.productId, e.target.value)}
                      className="w-16 h-10 text-center font-bold text-lg bg-transparent border-none focus:ring-0"
                    />

                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => changeQuantity(item.productId, 1)}
                      className="h-10 w-10 p-0 rounded-md bg-white shadow-sm text-indigo-600 active:bg-indigo-100"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Send */}
      <div className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 absolute bottom-0 left-0 right-0">
        <Button 
          type="button" 
          onClick={handleFinish}
          disabled={items.length === 0}
          className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2"
        >
          <Send className="h-6 w-6" />
          Finalizar Coleta
        </Button>
      </div>
    </div>
  )
}
