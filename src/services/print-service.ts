/**
 * Hybrid Print Routing Service
 *
 * Detects the client platform and routes print jobs accordingly:
 * - Desktop (Windows/Mac): QZ Tray WebSocket → ESC/POS raw commands
 * - Mobile (Android): intent:// URL → RawBT app
 * - Fallback: window.print()
 */

type Platform = 'desktop' | 'mobile-android' | 'mobile-ios' | 'unknown'

interface QzTrayConfig {
  host: string
  port: number
  secure: boolean
}

interface PrintResult {
  success: boolean
  method: 'qz-tray' | 'rawbt' | 'browser-print' | 'none'
  message: string
}

const DEFAULT_QZ_CONFIG: QzTrayConfig = {
  host: 'localhost',
  port: 8182,
  secure: false
}

/**
 * Detects the current client platform.
 */
export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown'

  const ua = navigator.userAgent.toLowerCase()

  if (/android/i.test(ua)) return 'mobile-android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'mobile-ios'
  if (/win|mac|linux/i.test(ua) && !/android|mobile/i.test(ua)) return 'desktop'

  return 'unknown'
}

/**
 * Checks if QZ Tray is available via WebSocket.
 */
export async function checkQzTrayConnection(config: QzTrayConfig = DEFAULT_QZ_CONFIG): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const protocol = config.secure ? 'wss' : 'ws'
      const ws = new WebSocket(`${protocol}://${config.host}:${config.port}`)

      const timeout = setTimeout(() => {
        ws.close()
        resolve(false)
      }, 3000)

      ws.onopen = () => {
        clearTimeout(timeout)
        ws.close()
        resolve(true)
      }

      ws.onerror = () => {
        clearTimeout(timeout)
        resolve(false)
      }
    } catch {
      resolve(false)
    }
  })
}

/**
 * Gets list of available printers from QZ Tray.
 */
export async function scanQzPrinters(config: QzTrayConfig = DEFAULT_QZ_CONFIG): Promise<string[]> {
  return new Promise((resolve) => {
    try {
      const protocol = config.secure ? 'wss' : 'ws'
      const ws = new WebSocket(`${protocol}://${config.host}:${config.port}`)

      const timeout = setTimeout(() => {
        ws.close()
        resolve([])
      }, 5000)

      ws.onopen = () => {
        // Send a request to list printers
        ws.send(
          JSON.stringify({
            call: 'printers.getDefault',
            promise: { callId: 'list-printers' },
            params: {}
          })
        )
      }

      ws.onmessage = (event: MessageEvent) => {
        clearTimeout(timeout)
        try {
          const data = JSON.parse(String(event.data)) as { result?: string[] }
          ws.close()
          resolve(Array.isArray(data.result) ? data.result : [])
        } catch {
          ws.close()
          resolve([])
        }
      }

      ws.onerror = () => {
        clearTimeout(timeout)
        resolve([])
      }
    } catch {
      resolve([])
    }
  })
}

/**
 * Sends an HTML receipt to print via the appropriate method.
 */
export async function printReceipt(receiptHtml: string, printerName?: string): Promise<PrintResult> {
  const platform = detectPlatform()

  switch (platform) {
    case 'desktop':
      return printViaQzTray(receiptHtml, printerName)
    case 'mobile-android':
      return printViaRawBT(receiptHtml)
    case 'mobile-ios':
    default:
      return printViaBrowser(receiptHtml)
  }
}

/**
 * Desktop: Print via QZ Tray WebSocket
 */
async function printViaQzTray(receiptHtml: string, printerName?: string, config: QzTrayConfig = DEFAULT_QZ_CONFIG): Promise<PrintResult> {
  try {
    const isConnected = await checkQzTrayConnection(config)
    if (!isConnected) {
      return { success: false, method: 'qz-tray', message: 'QZ Tray is not running or not reachable' }
    }

    return new Promise((resolve) => {
      const protocol = config.secure ? 'wss' : 'ws'
      const ws = new WebSocket(`${protocol}://${config.host}:${config.port}`)

      const timeout = setTimeout(() => {
        ws.close()
        resolve({ success: false, method: 'qz-tray', message: 'Print request timed out' })
      }, 10000)

      ws.onopen = () => {
        const printData = {
          call: 'print',
          promise: { callId: 'print-receipt' },
          params: {
            printer: printerName || 'default',
            options: { type: 'html', format: 'plain' },
            data: [{ type: 'html', format: 'plain', data: receiptHtml }]
          }
        }
        ws.send(JSON.stringify(printData))
      }

      ws.onmessage = () => {
        clearTimeout(timeout)
        ws.close()
        resolve({ success: true, method: 'qz-tray', message: 'Receipt sent to printer' })
      }

      ws.onerror = () => {
        clearTimeout(timeout)
        resolve({ success: false, method: 'qz-tray', message: 'WebSocket connection error' })
      }
    })
  } catch {
    return { success: false, method: 'qz-tray', message: 'Failed to connect to QZ Tray' }
  }
}

/**
 * Mobile Android: Print via RawBT intent URL
 */
function printViaRawBT(receiptHtml: string): PrintResult {
  try {
    const encodedHtml = encodeURIComponent(receiptHtml)
    const intentUrl = `intent://rawbt/print?html=${encodedHtml}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`

    window.location.href = intentUrl

    return { success: true, method: 'rawbt', message: 'Receipt sent to RawBT' }
  } catch {
    return { success: false, method: 'rawbt', message: 'Failed to open RawBT app' }
  }
}

/**
 * Fallback: Print via browser window.print()
 */
function printViaBrowser(receiptHtml: string): PrintResult {
  try {
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (!printWindow) {
      return { success: false, method: 'browser-print', message: 'Pop-up blocked. Please allow pop-ups.' }
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { margin: 0; }
            }
          </style>
        </head>
        <body>${receiptHtml}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()

    setTimeout(() => printWindow.close(), 1000)

    return { success: true, method: 'browser-print', message: 'Print dialog opened' }
  } catch {
    return { success: false, method: 'browser-print', message: 'Failed to open print dialog' }
  }
}
