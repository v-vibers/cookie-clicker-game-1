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
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 'cursor', name: 'Cursor', baseCost: 15, cps: 0.1, count: 0, description: 'Autoclicks once every 10 seconds' },
    { id: 'grandma', name: 'Grandma', baseCost: 100, cps: 1, count: 0, description: 'A nice grandma to bake more cookies' },
    { id: 'oven', name: 'Cookie Oven', baseCost: 250, cps: 2, count: 0, description: 'Bakes cookies at a steady rate' },
    { id: 'bakery', name: 'Cookie Bakery', baseCost: 500, cps: 4, count: 0, description: 'A small bakery producing fresh cookies' },
    { id: 'farm', name: 'Cookie Farm', baseCost: 1100, cps: 8, count: 0, description: 'Grows cookie plants from cookie seeds' },
    { id: 'mine', name: 'Cookie Mine', baseCost: 12000, cps: 47, count: 0, description: 'Mines out cookie dough and chocolate chips' },
    { id: 'factory', name: 'Cookie Factory', baseCost: 130000, cps: 260, count: 0, description: 'Produces large quantities of cookies' },
    { id: 'bank', name: 'Cookie Bank', baseCost: 1400000, cps: 1400, count: 0, description: 'Generates cookies from interest' },
  ])

  // Calculate XP needed for next level
  const getXpNeededForLevel = (targetLevel: number) => {
    // Level 1->2 needs 5 XP, Level 2->3 needs 10 XP, Level 3->4 needs 15 XP, etc.
    return (targetLevel - 1) * 5
  }

  // Get current level multiplier
  const getLevelMultiplier = () => {
    return level * 0.1
  }

  // Check for level up
  useEffect(() => {
    const xpNeededForNext = getXpNeededForLevel(level + 1)
    if (xp >= xpNeededForNext) {
      setXp(prev => prev - xpNeededForNext)
      setLevel(prev => prev + 1)
    }
  }, [xp, level])

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  // Calculate cookies per second with level multiplier
  useEffect(() => {
    const baseCps = upgrades.reduce((sum, upgrade) => sum + upgrade.cps * upgrade.count, 0)
    const multiplier = getLevelMultiplier()
    const totalCps = baseCps * (1 + multiplier)
    setCps(totalCps)
  }, [upgrades, level])

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

      // Add XP when buying an upgrade
      setXp(prev => prev + 1)

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
      <button
        className="dark-mode-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

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

          {/* XP Bar */}
          <div className="xp-container">
            <div className="xp-header">
              <div className="xp-level">Level {level}</div>
              <div className="xp-multiplier">+{(getLevelMultiplier() * 100).toFixed(0)}% CPS</div>
            </div>
            <div className="xp-bar-container">
              <div
                className="xp-bar-fill"
                style={{ width: `${(xp / getXpNeededForLevel(level + 1)) * 100}%` }}
              />
              <div className="xp-bar-text">
                {xp} / {getXpNeededForLevel(level + 1)} XP
              </div>
            </div>
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
