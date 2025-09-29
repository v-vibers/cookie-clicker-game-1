import { useState, useEffect } from 'react'
import './App.css'

interface Upgrade {
  id: string
  name: string
  baseCost: number
  cps: number
  count: number
  description: string
}

function App() {
  const [cookies, setCookies] = useState(0)
  const [totalCookies, setTotalCookies] = useState(0)
  const [cps, setCps] = useState(0)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 'cursor', name: 'Cursor', baseCost: 15, cps: 0.1, count: 0, description: 'Autoclicks once every 10 seconds' },
    { id: 'grandma', name: 'Grandma', baseCost: 100, cps: 1, count: 0, description: 'A nice grandma to bake more cookies' },
    { id: 'farm', name: 'Cookie Farm', baseCost: 1100, cps: 8, count: 0, description: 'Grows cookie plants from cookie seeds' },
    { id: 'mine', name: 'Cookie Mine', baseCost: 12000, cps: 47, count: 0, description: 'Mines out cookie dough and chocolate chips' },
    { id: 'factory', name: 'Cookie Factory', baseCost: 130000, cps: 260, count: 0, description: 'Produces large quantities of cookies' },
    { id: 'bank', name: 'Cookie Bank', baseCost: 1400000, cps: 1400, count: 0, description: 'Generates cookies from interest' },
  ])

  // Calculate cookies per second
  useEffect(() => {
    const totalCps = upgrades.reduce((sum, upgrade) => sum + upgrade.cps * upgrade.count, 0)
    setCps(totalCps)
  }, [upgrades])

  // Auto-generate cookies based on CPS
  useEffect(() => {
    if (cps > 0) {
      const interval = setInterval(() => {
        setCookies(prev => prev + cps / 10)
        setTotalCookies(prev => prev + cps / 10)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [cps])

  const handleCookieClick = () => {
    setCookies(cookies + 1)
    setTotalCookies(totalCookies + 1)
  }

  const calculateUpgradeCost = (upgrade: Upgrade) => {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count))
  }

  const buyUpgrade = (upgradeId: string) => {
    setUpgrades(prevUpgrades => {
      const upgrade = prevUpgrades.find(u => u.id === upgradeId)
      if (!upgrade) return prevUpgrades

      const cost = calculateUpgradeCost(upgrade)
      if (cookies < cost) return prevUpgrades

      setCookies(cookies - cost)

      return prevUpgrades.map(u =>
        u.id === upgradeId ? { ...u, count: u.count + 1 } : u
      )
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K'
    return Math.floor(num).toLocaleString()
  }

  return (
    <div className="game-container">
      <div className="left-panel">
        <div className="stats">
          <h1>🍪 Cookie Clicker</h1>
          <div className="cookie-count">
            <div className="count-number">{formatNumber(cookies)}</div>
            <div className="count-label">cookies</div>
          </div>
          <div className="cps-display">
            per second: <span className="cps-value">{cps.toFixed(1)}</span>
          </div>
          <div className="total-cookies">
            Total baked: {formatNumber(totalCookies)}
          </div>
        </div>

        <div className="cookie-clicker">
          <button
            className="cookie-button"
            onClick={handleCookieClick}
            aria-label="Click cookie"
          >
            🍪
          </button>
          <div className="click-instruction">Click the cookie!</div>
        </div>
      </div>

      <div className="right-panel">
        <h2>Upgrades</h2>
        <div className="upgrades-list">
          {upgrades.map(upgrade => {
            const cost = calculateUpgradeCost(upgrade)
            const canAfford = cookies >= cost

            return (
              <button
                key={upgrade.id}
                className={`upgrade-card ${canAfford ? 'affordable' : 'locked'}`}
                onClick={() => buyUpgrade(upgrade.id)}
                disabled={!canAfford}
              >
                <div className="upgrade-header">
                  <div className="upgrade-name">{upgrade.name}</div>
                  <div className="upgrade-count">{upgrade.count}</div>
                </div>
                <div className="upgrade-description">{upgrade.description}</div>
                <div className="upgrade-stats">
                  <div className="upgrade-cps">+{upgrade.cps} CPS</div>
                  <div className="upgrade-cost">{formatNumber(cost)} 🍪</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
