export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-6">
      <div className="container flex flex-col  justify-center gap-4 text-center md:gap-6 ml-200">
        <div className="flex gap-4">
          <p className="text-sm text-muted-foreground ml-40">
            Created by Ramkrishna Karmakar
          </p>
          <a
            href="https://github.com/ramkarmakar12"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ramkrishna-karmakar-8119a5199/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
