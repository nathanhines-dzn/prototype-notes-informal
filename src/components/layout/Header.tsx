import teachstoneLogo from '../../assets/teachstone-logo.png'

export function Header() {
  const navItems = [
    'Home',
    'Learning',
    'Observations',
    'Certification',
    'Community',
    'Manage Organization',
  ]

  return (
    <header className="flex border-b border-gray-200 bg-white">
      <div className="mx-5 flex h-24 w-full items-center justify-between px-14">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4">
            <img
              src={teachstoneLogo}
              alt="Teachstone"
              className="h-11 w-auto"
            />
          </div>
          <nav className="hidden items-center gap-4 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                className="px-3 py-5 text-base text-teachstone-slate hover:text-teachstone-teal"
              >
                {item}
                {['Learning', 'Observations', 'Community'].includes(item) ? ' ▾' : ''}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-5 text-base text-teachstone-slate">
            Help
          </button>
          <div className="h-16 w-px bg-gray-200" />
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 text-base text-teachstone-slate"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm">
              NH
            </span>
            Nathan H. ▾
          </button>
        </div>
      </div>
    </header>
  )
}
