import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => {
  return (
    <>
        <Header/>
        <main className="main-content">
            {props.children}
        </main>
        <Footer/>
    </>
  )
}

export default Layout
