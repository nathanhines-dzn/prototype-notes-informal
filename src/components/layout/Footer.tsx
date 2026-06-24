import teachstoneLogo from '../../assets/teachstone-logo.png'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-[#ebebeb] text-[#222222]">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-start justify-between gap-8 px-20 py-8">
        <img
          src={teachstoneLogo}
          alt="Teachstone"
          className="h-11 w-auto"
        />
        <div className="space-y-2 text-base">
          <div>Privacy Policy</div>
          <div>Terms of Use</div>
          <div>Web Accessibility</div>
          <div>Support</div>
        </div>
        <div className="flex gap-2">
          {['F', 'L', 'T', 'P'].map((label) => (
            <div
              key={label}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-sm"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-black/80">
        © 2026 Teachstone Training, LLC
      </div>
    </footer>
  )
}
