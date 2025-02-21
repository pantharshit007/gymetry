import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Track your progress, visualize your gains.
          </p>
        </div>

        {/* <div className="space-y-4">
          <h3 className="text-sm font-medium">Connect</h3>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/pantharshit007/gymetry"
              className="hover:text-brand text-muted-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com/pantharshit007"
              className="hover:text-brand text-muted-foreground transition-colors"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <title>X</title>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div> */}
      </div>
      <div className="container border-t py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gymetry, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
