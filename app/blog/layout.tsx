import Header from '../../components/Header'

export default function Layout({ children }) {
  return (
    <>
      <div className="sticky top-0 w-full z-50 bg-white shadow">
        <Header />
      </div>
      <main>
        {children}
      </main>
    </>
  )
}
