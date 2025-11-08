import { ThemeToggle } from '@/components/theme-toggle'

export default function TypographyDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Typography Demo</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Prose Content */}
        <article className="prose prose-neutral dark:prose-invert lg:prose-lg mx-auto">
          <h1>TailwindCSS Typography Plugin</h1>

          <p className="lead">
            This page demonstrates the @tailwindcss/typography plugin with beautiful
            typographic defaults for rendered content from sources like markdown or CMS.
          </p>

          <h2>What is the Typography Plugin?</h2>

          <p>
            The <code>@tailwindcss/typography</code> plugin provides a set of prose classes
            you can use to add beautiful typographic defaults to any vanilla HTML you don't
            control, like HTML rendered from Markdown, or pulled from a CMS.
          </p>

          <blockquote>
            <p>
              "The typography plugin adds a set of prose classes that can be used to
              quickly add sensible typography styles to content blocks."
            </p>
          </blockquote>

          <h2>Features</h2>

          <p>The typography plugin includes styles for:</p>

          <ul>
            <li>Headings (h1 through h6)</li>
            <li>Paragraphs with optimal line height and spacing</li>
            <li>Lists (ordered and unordered) with proper indentation</li>
            <li>Blockquotes with elegant styling</li>
            <li>Code blocks with monospace fonts</li>
            <li>Tables with borders and spacing</li>
            <li>Links with hover states</li>
            <li>And much more!</li>
          </ul>

          <h3>Code Examples</h3>

          <p>Inline code looks like this: <code>const example = 'Hello World'</code></p>

          <p>Block code examples:</p>

          <pre><code>{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}</code></pre>

          <h3>Ordered Lists</h3>

          <ol>
            <li>First item with automatic numbering</li>
            <li>Second item with proper spacing</li>
            <li>Third item demonstrates consistency</li>
            <li>Fourth item completes the list</li>
          </ol>

          <h2>Tables</h2>

          <p>Tables are styled automatically with proper borders and spacing:</p>

          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TailwindCSS 4</td>
                <td>Latest version with CSS-first configuration</td>
                <td>✅ Installed</td>
              </tr>
              <tr>
                <td>shadcn/ui</td>
                <td>Beautifully designed components</td>
                <td>✅ Configured</td>
              </tr>
              <tr>
                <td>Typography</td>
                <td>Prose styling for content</td>
                <td>✅ Active</td>
              </tr>
              <tr>
                <td>Theme Toggle</td>
                <td>Light/Dark mode switching</td>
                <td>✅ Working</td>
              </tr>
            </tbody>
          </table>

          <h2>Theme Adaptation</h2>

          <p>
            The typography styles automatically adapt to your theme. Toggle between
            light and dark mode using the button in the header to see how the prose
            content maintains excellent readability in both modes.
          </p>

          <h3>Dark Mode Support</h3>

          <p>
            The <code>dark:prose-invert</code> class ensures that prose content looks
            great in dark mode with inverted colors that maintain proper contrast ratios
            for accessibility.
          </p>

          <hr />

          <h2>Responsive Typography</h2>

          <p>
            Typography sizes scale responsively. The <code>lg:prose-lg</code> modifier
            increases font sizes on larger screens for better readability.
          </p>

          <h4>Smaller Heading Level</h4>

          <p>
            Even smaller headings like h4, h5, and h6 receive appropriate styling
            that maintains the visual hierarchy of your content.
          </p>

          <h5>Heading 5 Example</h5>

          <p>This is a paragraph after an h5 heading.</p>

          <h6>Heading 6 Example</h6>

          <p>This is a paragraph after an h6 heading.</p>

          <h2>Conclusion</h2>

          <p>
            The typography plugin is perfect for blog posts, documentation, articles,
            or any content-heavy pages where you need beautiful, consistent typography
            without manually styling every element.
          </p>

          <p>
            Combined with TailwindCSS 4's theming system and shadcn/ui components,
            you have a complete design system ready for production use.
          </p>
        </article>
      </main>
    </div>
  )
}
