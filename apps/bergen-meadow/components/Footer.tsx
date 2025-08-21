import React from 'react'

const Footer = () => {
  return (
    <footer className="footer footer-center p-6 bg-primary text-base-content">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - The Trails Collective -
          Friends & Neighbors in Support of Bergen Meadow&apos;s Best Plan.
        </p>
      </aside>
    </footer>
  )
}

export default Footer
